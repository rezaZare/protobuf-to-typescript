"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlockTypes = exports.getTypeListByTypes = void 0;
var model_1 = require("../model");
function getTypeListByTypes(blocks) {
    var types = [];
    var _loop_1 = function (block) {
        if (block.isNamespace) {
            var name_1 = block.name;
            types.push.apply(types, getTypeListByTypes(block.nested).map(function (x) { return name_1 + "." + x; }));
        }
        else {
            types.push(block.name);
        }
    };
    for (var _i = 0, blocks_1 = blocks; _i < blocks_1.length; _i++) {
        var block = blocks_1[_i];
        _loop_1(block);
    }
    return types;
}
exports.getTypeListByTypes = getTypeListByTypes;
function getBlockTypes(blocks) {
    var types = [];
    var _loop_2 = function (block) {
        if (block.blockType == model_1.blockType.NAMESPACE) {
            var name_2 = block.name;
            types.push.apply(types, getBlockTypes(block.blocks).map(function (x) { return name_2 + "." + x; }));
        }
        else if (block.blockType == model_1.blockType.TYPE ||
            block.blockType == model_1.blockType.ENUM) {
            types.push(block.name);
        }
    };
    for (var _i = 0, blocks_2 = blocks; _i < blocks_2.length; _i++) {
        var block = blocks_2[_i];
        _loop_2(block);
    }
    return types;
}
exports.getBlockTypes = getBlockTypes;
//# sourceMappingURL=typeUtil.js.map