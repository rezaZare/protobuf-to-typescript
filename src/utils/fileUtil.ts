import { code, Code, imp, joinCode } from "../ts-poet";
import * as fs from "fs";
import * as writeUtil from "write";
import {
  BlockType,
  CodeBlock,
  FieldType,
  FileInfoType,
  GlobalFilesType,
  ImportedType,
  ListOfFileTypes,
} from "../generate/model";
import { generateEnumCode } from "../generate/types/generateEnum";
import { ImportType } from "../generate/imports/import";

export class FileUtil {
  public async read(path) {
    const data = await fs.readFileSync(path, "utf8");
    return data;
  }
  public async write(files: FileInfoType[]) {
    if (files?.length > 0) {
      for (let file of files) {
        if (file.isDirectory) {
          this.write(file.nested);
        } else {
          let _codes: Code[] = [];
          if (file.importFiles?.imports?.length > 0) {
            const imported = generateImport(file.importFiles?.imports);

            _codes.push(...imported);
          }
          _codes.push(...getCode(file.codeBlock, file));
          if (file?.Service) {
            let serviceTypeCode = file.Service.generate(file.importedType);
            if (serviceTypeCode) {
              _codes.push(serviceTypeCode);
            }
          }
          let codes = joinCode(_codes, { on: "\n" }).toString();
          // if (file.importedType?.length > 0) {
          //   for (let importedFile of file.importedType) {
          //     if (importedFile.importStr?.length > 0) {
          //       codes = importedFile.importStr + "\n" + codes;
          //     } else {
          //       let iii = `import * as ${importedFile.name} from '${importedFile.import.source}'`;
          //       codes = iii + "\n" + codes;
          //     }
          //   }
          // }

          if (codes) {
            await writeUtil.sync(
              file.path.outPath + "/" + file.path.tsName,
              codes,
              {
                newline: true,
                overwrite: true,
              }
            );
          }
        }
      }
    }
  }
  public async writeGlobalFiles(model: GlobalFilesType, path: string) {
    if (model.apiPathCode) {
      await writeUtil.sync(
        path + "/" + "apiPath.ts",
        model.apiPathCode.toString(),
        {
          newline: true,
          overwrite: true,
        }
      );
    }
    if (model.responseModel) {
      await writeUtil.sync(
        path + "/" + "responseModel.ts",
        model.responseModel.toString(),
        {
          newline: true,
          overwrite: true,
        }
      );
    }
    if (model.enabledDevMode) {
      await writeUtil.sync(
        path + "/" + "enableDevMode.ts",
        model.enabledDevMode.toString(),
        {
          newline: true,
          overwrite: true,
        }
      );
    }
    if (model.metadata) {
      await writeUtil.sync(
        path + "/" + "metadata.ts",
        model.metadata.toString(),
        {
          newline: true,
          overwrite: true,
        }
      );
    }
    if (model.toProto) {
      await writeUtil.sync(
        path + "/" + "toProto.ts",
        model.toProto.toString(),
        {
          newline: true,
          overwrite: true,
        }
      );
    }
    await writeUtil.sync(
      path + "/" + "index.ts",
      `
    export { srvPath } from "./apiPath";
    export { enabledDevMode } from "./enableDevMode";
    export { mergeMetaData } from "./metadata";
    export type { MetaData } from "./metadata";
    export { toProto } from "./toProto";
    export { default as ResponseModel } from "./responseModel";
    `,
      {
        newline: true,
        overwrite: true,
      }
    );
  }
}

function getCode(
  blocks?: CodeBlock[],
  fileInfo?: FileInfoType
): Code[] | undefined {
  let codes: Code[] = [];
  if (blocks.length > 0) {
    blocks.forEach((block) => {
      if (block.blockType == BlockType.NAMESPACE) {
        codes.push(code`export namespace ${block.name} {`);

        codes.push(...getCode(block.blocks, fileInfo));
        codes.push(code`}`);
      } else if (block.blockType == BlockType.TYPE) {
        codes.push(...gernerateTypeCode(block, fileInfo));
        if (block.blocks?.length > 0) {
          debugger;
          codes.push(...getCode(block.blocks, fileInfo));
        }
      } else if (block.blockType == BlockType.ENUM) {
        codes.push(...generateEnumCode(block));
      }
    });
  }
  return codes;
}
function gernerateTypeCode(block: CodeBlock, fileInfo?: FileInfoType) {
  let codes: Code[] = [];
  codes.push(code`export type ${block.name} = {`);
  for (let field of block.fields) {
    let _type = "";
    if (field.typeValid) {
      _type = field.type;
    } else {
      _type = field.type; //getType(field, fileInfo); TODO:
    }
    if (field.isMap) {
      codes.push(
        code`${field.name}${field.isoptional ? "?" : ""}: Array<[${
          field.keyType
        },${field.type}]>;`
      );
    } else {
      codes.push(
        code`${field.name}${field.isRepeated ? "List" : ""}${
          field.isoptional ? "?" : ""
        }: ${field.isRepeated ? "Array<" + _type + ">" : _type};`
      );
    }
  }
  codes.push(code`}`);
  return codes;
}

function getType(field: FieldType, fileInfo?: FileInfoType) {
  if (!field) return "";
  if (field.isSystemType) return field.type;
  if (fileInfo.importedType?.length > 0) {
    //TODO:
  } else {
    return findType(field.type, fileInfo.typeList);

    // if (field.type.includes(".")) {
    //   // این تایپ هایی هست که دات داره و توی خود فایل هست
    //   let splType = field.type.split(".");
    //   findType(field.type, fileInfo.typeList);

    //   return splType[splType.length - 1];
    // } else {
    //   //TODO: این تایپ توی خود فایل هست ولی باید ببینیم که نیم اسپیس هست یا نه
    // }
  }

  return field.type;
}

function findType(
  name: string,
  listOfTypes?: ListOfFileTypes[]
): string | undefined {
  if (name.includes(".")) {
    return name;
    // let splType = name.split(".");
    // let _type = splType.splice(0, 1);
    // let _findType = listOfTypes.find((x) => x.name == _type[0]);
    // if (_findType) {
    //   // let p = findType(splType.join("."), _findType.nested);
    // } else {
    // }
  } else {
    let findedType = listOfTypes.find((x) => x.name == name);
    if (findedType) {
      let _type = findedType.name;
      if (findedType.isNamespace) {
        let nestedType = findType(name, findedType.nested);
        return _type + `${nestedType ? "." + nestedType : ""}`;
      } else {
        return _type;
      }
    } else {
      return undefined;
    }
  }
  return undefined;
}

function generateImport(importedType?: ImportType[]) {
  let codes: Code[] = [];
  for (let _import of importedType) {
    codes.push(code`${_import.importStr}`);
  }

  return codes;
}
