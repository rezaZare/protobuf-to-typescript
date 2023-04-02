import * as fs from "fs";
import * as path from "path";
import * as protobuf from "protobufjs";
import * as descriptor from "protobufjs/ext/descriptor";
import { imp, Import } from "../../ts-poet";
import { FileUtil } from "../../utils/fileUtil";

import {
  BlockType,
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
import { ImportFiles } from "../imports/import";

export class FileInfo {
  files: FileInfoType[];
  allType: ImportedType[];
  async load(root, grpcPath, outPath, globalpath) {
    let ignoreList = await this.getProtoIgnoreList();
    this.files = await this.loadInfo(
      root,
      grpcPath,
      outPath,
      globalpath,
      ignoreList
    );
    this.allType = this.getAllType(this.files);
    debugger;
    this.files = this.getImportedTypes(this.files, this.allType);
  }
  private async loadInfo(
    root,
    grpcPath,
    outPath,
    globalpath,
    ignoreList: string[]
  ): Promise<FileInfoType[]> {
    let result: FileInfoType[] = [];
    let directorys = await fs.readdirSync(root, { withFileTypes: true });

    for (let dirent of directorys) {
      let fileInfoType = new FileInfoType();
      fileInfoType.isDirectory = dirent.isDirectory();
      fileInfoType.name = getFileName(dirent.name);

      let pathResolved = "";
      let fileName = getFileName(dirent.name);
      fileInfoType.path = {
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

      if (fileInfoType.isDirectory) {
        fileInfoType.nested = await this.loadInfo(
          root + "/" + dirent.name,
          grpcPath + "/" + dirent.name,
          outPath + "/" + dirent.name,
          globalpath,
          ignoreList
        );
      } else {
        if (!this.isValidFile(root + "/" + dirent.name, ignoreList)) continue;

        pathResolved = path.resolve(root + "/" + dirent.name);
        let protobufStr = await new FileUtil().read(pathResolved);
        if (protobufStr) {
          let parsed = protobuf.parse(protobufStr); // read protobuf
          if (parsed.imports?.length > 0) {
            // imports = generateImportCode(parsed.imports);
            fileInfoType.importFiles = new ImportFiles(
              parsed.imports,
              fileInfoType.path
            );
          }
        }

        let protoBuf = await this.loadProtobuf(pathResolved);
        if (protoBuf) {
          fileInfoType.codeBlock = generateTypes(protoBuf);
          fileInfoType.Service = new Service(protoBuf, fileInfoType.path);
        }
      }
      fileInfoType.importedType = [];

      fileInfoType.typeList = this.getFileTypes(fileInfoType.codeBlock);
      result.push(fileInfoType);
    }

    return result;
  }
  private async loadProtobuf(filePath: string) {
    return await protobuf.loadSync(filePath);
  }
  private getFileTypes(blocks: CodeBlock[]) {
    let types: ListOfFileTypes[] = [];
    if (blocks?.length > 0) {
      blocks.forEach((block) => {
        if (
          block.blockType == BlockType.TYPE ||
          block.blockType == BlockType.ENUM
        ) {
          types.push({
            name: block.name,
            isNamespace: false,
            nested: undefined,
            fields: block.fields,
            type: block.blockType,
          });
        } else if (block.blockType == BlockType.NAMESPACE) {
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
        file.importFiles?.imports?.forEach((imp) => {
          if (imp.isGrpcPath == true) return;
          if (imp.name == "google") {
            // file.importedType.push({
            //   import: imp,
            //   name: imp.symbol,
            //   fileName: "google-protobuf",
            //   fieldType: [],
            //   importStr: `import * as google from "google-protobuf"`,
            //   types: [],
            // });
            return;
          }
          let types = allTypes.find((x) => x.fileName == imp.name);
          if (types) {
            imp.types = types.types;
            imp.paths = types.filePath;
            imp.name = types.name;
          } else {
            debugger;
          }
          // let spl = imp.source.split("/");
          // let fileName = spl[spl.length - 1];
          // let importedTypes = allTypes.filter((x) => x.fileName == fileName);

          // if (importedTypes.length > 0) {
          //   importedTypes.forEach((item) => {
          //     item.name = imp.symbol;
          //     item.import = imp;
          //   });
          //   file.importedType.push(...importedTypes);
          // }
          //'../common/types_common_v1'
        });
      }
    });
    return files;
  }

  private async getProtoIgnoreList() {
    let pathResolved = path.resolve("./.protoIgnore");
    if (fs.existsSync(pathResolved)) {
      let data = await new FileUtil().read(pathResolved);
      if (data) {
        return data.split(/\r?\n/);
      }
    }
    return [];
  }
  private isValidFile(fileName: string, ignoreList: string[]) {
    if (!fileName.endsWith(".proto")) return false;
    if (ignoreList.includes(fileName)) {
      debugger;
      return false;
    }

    return true;
  }
}
