import * as fs from "fs";
import * as path from "path";
import protobuf from "protobufjs";
import * as descriptor from "protobufjs/ext/descriptor";
import { imp, Import } from "ts-poet";
import { FileUtil } from "../../utils/fileUtil";

import {
  blockType,
  CodeBlock,
  FileInfoType,
  ImportedType,
  ListOfFileTypes,
  PathInfo,
} from "../model";

import { generateImportCode } from "../imports/generateImportCode";
import { generateTypes } from "../types/generateTypes";
import { Service } from "../service/service";
import { getFileName } from "../../utils/extension";

export class FileInfo {
  files: FileInfoType[];
  allType: ImportedType[];
  async load(root, grpcPath, outPath, globalpath) {
    this.files = await this.loadInfo(root, grpcPath, outPath, globalpath);
    this.allType = this.getAllType(this.files);
    this.files = this.getImportedTypes(this.files, this.allType);
  }
  private async loadInfo(
    root,
    grpcPath,
    outPath,
    globalpath
  ): Promise<FileInfoType[]> {
    let result: FileInfoType[] = [];
    let directorys = await fs.readdirSync(root, { withFileTypes: true });

    for (let dirent of directorys) {
      const isDirectory = dirent.isDirectory();
      let nestedDirectory: FileInfoType[] = [];
      let typeBlocks: CodeBlock[] = [];
      let service: Service;
      let imports: Import[] = [];
      let pathResolved = "";
      let fileName = getFileName(dirent.name);

      let pathInfo: PathInfo = {
        outPath: outPath,
        pbName: dirent.name,
        grpcPb: fileName + "_pb.js",
        grpcServicePb: fileName + "ServiceClientPb.ts",
        path: root,
        tsName: fileName + ".ts",
        grpcPath: grpcPath,
        pathResolved: pathResolved,
        globalpath: globalpath,
        fileName: fileName,
      };
      if (isDirectory) {
        nestedDirectory = await this.loadInfo(
          root + "/" + dirent.name,
          grpcPath + "/" + dirent.name,
          outPath + "/" + dirent.name,
          globalpath
        );
      } else {
        //Fill Imports and codes
        pathResolved = path.resolve(root + "/" + dirent.name);
        let data = await new FileUtil().read(pathResolved);
        if (data) {
          let parsed = protobuf.parse(data);

          if (parsed.imports?.length > 0) {
            imports = generateImportCode(parsed.imports);
          }
        }

        let protoBuf = await this.loadProtoBuf(pathResolved);
        if (protoBuf) {
          typeBlocks = generateTypes(protoBuf, imports);
          service = new Service(protoBuf, pathInfo);
        }
      }
      result.push({
        path: pathInfo,
        name: getFileName(dirent.name),
        isDirectory: isDirectory,
        nested: nestedDirectory,
        imports: imports,
        codeBlock: typeBlocks,
        Service: service,
        typeList: this.getFileTypes(typeBlocks),
        importedType: [],
      });
    }

    return result;
  }
  private async loadProtoBuf(filePath: string) {
    return await protobuf.loadSync(filePath);
  }
  private getFileTypes(blocks: CodeBlock[]) {
    let types: ListOfFileTypes[] = [];
    if (blocks.length > 0) {
      blocks.forEach((block) => {
        if (
          block.blockType == blockType.TYPE ||
          block.blockType == blockType.ENUM
        ) {
          types.push({
            name: block.name,
            isNamespace: false,
            nested: undefined,
            fields: block.fields,
            type: block.blockType,
          });
        } else if (block.blockType == blockType.NAMESPACE) {
          let nestedTypes = this.getFileTypes(block.blocks);
          types.push({
            name: block.name,
            isNamespace: true,
            nested: nestedTypes,
          });
        }
      });
    }
    return types;
  }
  private getAllType(files: FileInfoType[]) {
    let typeList: ImportedType[] = [];
    for (let file of files) {
      if (file.isDirectory) {
        typeList.push(...this.getAllType(file.nested));
      } else {
        if (file.typeList?.length > 0) {
          typeList.push({
            fileName: file.name,
            name: "",
            types: file.typeList,
            fieldType: [],
            importStr: "",
            filePath: file.path,
          });
        }
      }
    }
    return typeList;
  }
  private getImportedTypes(files: FileInfoType[], allTypes: ImportedType[]) {
    files.forEach((file) => {
      if (file.isDirectory) {
        file.nested = this.getImportedTypes(file.nested, allTypes);
      } else {
        file.importedType = [];
        file.imports.forEach((imp) => {
          let spl = imp.source.split("/");
          let fileName = spl[spl.length - 1];
          let importedTypes = allTypes.filter((x) => x.fileName == fileName);

          if (importedTypes.length > 0) {
            importedTypes.forEach((item) => {
              item.name = imp.symbol;
              item.import = imp;
            });
            file.importedType.push(...importedTypes);
          }
          //'../common/types_common_v1'
        });
      }
    });
    return files;
  }
}
