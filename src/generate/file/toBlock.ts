import * as fs from "fs";
import * as path from "path";
import protobuf from "protobufjs";
import { Import } from "ts-poet";
import { FileUtil } from "../../utils/fileUtil";

import { blockType, CodeBlock, FileInfoType, ListOfFileTypes } from "../model";

import { generateImportCode } from "../imports/generateImportCode";
import { generateTypes } from "../types/generateTypes";

export async function fileToBlock(
  root,
  grpcPath,
  outPath
): Promise<FileInfoType[]> {
  let result: FileInfoType[] = [];
  //read file
  let directorys = await fs.readdirSync(root, { withFileTypes: true });
  for (let dirent of directorys) {
    const isDirectory = dirent.isDirectory();
    let nestedDirectory: FileInfoType[] = [];

    let codeBlocks: CodeBlock[] = [];
    let imports: Import[] = [];
    let pathResolved = "";
    if (isDirectory) {
      nestedDirectory = await fileToBlock(
        root + "/" + dirent.name,
        grpcPath + "/" + dirent.name,
        outPath + "/" + dirent.name
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
      codeBlocks = await getCodeBlocks(pathResolved, imports);
    }
    result.push({
      path: {
        outPath: outPath,
        pbName: dirent.name,
        grpcPb: dirent.name.replace(".proto", "_pb.js"),
        grpcServicePb: dirent.name.replace(".proto", "ServiceClientPb.ts"),
        path: root,
        tsName: dirent.name.replace(".proto", ".ts"),
        grpcPath: grpcPath,
        pathResolved: pathResolved,
      },
      name: dirent.name.replace(".proto", ""),
      isDirectory: isDirectory,
      nested: nestedDirectory,
      imports: imports,
      codeBlock: codeBlocks,
      typeList: getAllTypes(codeBlocks),
      importedType: [],
    });
  }

  return result;
}
async function getCodeBlocks(filePath: string, imports: Import[]) {
  let loadedProto = await protobuf.loadSync(filePath);
  if (loadedProto) {
    debugger;
    return generateTypes(loadedProto, imports);
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
