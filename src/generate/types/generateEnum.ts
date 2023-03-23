import * as protobuf from "protobufjs";
import { code, Code } from "ts-poet";
import { blockType, CodeBlock } from "../model";

export function generateEnum(element: protobuf.Enum) {
  // const codes: Code[] = [];

  let enumBlock: CodeBlock = {
    blockType: blockType.ENUM,
    name: element.name,
    fields: [],
  };

  // codes.push(code`export enum ${element.name} {`);
  for (const [key, value] of Object.entries(element.values)) {
    // codes.push(code`${key}= ${value},`);
    enumBlock.fields.push({
      name: key,
      value: value.toString(),
      typeValid: true,
    });
  }
  // codes.push(code`}`);

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
