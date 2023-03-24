"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeBlock = exports.ListOfFileTypes = exports.blockType = void 0;
var blockType;
(function (blockType) {
    blockType[blockType["NAMESPACE"] = 1] = "NAMESPACE";
    blockType[blockType["TYPE"] = 2] = "TYPE";
    blockType[blockType["ENUM"] = 3] = "ENUM";
    blockType[blockType["METHOD"] = 4] = "METHOD";
})(blockType = exports.blockType || (exports.blockType = {}));
var ListOfFileTypes = /** @class */ (function () {
    function ListOfFileTypes() {
    }
    return ListOfFileTypes;
}());
exports.ListOfFileTypes = ListOfFileTypes;
var CodeBlock = /** @class */ (function () {
    function CodeBlock() {
    }
    return CodeBlock;
}());
exports.CodeBlock = CodeBlock;
//# sourceMappingURL=model.js.map