import protobuf from "protobufjs";
import { Code, Import } from "ts-poet";
import { CodeBlock } from "../model";

import { generateEnum } from "./generateEnum";
import { toType } from "./toType";

export function generateTypes(element) {
  // const codes: Code[] = [];
  const typeBlock: CodeBlock[] = [];

  if (element instanceof protobuf.Root) {
    if (element.nested) {
      let _codes = generateTypes(element.nested);
      typeBlock.push(..._codes);
    }
  } else {
    if (typeof element == "object") {
      for (const [key, value] of Object.entries(element)) {
        if (value instanceof protobuf.Service) {
          // debugger;
        } else if (value instanceof protobuf.Type) {
          let _type = toType(value);
          typeBlock.push(..._type);
        } else if (value instanceof protobuf.Enum) {
          let _enum = generateEnum(value);
          typeBlock.push(_enum);
        } else if (value instanceof protobuf.Namespace) {
          if (value.nested) {
            let _codes = generateTypes(value.nested);
            typeBlock.push(..._codes);
          }
        } else if (value instanceof protobuf.MapField) {
          debugger;
        } else {
          debugger;
        }
      }
    }
  }

  return typeBlock;
}
