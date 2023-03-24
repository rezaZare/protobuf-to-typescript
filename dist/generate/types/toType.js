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
exports.toType = void 0;
var protobuf = __importStar(require("protobufjs"));
var getFieldType_1 = require("./getFieldType");
var model_1 = require("../model");
var generateEnum_1 = require("./generateEnum");
var case_1 = require("../../utils/case");
//TODO:oneof , type map
function toType(element) {
    var _a;
    var codeBlocks = [];
    var namespaceBlock;
    if (element.nested) {
        namespaceBlock = {
            blockType: model_1.blockType.NAMESPACE,
            name: element.name,
            blocks: [],
        };
        for (var _i = 0, _b = Object.entries(element.nested); _i < _b.length; _i++) {
            var _c = _b[_i], key = _c[0], value = _c[1];
            if (value instanceof protobuf.Type) {
                var _type = toType(value);
                (_a = namespaceBlock.blocks).push.apply(_a, _type);
            }
            else if (value instanceof protobuf.Enum) {
                var _enum = (0, generateEnum_1.generateEnum)(value);
                namespaceBlock.blocks.push(_enum);
            }
            else {
                debugger;
            }
        }
    }
    if (element.fields) {
        var typeBlock = {
            blockType: model_1.blockType.TYPE,
            name: element.name,
            fields: [],
        };
        for (var _d = 0, _e = Object.entries(element.fields); _d < _e.length; _d++) {
            var _f = _e[_d], key = _f[0], value = _f[1];
            var type = (0, getFieldType_1.getFieldType)(value);
            var fieldName = key;
            if (type.isMap) {
                fieldName = fieldName + "Map";
            }
            if (fieldName.includes("wanted")) {
                fieldName = fieldName.replace(/_/g, "");
            }
            typeBlock.fields.push({
                name: checkValidName((0, case_1.camelize)(fieldName)),
                type: type.type,
                isRepeated: value.repeated,
                isSystemType: type.isSystemType,
                needImport: type.needImport,
                typeValid: type.isSystemType ? true : false,
                isoptional: type.isOptinal,
                isMap: type.isMap,
                keyType: type.keyType,
            });
        }
        if (namespaceBlock) {
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
}
exports.toType = toType;
function checkValidName(name) {
    if (name == "public")
        return "pb_public";
    if (name == "long")
        return "pb_long";
    return name;
}
//# sourceMappingURL=toType.js.map