import * as protobuf from "protobufjs";
import { code, Code, imp, Import, joinCode } from "ts-poet";
import { getFieldType } from "./getFieldType";
import { blockType, CodeBlock, FieldType } from "../model";
import { generateEnum } from "./generateEnum";

//TODO:oneof , type map
export function toType(element: protobuf.Type, imports: Import[]) {
  // const codes: Code[] = [];
  const codeBlocks: CodeBlock[] = [];
  let namespaceBlock: CodeBlock;
  if (element.nested) {
    // codes.push(code`export namespace ${element.name} {`);
    namespaceBlock = {
      blockType: blockType.NAMESPACE,
      name: element.name,
      blocks: [],
    };
    console.log(element.name);

    for (const [key, value] of Object.entries(element.nested)) {
      if (value instanceof protobuf.Type) {
        let _type = toType(value, imports);
        // codes.push(..._type.codes);
        namespaceBlock.blocks.push(..._type.codeBlocks);
      } else if (value instanceof protobuf.Enum) {
        let _enum = generateEnum(value);
        // codes.push(..._enum.codes);
        namespaceBlock.blocks.push(_enum.enumBlock);
      } else {
        debugger;
      }
    }

    // let nested = generateType(element.nested)
    // codes.push();
  } else {
  }
  if (element.fields) {
    // codes.push(code`export type ${element.name} = {`);
    const typeBlock: CodeBlock = {
      blockType: blockType.TYPE,
      name: element.name,
      fields: [],
    };
    for (const [key, value] of Object.entries(element.fields)) {
      let type = getFieldType(value.type);
      typeBlock.fields.push({
        name: key,
        type: type.type,
        isRepeated: value.repeated,
        isSystemType: type.isSystemType,
        needImport: type.needImport,
        typeValid: type.isSystemType ? true : false,
      });
      if (type.isSystemType) {
        // codes.push(code`${key}: ${type.type} ${value.repeated ? "[]" : ""};`);
      } else {
        if (value.parent[value.type] && value.parent[value.type]["nested"]) {
          // codes.push(
          //   code`${key}: ${type.type}.${type.type} ${
          //     value.repeated ? "[]" : ""
          //   };`
          // );
        } else {
          if (type.needImport) {
            // debugger;
            let startType = type.type.split(".");
            let x = imports?.find((x) => x.symbol == startType[0]);
            if (x) {
              // codes.push(
              //   code`${key}: ${x}.${startType[1]} ${
              //     value.repeated ? "[]" : ""
              //   };`
              // );
            }
            // imp("Observable*./Api") --> import * as Observable from "./Ap
          } else {
            // codes.push(
            //   code`${key}: ${type.type} ${value.repeated ? "[]" : ""};`
            // );
          }
        }
      }
    }
    if (namespaceBlock) {
      namespaceBlock.blocks.push(typeBlock);
      codeBlocks.push(namespaceBlock);
    } else {
      codeBlocks.push(typeBlock);
    }

    // codes.push(code`}`);
  } else {
    debugger;
  }
  if (element.nested) {
    // codes.push(code`}`);
    // codeBlocks.push(namespaceBlock);
  }

  return {
    codes: [], //codes,
    codeBlocks: codeBlocks,
  };
}
