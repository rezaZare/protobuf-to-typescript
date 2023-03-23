"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeCheckAndFix = void 0;
var model_1 = require("../model");
var typeUtil_1 = require("./typeUtil");
function typeCheckAndFix(fileBlocks) {
    fileBlocks = internalType(fileBlocks);
    fileBlocks = externalType(fileBlocks);
    return fileBlocks;
}
exports.typeCheckAndFix = typeCheckAndFix;
function internalType(fileBlocks) {
    fileBlocks.forEach(function (fileBlock) {
        var _a, _b;
        if (((_a = fileBlock.codeBlock) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            fileBlock.codeBlock = fixType(fileBlock.codeBlock, [], (0, typeUtil_1.getBlockTypes)(fileBlock.codeBlock));
        }
        else if (((_b = fileBlock.nested) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            fileBlock.nested = internalType(fileBlock.nested);
        }
    });
    return fileBlocks;
}
function fixType(codeBlock, typeOfList, alltype) {
    if (codeBlock.length <= 0)
        return [];
    codeBlock.forEach(function (block) {
        if (block.blockType === model_1.blockType.NAMESPACE) {
            var listOfType = (0, typeUtil_1.getBlockTypes)(block.blocks);
            block.blocks = fixType(block.blocks, listOfType, alltype);
        }
        else if (block.blockType === model_1.blockType.TYPE) {
            block.fields.forEach(function (field) {
                if (!field.typeValid) {
                    if (typeOfList === null || typeOfList === void 0 ? void 0 : typeOfList.includes(field.type)) {
                        field.typeValid = true;
                        field.isoptional = checkOptionalField(field);
                    }
                    else if (typeOfList === null || typeOfList === void 0 ? void 0 : typeOfList.includes(field.type + "." + field.type)) {
                        field.type = field.type + "." + field.type;
                        field.typeValid = true;
                        field.isoptional = checkOptionalField(field);
                    }
                    else {
                        if (alltype.includes(field.type)) {
                            field.typeValid = true;
                            field.isoptional = checkOptionalField(field);
                        }
                        if (alltype.includes(field.type + "." + field.type)) {
                            field.type = field.type + "." + field.type;
                            field.typeValid = true;
                            field.isoptional = checkOptionalField(field);
                        }
                    }
                }
            });
        }
    });
    return codeBlock;
}
function externalType(fileBlocks) {
    fileBlocks.forEach(function (fileBlock) {
        var _a, _b;
        if (((_a = fileBlock.codeBlock) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            for (var _i = 0, _c = fileBlock.importedType; _i < _c.length; _i++) {
                var importedFile = _c[_i];
                var tyleList = getTypeListByTypes(importedFile.types);
                fileBlock.codeBlock = fixExternalType(fileBlock.codeBlock, tyleList);
            }
        }
        else if (((_b = fileBlock.nested) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            fileBlock.nested = externalType(fileBlock.nested);
        }
    });
    return fileBlocks;
}
function getTypeListByTypes(blocks) {
    var types = new Map();
    var _loop_1 = function (block) {
        if (block.isNamespace) {
            var name_1 = block.name;
            var mapBlockTypes = getTypeListByTypes(block.nested);
            mapBlockTypes.forEach(function (value, key) {
                types.set(name_1 + "." + key, value);
            });
        }
        else {
            types.set(block.name, block);
        }
    };
    for (var _i = 0, blocks_1 = blocks; _i < blocks_1.length; _i++) {
        var block = blocks_1[_i];
        _loop_1(block);
    }
    return types;
}
function fixExternalType(codeBlock, typeList) {
    if (codeBlock.length <= 0)
        return [];
    codeBlock.forEach(function (block) {
        if (block.blockType === model_1.blockType.NAMESPACE) {
            block.blocks = fixExternalType(block.blocks, typeList);
        }
        else if (block.blockType === model_1.blockType.TYPE) {
            block.fields.forEach(function (field) {
                if (!field.typeValid) {
                    var _type = field.type;
                    var prefix = "";
                    if (field.type.includes(".")) {
                        var typeSpl = field.type.split(".");
                        _type = typeSpl.splice(typeSpl.length - 1, 1)[0];
                        prefix = typeSpl.join(".");
                    }
                    if (typeList === null || typeList === void 0 ? void 0 : typeList.get(_type)) {
                        field.typeValid = true;
                        field.importedFiledType = typeList === null || typeList === void 0 ? void 0 : typeList.get(_type);
                        field.isoptional = checkOptionalField(field);
                    }
                    else if (typeList === null || typeList === void 0 ? void 0 : typeList.get(_type + "." + _type)) {
                        field.type = "".concat(prefix ? prefix + "." : "").concat(_type, ".").concat(_type);
                        field.typeValid = true;
                        field.importedFiledType = typeList === null || typeList === void 0 ? void 0 : typeList.get(_type + "." + _type);
                        field.isoptional = checkOptionalField(field);
                    }
                }
            });
        }
    });
    return codeBlock;
}
function checkOptionalField(field) {
    if (field.isoptional)
        return true;
    if (field.isRepeated)
        return field.isoptional;
    if (!field.isSystemType) {
        return true;
    }
    // if (field.type.includes(".")) {
    //   if (field.importedFiledType?.type == blockType.TYPE) {
    //     return true;
    //   }
    // }
    return field.isoptional;
}
//# sourceMappingURL=validationType.js.map