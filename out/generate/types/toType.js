"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toType = void 0;
var protobuf = __importStar(require("protobufjs"));
var getFieldType_1 = require("./getFieldType");
var model_1 = require("../model");
var generateEnum_1 = require("./generateEnum");
//TODO:oneof , type map
function toType(element, imports) {
    var _a;
    // const codes: Code[] = [];
    var codeBlocks = [];
    var namespaceBlock;
    if (element.nested) {
        // codes.push(code`export namespace ${element.name} {`);
        namespaceBlock = {
            blockType: model_1.blockType.NAMESPACE,
            name: element.name,
            blocks: [],
        };
        console.log(element.name);
        for (var _i = 0, _b = Object.entries(element.nested); _i < _b.length; _i++) {
            var _c = _b[_i], key = _c[0], value = _c[1];
            if (value instanceof protobuf.Type) {
                var _type = toType(value, imports);
                // codes.push(..._type.codes);
                (_a = namespaceBlock.blocks).push.apply(_a, _type.codeBlocks);
            }
            else if (value instanceof protobuf.Enum) {
                var _enum = generateEnum_1.generateEnum(value);
                // codes.push(..._enum.codes);
                namespaceBlock.blocks.push(_enum.enumBlock);
            }
            else {
                debugger;
            }
        }
        // let nested = generateType(element.nested)
        // codes.push();
    }
    else {
    }
    if (element.fields) {
        // codes.push(code`export type ${element.name} = {`);
        var typeBlock = {
            blockType: model_1.blockType.TYPE,
            name: element.name,
            fields: [],
        };
        var _loop_1 = function (key, value) {
            var type = getFieldType_1.getFieldType(value.type);
            typeBlock.fields.push({
                name: key,
                type: type.type,
                isRepeated: value.repeated,
                isSystemType: type.isSystemType,
                needImport: type.needImport,
                typeValid: type.isSystemType ? true : false,
            });
            if (type.isSystemType) {
                // codes.push(code`${key}: ${type.type} ${value.repeated ? "[]" : ""};`);
            }
            else {
                if (value.parent[value.type] && value.parent[value.type]["nested"]) {
                    // codes.push(
                    //   code`${key}: ${type.type}.${type.type} ${
                    //     value.repeated ? "[]" : ""
                    //   };`
                    // );
                }
                else {
                    if (type.needImport) {
                        // debugger;
                        var startType_1 = type.type.split(".");
                        var x = imports === null || imports === void 0 ? void 0 : imports.find(function (x) { return x.symbol == startType_1[0]; });
                        if (x) {
                            // codes.push(
                            //   code`${key}: ${x}.${startType[1]} ${
                            //     value.repeated ? "[]" : ""
                            //   };`
                            // );
                        }
                        // imp("Observable*./Api") --> import * as Observable from "./Ap
                    }
                    else {
                        // codes.push(
                        //   code`${key}: ${type.type} ${value.repeated ? "[]" : ""};`
                        // );
                    }
                }
            }
        };
        for (var _d = 0, _e = Object.entries(element.fields); _d < _e.length; _d++) {
            var _f = _e[_d], key = _f[0], value = _f[1];
            _loop_1(key, value);
        }
        if (namespaceBlock) {
            namespaceBlock.blocks.push(typeBlock);
            codeBlocks.push(namespaceBlock);
        }
        else {
            codeBlocks.push(typeBlock);
        }
        // codes.push(code`}`);
    }
    else {
        debugger;
    }
    if (element.nested) {
        // codes.push(code`}`);
        // codeBlocks.push(namespaceBlock);
    }
    return {
        codes: [],
        codeBlocks: codeBlocks,
    };
}
exports.toType = toType;
//# sourceMappingURL=toType.js.map