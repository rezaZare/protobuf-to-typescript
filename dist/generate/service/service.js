import path from "path";
import * as protobuf from "protobufjs";
import { code, joinCode } from "../../ts-poet";
import { capitalizeFirstLetter } from "../../utils/case";
import { getFileName } from "../../utils/extension";
import { TypeReview } from "../types/typeReview";
import { getTypeListByTypes } from "../types/typeUtil";
import { Method } from "./method";
export class Service {
    constructor(element, filepath) {
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
    generate(importedType) {
        let serviceRelativePath = path.relative(this.filepath.outPath, this.filepath.grpcPath);
        let globalRelativePath = path.relative(this.filepath.outPath, this.filepath.globalpath);
        let pbName = getFileName(this.filepath.grpcPb);
        let pbServiceName = getFileName(this.filepath.grpcServicePb);
        let pbImport = `import * as ${pbName} from '${serviceRelativePath}/${pbName}';`;
        let pbServiceImport = `import * as ${pbServiceName} from '${serviceRelativePath}/${capitalizeFirstLetter(pbServiceName)}';`;
        let globalImport = `import * as global from '${globalRelativePath}'`;
        for (let importType of importedType) {
            if (!importType.filePath || !importType.filePath.outPath)
                continue;
            let importedGrpcPath = path.relative(importType.filePath.outPath, importType.filePath.grpcPath);
            pbImport += `\n\rimport * as ${importType.name}_pb from '${importedGrpcPath}/${getFileName(importType.filePath.grpcPb)}';`;
        }
        if (this.service) {
            let _code = this.generateCode(this.service.name, pbServiceName, pbImport, pbServiceImport, globalImport);
            return _code;
        }
        return undefined;
    }
    getService(element) {
        if (element instanceof protobuf.Root) {
            if (element.nested) {
                return this.getService(element.nested);
            }
        }
        else {
            if (typeof element == "object") {
                for (const [key, value] of Object.entries(element)) {
                    if (value instanceof protobuf.Service) {
                        return value;
                    }
                    else if (value instanceof protobuf.Namespace) {
                        return this.getService(value["nested"]);
                    }
                }
            }
        }
    }
    generateCode(apiName, pbServiceName, pbImport, pbServiceImport, globalImport) {
        return code `
  //---------------------------------------------------------------
  // -----                  Service Section                   -----
  //---------------------------------------------------------------
    ${pbImport}
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
            return joinCode(this.methods.filter((x) => x.code !== undefined).map((x) => x.code), { on: "\n" }).toString();
        }
        return "";
    }
    generateClientCode(apiName, pbServiceName) {
        return code `client = (): ${pbServiceName}.${apiName}Client => {
          const _client = new ${pbServiceName}.${apiName}Client(
            global.srvPath(),
            {}
          );
          global.enabledDevMode(_client);
          return _client;
        };`;
    }
    typeReview(internalTypes, importedTypes) {
        var _a;
        let typeReview = new TypeReview();
        if (((_a = this.methods) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            this.methods.forEach((method) => {
                method.requestType = typeReview.serviceResponseType(method.requestType, internalTypes, importedTypes);
                method.responseType = typeReview.serviceResponseType(method.responseType, internalTypes, importedTypes);
                method.generateCode();
            });
        }
    }
}
export function reviewServiceType(fileBlocks) {
    fileBlocks.forEach((fileBlock) => {
        var _a, _b;
        if (((_b = (_a = fileBlock.Service) === null || _a === void 0 ? void 0 : _a.methods) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            let _internalTypes = getTypeListByTypes(fileBlock.typeList);
            fileBlock.Service.typeReview(_internalTypes, fileBlock.importedType);
        }
        else {
            fileBlock.nested = reviewServiceType(fileBlock.nested);
        }
    });
    return fileBlocks;
}
//# sourceMappingURL=service.js.map