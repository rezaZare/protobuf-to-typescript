import * as protobuf from "protobufjs";
import { code, Code, imp, Import, joinCode } from "ts-poet";
import { getFieldType } from "./getFieldType";
import { blockType, CodeBlock } from "../model";
import { generateEnum } from "./generateEnum";
import { camelize } from "../../utils/case";

//TODO:oneof , type map
export function toType(element: protobuf.Type) {
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
        let _type = toType(value);
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
      let fieldName = key;
      if (type.isMap) {
        fieldName = fieldName + "Map";
      }
      if (fieldName.includes("wanted")) {
        fieldName = fieldName.replace(/_/g, "");
      }

      typeBlock.fields.push({
        name: checkValidName(camelize(fieldName)),
        type: type.type,
        isRepeated: value.repeated,
        isSystemType: type.isSystemType,
        needImport: type.needImport,
        typeValid: type.isSystemType ? true : false,
        isoptional: type.isOptinal,
        isMap: type.isMap,
        keyType: type.keyType,
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
  if (name == "public") return "pb_public";
  if (name == "long") return "pb_long";
  return name;
}
