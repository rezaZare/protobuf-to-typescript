interface TypeInfo {
  type: string;
  isSystemType: boolean;
  needImport?: boolean;
  isOptinal: boolean;
}

export function getFieldType(field: protobuf.Field): TypeInfo {
  if (!field) return undefined;
  let json = field.toJSON();
  let isOptinal = false;
  // if (json.options) {
  //   debugger;
  // }

  if (json.options) {
    isOptinal = json.options["proto3_optional"];
  }
  // if (field.type?.split(".").length > 1) {
  //   isOptinal = true;
  // }

  switch (field.type) {
    case "string":
      return {
        isSystemType: true,
        type: "string",
        isOptinal: isOptinal,
      };
    case "int":
    case "int32":
    case "int64":
    case "uint64":
    case "double":
      return {
        isSystemType: true,
        type: "number",
        isOptinal,
      };

    case "bool":
      return {
        isSystemType: true,
        type: "boolean",
        isOptinal,
      };
    default:
      return {
        isSystemType: false,
        type: field.type,
        needImport: field.type?.split(".").length > 1,
        isOptinal,
      };
  }
}
