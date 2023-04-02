import { BlockType, CodeBlock, ListOfFileTypes } from "../model";

export function getTypeListByTypes(blocks: ListOfFileTypes[]) {
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

export function getBlockTypes(blocks?: CodeBlock[]) {
  let types: string[] = [];
  for (let block of blocks) {
    if (block.blockType == BlockType.NAMESPACE) {
      let name = block.name;
      types.push(...getBlockTypes(block.blocks).map((x) => name + "." + x));
    } else if (
      block.blockType == BlockType.TYPE ||
      block.blockType == BlockType.ENUM
    ) {
      types.push(block.name);
    }
  }
  return types;
}
