import * as protobuf from "protobufjs";
import { code, Code, imp, Import, joinCode } from "ts-poet";
import { getFieldType } from "./getFieldType";
import { blockType, CodeBlock } from "../model";
import { generateEnum } from "./generateEnum";

//TODO:oneof , type map
export function toType(element: protobuf.Type, imports: Import[]) {
  const codeBlocks: CodeBlock[] = [];
  let namespaceBlock: CodeBlock;
  if (element.nested) {
    namespaceBlock = {
      blockType: blockType.NAMESPACE,
      name: element.name,
      blocks: [],
    };

    for (const [key, value] of Object.entries(element.nested)) {
      if (value instanceof protobuf.Type) {
        let _type = toType(value, imports);
        namespaceBlock.blocks.push(..._type);
      } else if (value instanceof protobuf.Enum) {
        let _enum = generateEnum(value);
        namespaceBlock.blocks.push(_enum);
      } else {
        debugger;
      }
    }
  }
  if (element.fields) {
    const typeBlock: CodeBlock = {
      blockType: blockType.TYPE,
      name: element.name,
      fields: [],
    };
    for (const [key, value] of Object.entries(element.fields)) {
      let type = getFieldType(value);

      typeBlock.fields.push({
        name: checkValidName(key),
        type: type.type,
        isRepeated: value.repeated,
        isSystemType: type.isSystemType,
        needImport: type.needImport,
        typeValid: type.isSystemType ? true : false,
        isoptional: type.isOptinal,
      });
    }
    if (namespaceBlock) {
      namespaceBlock.blocks.push(typeBlock);
      codeBlocks.push(namespaceBlock);
    } else {
      codeBlocks.push(typeBlock);
    }
  } else {
    debugger;
  }

  return codeBlocks;
}

function checkValidName(name: string) {
  if (name == "public") {
    return "pb_public";
  }
  return name;
}
