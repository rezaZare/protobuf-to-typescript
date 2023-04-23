"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEnumCode = exports.generateEnum = void 0;
var model_1 = require("../model");
function generateEnum(element) {
    var enumBlock = {
        blockType: model_1.BlockType.ENUM,
        name: element.name,
        fields: [],
    };
    for (var _i = 0, _a = Object.entries(element.values); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        enumBlock.fields.push({
            name: key.toUpperCase(),
            value: value.toString(),
            typeValid: true,
        });
    }
    return enumBlock;
}
exports.generateEnum = generateEnum;
function generateEnumCode(blocks) {
    var codes = [];
    codes.push("export enum ".concat(blocks.name, " {"));
    for (var _i = 0, _a = blocks.fields; _i < _a.length; _i++) {
        var field = _a[_i];
        codes.push("".concat(field.name, "= ").concat(field.value, ","));
    }
    codes.push("}");
    return codes;
}
exports.generateEnumCode = generateEnumCode;
//# sourceMappingURL=generateEnum.js.map