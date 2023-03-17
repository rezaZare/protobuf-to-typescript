"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEnumCode = exports.generateEnum = void 0;
var ts_poet_1 = require("ts-poet");
var model_1 = require("../model");
function generateEnum(element) {
    // const codes: Code[] = [];
    var enumBlock = {
        blockType: model_1.blockType.ENUM,
        name: element.name,
        fields: [],
    };
    // codes.push(code`export enum ${element.name} {`);
    for (var _i = 0, _a = Object.entries(element.values); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        // codes.push(code`${key}= ${value},`);
        enumBlock.fields.push({
            name: key,
            value: value.toString(),
            typeValid: true,
        });
    }
    // codes.push(code`}`);
    return {
        codes: [],
        enumBlock: enumBlock,
    };
}
exports.generateEnum = generateEnum;
function generateEnumCode(blocks) {
    var codes = [];
    codes.push(ts_poet_1.code(templateObject_1 || (templateObject_1 = __makeTemplateObject(["export enum ", " {"], ["export enum ", " {"])), blocks.name));
    for (var _i = 0, _a = blocks.fields; _i < _a.length; _i++) {
        var field = _a[_i];
        codes.push(ts_poet_1.code(templateObject_2 || (templateObject_2 = __makeTemplateObject(["", "= ", ","], ["", "= ", ","])), field.name, field.value));
    }
    codes.push(ts_poet_1.code(templateObject_3 || (templateObject_3 = __makeTemplateObject(["}"], ["}"]))));
    return codes;
}
exports.generateEnumCode = generateEnumCode;
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=generateEnum.js.map