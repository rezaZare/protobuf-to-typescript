"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUtil = void 0;
var ts_poet_1 = require("ts-poet");
var fs = __importStar(require("fs"));
var writeUtil = __importStar(require("write"));
var model_1 = require("../generate/model");
var generateEnum_1 = require("../generate/types/generateEnum");
var FileUtil = /** @class */ (function () {
    function FileUtil() {
    }
    FileUtil.prototype.read = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs.readFileSync(path, "utf8")];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    FileUtil.prototype.write = function (files) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var _i, files_1, file, _codes, imported, serviceTypeCode, codes, _d, _e, importedFile, iii;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!((files === null || files === void 0 ? void 0 : files.length) > 0)) return [3 /*break*/, 5];
                        _i = 0, files_1 = files;
                        _f.label = 1;
                    case 1:
                        if (!(_i < files_1.length)) return [3 /*break*/, 5];
                        file = files_1[_i];
                        if (!file.isDirectory) return [3 /*break*/, 2];
                        this.write(file.nested);
                        return [3 /*break*/, 4];
                    case 2:
                        _codes = [];
                        if (((_a = file.importedType) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                            imported = generateImport(file.importedType);
                            _codes.push.apply(_codes, imported);
                        }
                        _codes = getCode(file.codeBlock, file);
                        if (file === null || file === void 0 ? void 0 : file.Service) {
                            serviceTypeCode = file.Service.generate(file.importedType);
                            if (serviceTypeCode) {
                                _codes.push(serviceTypeCode);
                            }
                        }
                        codes = (0, ts_poet_1.joinCode)(_codes, { on: "\n" }).toString();
                        if (((_b = file.importedType) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                            for (_d = 0, _e = file.importedType; _d < _e.length; _d++) {
                                importedFile = _e[_d];
                                if (((_c = importedFile.importStr) === null || _c === void 0 ? void 0 : _c.length) > 0) {
                                    codes = importedFile.importStr + "\n" + codes;
                                }
                                else {
                                    iii = "import * as ".concat(importedFile.name, " from '").concat(importedFile.import.source, "'");
                                    codes = iii + "\n" + codes;
                                }
                            }
                        }
                        if (!codes) return [3 /*break*/, 4];
                        return [4 /*yield*/, writeUtil.sync(file.path.outPath + "/" + file.path.tsName, codes, {
                                newline: true,
                                overwrite: true,
                            })];
                    case 3:
                        _f.sent();
                        _f.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    FileUtil.prototype.writeGlobalFiles = function (model, path) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!model.apiPathCode) return [3 /*break*/, 2];
                        return [4 /*yield*/, writeUtil.sync(path + "/" + "apiPath.ts", model.apiPathCode.toString(), {
                                newline: true,
                                overwrite: true,
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!model.responseModel) return [3 /*break*/, 4];
                        return [4 /*yield*/, writeUtil.sync(path + "/" + "responseModel.ts", model.responseModel.toString(), {
                                newline: true,
                                overwrite: true,
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!model.enabledDevMode) return [3 /*break*/, 6];
                        return [4 /*yield*/, writeUtil.sync(path + "/" + "enableDevMode.ts", model.enabledDevMode.toString(), {
                                newline: true,
                                overwrite: true,
                            })];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        if (!model.metadata) return [3 /*break*/, 8];
                        return [4 /*yield*/, writeUtil.sync(path + "/" + "metadata.ts", model.metadata.toString(), {
                                newline: true,
                                overwrite: true,
                            })];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        if (!model.toProto) return [3 /*break*/, 10];
                        return [4 /*yield*/, writeUtil.sync(path + "/" + "toProto.ts", model.toProto.toString(), {
                                newline: true,
                                overwrite: true,
                            })];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10: return [4 /*yield*/, writeUtil.sync(path + "/" + "index.ts", "\n    export { srvPath } from \"./apiPath\";\n    export { enabledDevMode } from \"./enableDevMode\";\n    export { mergeMetaData } from \"./metadata\";\n    export type { MetaData } from \"./metadata\";\n    export { toProto } from \"./toProto\";\n    export { default as ResponseModel } from \"./responseModel\";\n    ", {
                            newline: true,
                            overwrite: true,
                        })];
                    case 11:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return FileUtil;
}());
exports.FileUtil = FileUtil;
function getCode(blocks, fileInfo) {
    var codes = [];
    if (blocks.length > 0) {
        blocks.forEach(function (block) {
            var _a;
            if (block.blockType == model_1.blockType.NAMESPACE) {
                codes.push((0, ts_poet_1.code)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["export namespace ", " {"], ["export namespace ", " {"])), block.name));
                codes.push.apply(codes, getCode(block.blocks, fileInfo));
                codes.push((0, ts_poet_1.code)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["}"], ["}"]))));
            }
            else if (block.blockType == model_1.blockType.TYPE) {
                codes.push.apply(codes, gernerateTypeCode(block, fileInfo));
                if (((_a = block.blocks) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                    debugger;
                    codes.push.apply(codes, getCode(block.blocks, fileInfo));
                }
            }
            else if (block.blockType == model_1.blockType.ENUM) {
                codes.push.apply(codes, (0, generateEnum_1.generateEnumCode)(block));
            }
        });
    }
    return codes;
}
function gernerateTypeCode(block, fileInfo) {
    var codes = [];
    codes.push((0, ts_poet_1.code)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["export type ", " = {"], ["export type ", " = {"])), block.name));
    for (var _i = 0, _a = block.fields; _i < _a.length; _i++) {
        var field = _a[_i];
        var _type = "";
        if (field.typeValid) {
            _type = field.type;
        }
        else {
            _type = field.type; //getType(field, fileInfo); TODO:
        }
        if (field.isMap) {
            codes.push((0, ts_poet_1.code)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["", "", ": Array<[", ",", "]>;"], ["", "", ": Array<[", ",", "]>;"])), field.name, field.isoptional ? "?" : "", field.keyType, field.type));
        }
        else {
            codes.push((0, ts_poet_1.code)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["", "", "", ": ", ";"], ["", "", "", ": ", ";"])), field.name, field.isRepeated ? "List" : "", field.isoptional ? "?" : "", field.isRepeated ? "Array<" + _type + ">" : _type));
        }
    }
    codes.push((0, ts_poet_1.code)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["}"], ["}"]))));
    return codes;
}
function getType(field, fileInfo) {
    var _a;
    if (!field)
        return "";
    if (field.isSystemType)
        return field.type;
    if (((_a = fileInfo.importedType) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        //TODO:
    }
    else {
        return findType(field.type, fileInfo.typeList);
        // if (field.type.includes(".")) {
        //   // این تایپ هایی هست که دات داره و توی خود فایل هست
        //   let splType = field.type.split(".");
        //   findType(field.type, fileInfo.typeList);
        //   return splType[splType.length - 1];
        // } else {
        //   //TODO: این تایپ توی خود فایل هست ولی باید ببینیم که نیم اسپیس هست یا نه
        // }
    }
    return field.type;
}
function findType(name, listOfTypes) {
    if (name.includes(".")) {
        return name;
        // let splType = name.split(".");
        // let _type = splType.splice(0, 1);
        // let _findType = listOfTypes.find((x) => x.name == _type[0]);
        // if (_findType) {
        //   // let p = findType(splType.join("."), _findType.nested);
        // } else {
        // }
    }
    else {
        var findedType = listOfTypes.find(function (x) { return x.name == name; });
        if (findedType) {
            var _type = findedType.name;
            if (findedType.isNamespace) {
                var nestedType = findType(name, findedType.nested);
                return _type + "".concat(nestedType ? "." + nestedType : "");
            }
            else {
                return _type;
            }
        }
        else {
            return undefined;
        }
    }
    return undefined;
}
function generateImport(importedType) {
    var codes = [];
    for (var _i = 0, importedType_1 = importedType; _i < importedType_1.length; _i++) {
        var _import = importedType_1[_i];
        codes.push((0, ts_poet_1.code)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["", ""], ["", ""])), _import.import));
    }
    return codes;
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=fileUtil.js.map