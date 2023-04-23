"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootBlock = exports.Block = exports.BlockKind = void 0;
var protobuf = __importStar(require("protobufjs"));
var case_1 = require("../utils/case");
var field_1 = require("./field");
var import_1 = require("./import");
var BlockKind;
(function (BlockKind) {
    BlockKind[BlockKind["NAMESPACE"] = 1] = "NAMESPACE";
    BlockKind[BlockKind["TYPE"] = 2] = "TYPE";
    BlockKind[BlockKind["ENUM"] = 3] = "ENUM";
    BlockKind[BlockKind["METHOD"] = 4] = "METHOD";
})(BlockKind = exports.BlockKind || (exports.BlockKind = {}));
var Block = /** @class */ (function () {
    function Block() {
    }
    Block.prototype.getCode = function () {
        if (this.blockKind == BlockKind.TYPE) {
            return this.getTypeCode();
        }
        else if (this.blockKind == BlockKind.ENUM) {
            return this.getEnumCode();
        }
    };
    Block.prototype.getTypeCode = function () {
        var codes = [];
        codes.push("export type ".concat(this.name, " = {"));
        for (var _i = 0, _a = this.fields; _i < _a.length; _i++) {
            var field = _a[_i];
            var _type = "";
            if (field.typeValid) {
                _type = field.type;
            }
            else {
                _type = field.type; //getType(field, fileInfo); TODO:
            }
            if (field.isMap) {
                codes.push("".concat(field.name).concat(field.isoptional ? "?" : "", ": Array<[").concat(field.keyType, ",").concat(field.type, "]>;"));
            }
            else {
                codes.push("".concat(field.name).concat(field.isRepeated ? "List" : "").concat(field.isoptional ? "?" : "", ": ").concat(field.isRepeated ? "Array<" + _type + ">" : _type, ";"));
            }
        }
        codes.push("}");
        return codes;
    };
    Block.prototype.getEnumCode = function () {
        var codes = [];
        codes.push("export enum ".concat(this.name, " {"));
        for (var _i = 0, _a = this.fields; _i < _a.length; _i++) {
            var field = _a[_i];
            codes.push("".concat(field.name, "= ").concat(field.value, ","));
        }
        codes.push("}");
        return codes;
    };
    return Block;
}());
exports.Block = Block;
var RootBlock = /** @class */ (function () {
    function RootBlock(element) {
        this.blocks = this.load(element);
    }
    RootBlock.prototype.load = function (element) {
        var blockType = [];
        if (element instanceof protobuf.Root) {
            if (element.nested) {
                var _codes = this.load(element.nested);
                blockType.push.apply(blockType, _codes);
            }
        }
        else {
            if (typeof element == "object") {
                for (var _i = 0, _a = Object.entries(element); _i < _a.length; _i++) {
                    var _b = _a[_i], key = _b[0], value = _b[1];
                    if (value instanceof protobuf.Service) {
                        // debugger;
                    }
                    else if (value instanceof protobuf.Type) {
                        var _type = this.toBlock(value);
                        blockType.push.apply(blockType, _type);
                    }
                    else if (value instanceof protobuf.Enum) {
                        var _enum = this.toEnum(value);
                        blockType.push(_enum);
                    }
                    else if (value instanceof protobuf.Namespace) {
                        if (value.nested) {
                            var _codes = this.load(value.nested);
                            blockType.push.apply(blockType, _codes);
                        }
                    }
                    else if (value instanceof protobuf.MapField) {
                        debugger;
                    }
                    else {
                        debugger;
                    }
                }
            }
        }
        return blockType;
    };
    RootBlock.prototype.toBlock = function (element) {
        var _a;
        var codeBlocks = [];
        var namespaceBlock;
        if (element.nested) {
            namespaceBlock.blockKind = BlockKind.NAMESPACE;
            namespaceBlock.name = element.name;
            namespaceBlock.blocks = [];
            for (var _i = 0, _b = Object.entries(element.nested); _i < _b.length; _i++) {
                var _c = _b[_i], key = _c[0], value = _c[1];
                if (value instanceof protobuf.Type) {
                    var _type = this.load(value);
                    (_a = namespaceBlock.blocks).push.apply(_a, _type);
                }
                else if (value instanceof protobuf.Enum) {
                    var _enum = this.toEnum(value);
                    namespaceBlock.blocks.push(_enum);
                }
                else {
                    debugger;
                }
            }
        }
        if (element.fields) {
            var typeBlock = new Block();
            typeBlock.blockKind = BlockKind.TYPE;
            typeBlock.name = element.name;
            typeBlock.fields = [];
            for (var _d = 0, _e = Object.entries(element.fields); _d < _e.length; _d++) {
                var _f = _e[_d], key = _f[0], value = _f[1];
                var type = (0, field_1.getFieldType)(value);
                var fieldName = key;
                if (type.isMap) {
                    fieldName = fieldName + "Map";
                }
                if (fieldName.includes("wanted")) {
                    fieldName = fieldName.replace(/_/g, "");
                }
                if (type.type.includes("google")) {
                    type.type = type.type.replace(".AsObject", "");
                }
                typeBlock.fields.push({
                    name: checkValidName((0, case_1.camelize)(fieldName)),
                    type: type.type,
                    isRepeated: value.repeated,
                    isSystemType: type.isSystemType,
                    isImportedType: false,
                    typeValid: type.isSystemType ? true : false,
                    isoptional: type.isOptinal,
                    isMap: type.isMap,
                    keyType: type.keyType,
                });
            }
            if (namespaceBlock) {
                if (!namespaceBlock.blocks)
                    namespaceBlock.blocks = [];
                namespaceBlock.blocks.push(typeBlock);
                codeBlocks.push(namespaceBlock);
            }
            else {
                codeBlocks.push(typeBlock);
            }
        }
        else {
            debugger;
        }
        return codeBlocks;
    };
    RootBlock.prototype.toEnum = function (element) {
        var enumBlock = new Block();
        enumBlock.blockKind = BlockKind.ENUM;
        enumBlock.name = element.name;
        enumBlock.fields = [];
        for (var _i = 0, _a = Object.entries(element.values); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            enumBlock.fields.push({
                name: key.toUpperCase(),
                value: value.toString(),
                typeValid: true,
                isSystemType: true,
                isImportedType: false,
            });
        }
        return enumBlock;
    };
    RootBlock.prototype.getType = function (typeName) {
        if (typeName) {
            var typeList = this.getInternalTypes();
            var type = typeList.find(function (x) { return x.includes(typeName); });
            if (type)
                return type;
        }
        return undefined;
    };
    RootBlock.prototype.typeCheck = function (imports) {
        var internalTypes = this.getInternalTypes();
        this.blocks = this.typeCheckInternal(this.blocks, internalTypes);
        if ((imports === null || imports === void 0 ? void 0 : imports.filter(function (x) { return x.type == import_1.ImportType.TS; }).length) > 0) {
            var externalTypes = this.getImportedTypes(imports);
            this.blocks = this.typeCheckImported(this.blocks, externalTypes);
        }
    };
    RootBlock.prototype.typeCheckInternal = function (blocks, types) {
        var _a;
        for (var _i = 0, blocks_1 = blocks; _i < blocks_1.length; _i++) {
            var block = blocks_1[_i];
            if (((_a = block.blocks) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                block.blocks = this.typeCheckInternal(block.blocks, types);
            }
            else {
                for (var _b = 0, _c = block.fields; _b < _c.length; _b++) {
                    var field = _c[_b];
                    if (!field.typeValid) {
                        if (types.includes(field.type)) {
                            field.typeValid = true;
                        }
                    }
                }
            }
        }
        return blocks;
    };
    RootBlock.prototype.typeCheckImported = function (blocks, externalTypes) {
        var _a;
        for (var _i = 0, blocks_2 = blocks; _i < blocks_2.length; _i++) {
            var block = blocks_2[_i];
            if (((_a = block.blocks) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                block.blocks = this.typeCheckImported(block.blocks, externalTypes);
            }
            else {
                var _loop_1 = function (field) {
                    if (!field.typeValid) {
                        externalTypes.forEach(function (value, key) {
                            if (value.includes(field.type)) {
                                field.type = key + "." + field.type;
                                field.typeValid = true;
                                field.isoptional = true;
                            }
                        });
                    }
                };
                for (var _b = 0, _c = block.fields; _b < _c.length; _b++) {
                    var field = _c[_b];
                    _loop_1(field);
                }
            }
        }
        return blocks;
    };
    RootBlock.prototype.getInternalTypes = function (blocks) {
        var _a;
        var types = [];
        if (!blocks)
            blocks = this.blocks;
        var _loop_2 = function (block) {
            if (((_a = block.blocks) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                var nestedTypes = this_1.getInternalTypes(block.blocks);
                nestedTypes.map(function (value) {
                    return block.name + "." + value;
                });
            }
            else {
                types.push(block.name);
            }
        };
        var this_1 = this;
        for (var _i = 0, blocks_3 = blocks; _i < blocks_3.length; _i++) {
            var block = blocks_3[_i];
            _loop_2(block);
        }
        return types;
    };
    RootBlock.prototype.getImportedTypes = function (imports) {
        var typeMaps = new Map();
        if (imports.length > 0) {
            for (var _i = 0, imports_1 = imports; _i < imports_1.length; _i++) {
                var imp = imports_1[_i];
                if (imp.type == import_1.ImportType.TS) {
                    var types = this.getInternalTypes(imp.file.codeBlocks.blocks);
                    typeMaps.set(imp.name, types);
                }
            }
        }
        return typeMaps;
    };
    // this section generate code
    RootBlock.prototype.getCode = function (blocks) {
        var _this = this;
        var codes = [];
        if (!blocks) {
            blocks = this.blocks;
        }
        if (blocks.length > 0) {
            blocks.forEach(function (block) {
                var _a;
                if (block.blockKind == BlockKind.NAMESPACE) {
                    codes.push("export namespace ".concat(block.name, " {"));
                    codes.push.apply(codes, _this.getCode(block.blocks));
                    codes.push("}");
                }
                else if (block.blockKind == BlockKind.TYPE ||
                    block.blockKind == BlockKind.ENUM) {
                    codes.push.apply(codes, block.getCode());
                    if (((_a = block.blocks) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                        codes.push.apply(codes, _this.getCode(block.blocks));
                    }
                }
            });
        }
        return codes;
    };
    return RootBlock;
}());
exports.RootBlock = RootBlock;
function checkValidName(name) {
    if (name == "public")
        return "pb_public";
    if (name == "long")
        return "pb_long";
    return name;
}
//# sourceMappingURL=block.js.map