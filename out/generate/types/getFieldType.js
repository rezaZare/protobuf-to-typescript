"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFieldType = void 0;
function getFieldType(field) {
    var _a;
    if (!field)
        return undefined;
    var json = field.toJSON();
    var isOptinal = false;
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
//# sourceMappingURL=getFieldType.js.map