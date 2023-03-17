"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFieldType = void 0;
function getFieldType(type) {
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
                needImport: (type === null || type === void 0 ? void 0 : type.split(".").length) > 1,
            };
    }
}
exports.getFieldType = getFieldType;
//# sourceMappingURL=getFieldType.js.map