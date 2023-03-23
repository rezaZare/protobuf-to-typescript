"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTypes = void 0;
var protobufjs_1 = __importDefault(require("protobufjs"));
var generateEnum_1 = require("./generateEnum");
var toType_1 = require("./toType");
function generateTypes(element, imports) {
    // const codes: Code[] = [];
    var codeBlocks = [];
    if (element instanceof protobufjs_1.default.Root) {
        if (element.nested) {
            var _codes = generateTypes(element.nested, imports);
            codeBlocks.push.apply(codeBlocks, _codes);
        }
    }
    else {
        if (typeof element == "object") {
            for (var _i = 0, _a = Object.entries(element); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                if (value instanceof protobufjs_1.default.Service) {
                    // debugger;
                }
                else if (value instanceof protobufjs_1.default.Type) {
                    var _type = (0, toType_1.toType)(value, imports);
                    codeBlocks.push.apply(codeBlocks, _type);
                }
                else if (value instanceof protobufjs_1.default.Enum) {
                    var _enum = (0, generateEnum_1.generateEnum)(value);
                    codeBlocks.push(_enum);
                }
                else if (value instanceof protobufjs_1.default.Namespace) {
                    if (value.nested) {
                        var _codes = generateTypes(value["nested"], imports);
                        codeBlocks.push.apply(codeBlocks, _codes);
                    }
                }
                else if (value instanceof protobufjs_1.default.MapField) {
                    debugger;
                }
                else {
                    debugger;
                }
            }
        }
    }
    return codeBlocks;
}
exports.generateTypes = generateTypes;
//# sourceMappingURL=generateTypes.js.map