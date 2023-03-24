import protobuf from "protobufjs";

interface TypeInfo {
  type: string;
  keyType?: string; // use for map
  isSystemType: boolean;
  needImport?: boolean;
  isOptinal: boolean;
  isMap?: boolean;
}

export function getFieldType(
  field: protobuf.Field | protobuf.MapField
): TypeInfo {
  if (!field) return undefined;
  let json = field.toJSON();
  let isOptinal = false;
  // if (json.options) {
  //   debugger;
  // }
  if (field.type.toLowerCase().includes("google.protobuf.struct")) {
    //'google.protobuf.Struct'
    // /'Struct'
    return {
      isSystemType: true,
      type: "google.protobuf.Struct",
      isOptinal: true,
    };
  }
  if (field.type.toLowerCase().includes("timestamp")) {
    return {
      isSystemType: true,
      type: field.type,
      isOptinal: true,
    };
  }
  if (field instanceof protobuf.MapField) {
    return {
      isSystemType: false,
      type: field.type,
      keyType: getBasicType(field.keyType),
      isOptinal: isOptinal,
      isMap: true,
    };
  }

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
    case "bytes":
      return {
        isSystemType: true,
        type: " Uint8Array | string",
        isOptinal,
      };
    case "int":
    case "int32":
    case "int64":
    case "uint32":
    case "uint64":
    case "double":
    case "float":
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

function getBasicType(type: string) {
  switch (type) {
    case "string":
      return "string";
    case "int":
    case "int32":
    case "int64":
    case "uint32":
    case "uint64":
    case "double":
    case "float":
      return "number";

    case "bool":
      return "boolean";
    default:
      return type;
  }
}
