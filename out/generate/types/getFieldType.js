"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFieldType = void 0;
var protobufjs_1 = __importDefault(require("protobufjs"));
function getFieldType(field) {
    var _a;
    if (!field)
        return undefined;
    var json = field.toJSON();
    var isOptinal = false;
    // if (json.options) {
    //   debugger;
    // }
    if (field.type.toLowerCase().includes("google.protobuf.struct")) {
        //'google.protobuf.Struct'
        // /'Struct'
        return {
            isSystemType: true,
            type: "google_protobuf_struct.Struct.AsObject",
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
    if (field instanceof protobufjs_1.default.MapField) {
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
                isOptinal: isOptinal,
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
                isOptinal: isOptinal,
            };
        case "bool":
            return {
                isSystemType: true,
                type: "boolean",
                isOptinal: isOptinal,
            };
        default:
            return {
                isSystemType: false,
                type: field.type,
                needImport: ((_a = field.type) === null || _a === void 0 ? void 0 : _a.split(".").length) > 1,
                isOptinal: isOptinal,
            };
    }
}
exports.getFieldType = getFieldType;
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