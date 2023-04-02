import * as protobuf from "protobufjs";
import { code, Code } from "../../ts-poet";
import { BlockType, CodeBlock } from "../model";

export function generateEnum(element: protobuf.Enum) {
  let enumBlock: CodeBlock = {
    blockType: BlockType.ENUM,
    name: element.name,
    fields: [],
  };

  for (const [key, value] of Object.entries(element.values)) {
    enumBlock.fields.push({
      name: key.toUpperCase(),
      value: value.toString(),
      typeValid: true,
    });
  }

  return enumBlock;
}

export function generateEnumCode(blocks: CodeBlock) {
  const codes: Code[] = [];
  codes.push(code`export enum ${blocks.name} {`);
  for (let field of blocks.fields) {
    codes.push(code`${field.name}= ${field.value},`);
  }
  codes.push(code`}`);
  return codes;
}
