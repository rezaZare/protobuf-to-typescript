interface TypeInfo {
  type: string;
  isSystemType: boolean;
  needImport?: boolean;
}

export function getFieldType(type: string): TypeInfo {
  switch (type) {
    case "string":
      return {
        isSystemType: true,
        type: "string",
      };
    case "int":
    case "int32":
    case "int64":
    case "uint64":
    case "double":
      return {
        isSystemType: true,
        type: "number",
      };

    case "bool":
      return {
        isSystemType: true,
        type: "boolean",
      };
    default:
      return {
        isSystemType: false,
        type: type,
        needImport: type?.split(".").length > 1,
      };
  }
}
