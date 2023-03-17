import { blockType, CodeBlock, FileInfoType, ListOfFileTypes } from "../model";

export function typeCheckAndFix(fileBlocks: FileInfoType[]) {
  fileBlocks = internalType(fileBlocks);
  fileBlocks = externalType(fileBlocks);
  return fileBlocks;
}

function internalType(fileBlocks: FileInfoType[]) {
  fileBlocks.forEach((fileBlock) => {
    if (fileBlock.codeBlock?.length > 0) {
      fileBlock.codeBlock = fixType(
        fileBlock.codeBlock,
        [],
        getTypeList(fileBlock.codeBlock)
      );
    } else if (fileBlock.nested?.length > 0) {
      fileBlock.nested = internalType(fileBlock.nested);
    }
  });
  return fileBlocks;
}

function fixType(
  codeBlock: CodeBlock[],
  typeOfList?: string[],
  alltype?: string[]
) {
  if (codeBlock.length <= 0) return [];
  codeBlock.forEach((block) => {
    if (block.blockType === blockType.NAMESPACE) {
      let listOfType = getTypeList(block.blocks);

      block.blocks = fixType(block.blocks, listOfType, alltype);
    } else if (block.blockType === blockType.TYPE) {
      block.fields.forEach((field) => {
        if (!field.typeValid) {
          if (typeOfList?.includes(field.type)) {
            field.typeValid = true;
          } else if (typeOfList?.includes(field.type + "." + field.type)) {
            field.type = field.type + "." + field.type;
            field.typeValid = true;
          } else {
            if (alltype.includes(field.type)) {
              field.typeValid = true;
            }
            if (alltype.includes(field.type + "." + field.type)) {
              field.type = field.type + "." + field.type;
              field.typeValid = true;
            }
          }
        }
      });
    }
  });

  return codeBlock;
}

function getTypeList(blocks?: CodeBlock[]) {
  let types: string[] = [];
  for (let block of blocks) {
    if (block.blockType == blockType.NAMESPACE) {
      let name = block.name;
      types.push(...getTypeList(block.blocks).map((x) => name + "." + x));
    } else if (
      block.blockType == blockType.TYPE ||
      block.blockType == blockType.ENUM
    ) {
      types.push(block.name);
    }
  }
  return types;
}

function externalType(fileBlocks: FileInfoType[]) {
  fileBlocks.forEach((fileBlock) => {
    if (fileBlock.codeBlock?.length > 0) {
      for (let importedFile of fileBlock.importedType) {
        let tyleList = getTypeListByTypes(importedFile.types);
        fileBlock.codeBlock = fixExternalType(fileBlock.codeBlock, tyleList);
      }
    } else if (fileBlock.nested?.length > 0) {
      fileBlock.nested = externalType(fileBlock.nested);
    }
  });
  return fileBlocks;
}

function getTypeListByTypes(blocks: ListOfFileTypes[]) {
  let types: string[] = [];
  for (let block of blocks) {
    if (block.isNamespace) {
      let name = block.name;
      types.push(
        ...getTypeListByTypes(block.nested).map((x) => name + "." + x)
      );
    } else {
      types.push(block.name);
    }
  }
  return types;
}

function fixExternalType(codeBlock: CodeBlock[], typeList: string[]) {
  if (codeBlock.length <= 0) return [];
  codeBlock.forEach((block) => {
    if (block.blockType === blockType.NAMESPACE) {
      block.blocks = fixExternalType(block.blocks, typeList);
    } else if (block.blockType === blockType.TYPE) {
      block.fields.forEach((field) => {
        if (!field.typeValid) {
          let _type = field.type;
          let prefix = "";
          if (field.type.includes(".")) {
            let typeSpl = field.type.split(".");
            _type = typeSpl.splice(typeSpl.length - 1, 1)[0];
            prefix = typeSpl.join(".");
          }

          if (typeList?.includes(_type)) {
            field.typeValid = true;
          } else if (typeList?.includes(_type + "." + _type)) {
            field.type = `${prefix ? prefix + "." : ""}${_type}.${_type}`;
            field.typeValid = true;
          }
        }
      });
    }
  });
  return codeBlock;
}
