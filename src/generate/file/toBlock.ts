import * as fs from "fs";
import * as path from "path";
import protobuf from "protobufjs";
import { imp, Import } from "ts-poet";
import { FileUtil } from "../../utils/fileUtil";

import {
  blockType,
  CodeBlock,
  FileInfoType,
  ListOfFileTypes,
  PathInfo,
  ServiceType,
} from "../model";

import { generateImportCode } from "../imports/generateImportCode";
import { generateTypes } from "../types/generateTypes";
import { generateService } from "../service/service";
import { getFileName } from "../../utils/extension";

export async function fileToBlock(
  root,
  grpcPath,
  outPath,
  globalpath
): Promise<FileInfoType[]> {
  let result: FileInfoType[] = [];
  //read file
  let directorys = await fs.readdirSync(root, { withFileTypes: true });
  for (let dirent of directorys) {
    const isDirectory = dirent.isDirectory();
    let nestedDirectory: FileInfoType[] = [];

    let codeBlocks: CodeBlock[] = [];
    let service: ServiceType;
    let imports: Import[] = [];
    let pathResolved = "";
    let fileName = getFileName(dirent.name);

    const servicePath = fileName + "ServiceClientPb.ts";
    let filepath: PathInfo = {
      outPath: outPath,
      pbName: dirent.name,
      grpcPb: fileName + "_pb.js",
      grpcServicePb: servicePath,
      path: root,
      tsName: fileName + ".ts",
      grpcPath: grpcPath,
      pathResolved: pathResolved,
      globalpath: globalpath,
      fileName: fileName,
    };

    if (isDirectory) {
      nestedDirectory = await fileToBlock(
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

      let blocks = await getCodeBlocks(pathResolved, imports, filepath);
      if (blocks) {
        codeBlocks = blocks.types;
        service = blocks.services;
      }
    }

    result.push({
      path: filepath,
      name: dirent.name.replace(".proto", ""),
      isDirectory: isDirectory,
      nested: nestedDirectory,
      imports: imports,
      codeBlock: codeBlocks,
      ServiceType: service,
      typeList: getAllTypes(codeBlocks),
      importedType: [],
    });
  }

  return result;
}
async function getCodeBlocks(
  filePath: string,
  imports: Import[],
  filepath: PathInfo
) {
  let loadedProto = await protobuf.loadSync(filePath);
  if (loadedProto) {
    let types = generateTypes(loadedProto, imports);
    let services = generateService(loadedProto, filepath);

    return {
      types,
      services,
    };
  }
  return undefined;
}
function getAllTypes(blocks: CodeBlock[]) {
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
        });
      } else if (block.blockType == blockType.NAMESPACE) {
        let nestedTypes = getAllTypes(block.blocks);
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
