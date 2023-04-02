import protobuf from "protobufjs";
export function getFieldType(field) {
    var _a;
    if (!field)
        return undefined;
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
                needImport: ((_a = field.type) === null || _a === void 0 ? void 0 : _a.split(".").length) > 1,
                isOptinal,
            };
    }
}
function getBasicType(type) {
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
//# sourceMappingURL=getFieldType.js.map