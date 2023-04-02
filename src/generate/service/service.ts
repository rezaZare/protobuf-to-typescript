import path from "path";
import * as protobuf from "protobufjs";
import { code, Code, imp, joinCode } from "../../ts-poet";
import { capitalizeFirstLetter } from "../../utils/case";
import { getFileName } from "../../utils/extension";
import {
  FileInfoType,
  ImportedType,
  ListOfFileTypes,
  PathInfo,
  ServiceType,
} from "../model";
import { TypeReview } from "../types/typeReview";
import { getTypeListByTypes } from "../types/typeUtil";
import { Method } from "./method";

export class Service {
  methods: Method[];
  filepath: PathInfo;
  service: protobuf.Service;
  constructor(element, filepath: PathInfo) {
    this.filepath = filepath;
    this.service = this.getService(element);
    let pbName = getFileName(this.filepath.grpcPb);
    if (this.service) {
      this.methods = [];
      for (const [key, value] of Object.entries(this.service.methods)) {
        if (value instanceof protobuf.Method) {
          this.methods.push(new Method(value, pbName));
        }
      }
    }
  }

  generate(importedType?: ImportedType[]): Code {
    let serviceRelativePath = path.relative(
      this.filepath.outPath,
      this.filepath.grpcPath
    );
    let globalRelativePath = path.relative(
      this.filepath.outPath,
      this.filepath.globalpath
    );

    let pbName = getFileName(this.filepath.grpcPb);
    let pbServiceName = getFileName(this.filepath.grpcServicePb);

    let pbClientImport = `import * as ${pbName} from '${serviceRelativePath}/${pbName}';`;
    let pbServiceImport = `import * as ${pbServiceName} from '${serviceRelativePath}/${capitalizeFirstLetter(
      pbServiceName
    )}';`;
    let globalImport = `import * as global from '${globalRelativePath}'`;

    for (let importType of importedType) {
      if (!importType.filePath || !importType.filePath.outPath) continue;
      let importedGrpcPath = path.relative(
        importType.filePath.outPath,
        importType.filePath.grpcPath
      );
      pbClientImport += `\n\rimport * as ${
        importType.name
      }_pb from '${importedGrpcPath}/${getFileName(
        importType.filePath.grpcPb
      )}';`;
    }

    if (this.service) {
      let _code = this.generateCode(
        this.service.name,
        pbServiceName,
        pbClientImport,
        pbServiceImport,
        globalImport
      );

      return _code;
    }
    return undefined;
  }
  getService(element): protobuf.Service {
    if (element instanceof protobuf.Root) {
      if (element.nested) {
        return this.getService(element.nested);
      }
    } else {
      if (typeof element == "object") {
        for (const [key, value] of Object.entries(element)) {
          if (value instanceof protobuf.Service) {
            return value;
          } else if (value instanceof protobuf.Namespace) {
            return this.getService(value["nested"]);
          }
        }
      }
    }
  }
  generateCode(
    apiName: string,
    pbServiceName: string,
    pbClientImport,
    pbServiceImport,
    globalImport
  ) {
    return code`
  //---------------------------------------------------------------
  // -----                  Service Section                   -----
  //---------------------------------------------------------------
    ${pbClientImport}
    ${pbServiceImport}
    ${globalImport}
    
    export class Services {
              //import section
              ${this.generateClientCode(apiName, pbServiceName)}
              ${this.getAllMethodCode()}
          }`;
  }
  getAllMethodCode() {
    if (this.methods.length > 0) {
      return joinCode(
        this.methods.filter((x) => x.code !== undefined).map((x) => x.code),
        { on: "\n" }
      ).toString();
    }
    return "";
  }

  generateClientCode(apiName: string, pbServiceName: string) {
    return code`client = (): ${pbServiceName}.${apiName}Client => {
          const _client = new ${pbServiceName}.${apiName}Client(
            global.srvPath(),
            {}
          );
          global.enabledDevMode(_client);
          return _client;
        };`;
  }

  typeReview(internalTypes: string[], importedTypes: ImportedType[]) {
    let typeReview = new TypeReview();
    if (this.methods?.length > 0) {
      this.methods.forEach((method) => {
        method.requestType = typeReview.serviceResponseType(
          method.requestType,
          internalTypes,
          importedTypes
        );
        method.responseType = typeReview.serviceResponseType(
          method.responseType,
          internalTypes,
          importedTypes
        );

        method.generateCode();
      });
    }
  }
}

export function reviewServiceType(fileBlocks: FileInfoType[]) {
  fileBlocks?.forEach((fileBlock) => {
    if (fileBlock.Service?.methods?.length > 0) {
      let _internalTypes = getTypeListByTypes(fileBlock.typeList);

      fileBlock.Service.typeReview(_internalTypes, fileBlock.importedType);
    } else {
      fileBlock.nested = reviewServiceType(fileBlock.nested);
    }
  });
  return fileBlocks;
}
