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
exports.FileInfo = void 0;
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var protobuf = __importStar(require("protobufjs"));
var fileUtil_1 = require("../../utils/fileUtil");
var model_1 = require("../model");
var generateTypes_1 = require("../types/generateTypes");
var service_1 = require("../service/service");
var extension_1 = require("../../utils/extension");
var import_1 = require("../imports/import");
// import { rootToDNamespace } from "../../dService.";
var FileInfo = /** @class */ (function () {
    function FileInfo() {
    }
    FileInfo.prototype.load = function (root, grpcPath, outPath, globalpath, suffix) {
        return __awaiter(this, void 0, void 0, function () {
            var ignoreList, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        ignoreList = [];
                        _a = this;
                        return [4 /*yield*/, this.loadInfo(root, grpcPath, outPath, globalpath, ignoreList, suffix)];
                    case 1:
                        _a.files = _b.sent();
                        this.allType = this.getAllType(this.files);
                        this.files = this.getImportedTypes(this.files, this.allType);
                        return [2 /*return*/];
                }
            });
        });
    };
    FileInfo.prototype.loadInfo = function (root, grpcPath, outPath, globalpath, ignoreList, suffix) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var result, directorys, _i, directorys_1, dirent, fileInfoType, pathResolved, fileName, grpcServicePbName, _b, protobufStr, parsed, protoBuf;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        result = [];
                        return [4 /*yield*/, fs.readdirSync(root, { withFileTypes: true })];
                    case 1:
                        directorys = _c.sent();
                        _i = 0, directorys_1 = directorys;
                        _c.label = 2;
                    case 2:
                        if (!(_i < directorys_1.length)) return [3 /*break*/, 9];
                        dirent = directorys_1[_i];
                        fileInfoType = new model_1.FileInfoType();
                        fileInfoType.isDirectory = dirent.isDirectory();
                        fileInfoType.name = (0, extension_1.getFileName)(dirent.name);
                        pathResolved = "";
                        fileName = (0, extension_1.getFileName)(dirent.name);
                        grpcServicePbName = fileName + "ServiceClientPb.ts";
                        if (suffix) {
                            grpcServicePbName = fileName.toLowerCase() + suffix + ".ts";
                        }
                        fileInfoType.path = {
                            outPath: outPath,
                            pbName: dirent.name,
                            grpcPb: fileName + "_pb.js",
                            grpcServicePb: grpcServicePbName,
                            path: root,
                            tsName: fileName + ".ts",
                            grpcPath: grpcPath,
                            pathResolved: pathResolved,
                            globalpath: globalpath,
                            fileName: fileName,
                        };
                        if (!fileInfoType.isDirectory) return [3 /*break*/, 4];
                        _b = fileInfoType;
                        return [4 /*yield*/, this.loadInfo(root + "/" + dirent.name, grpcPath + "/" + dirent.name, outPath + "/" + dirent.name, globalpath, ignoreList, suffix)];
                    case 3:
                        _b.nested = _c.sent();
                        return [3 /*break*/, 7];
                    case 4:
                        if (!this.isValidFile(root + "/" + dirent.name, ignoreList))
                            return [3 /*break*/, 8];
                        pathResolved = path.resolve(root + "/" + dirent.name);
                        return [4 /*yield*/, new fileUtil_1.FileUtil().read(pathResolved)];
                    case 5:
                        protobufStr = _c.sent();
                        if (protobufStr) {
                            parsed = protobuf.parse(protobufStr);
                            if (((_a = parsed.imports) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                                // imports = generateImportCode(parsed.imports);
                                fileInfoType.importFiles = new import_1.ImportFiles(parsed.imports, fileInfoType.path);
                            }
                        }
                        return [4 /*yield*/, this.loadProtobuf(pathResolved)];
                    case 6:
                        protoBuf = _c.sent();
                        if (protoBuf) {
                            // let test = rootToDNamespace(protoBuf.root);
                            // console.log(inspect(test, { colors: true, depth: 10 }));
                            // debugger;
                            fileInfoType.codeBlock = (0, generateTypes_1.generateTypes)(protoBuf);
                            fileInfoType.Service = new service_1.Service(protoBuf, fileInfoType.path);
                        }
                        _c.label = 7;
                    case 7:
                        fileInfoType.importedType = [];
                        fileInfoType.typeList = this.getFileTypes(fileInfoType.codeBlock);
                        result.push(fileInfoType);
                        _c.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 2];
                    case 9: return [2 /*return*/, result];
                }
            });
        });
    };
    FileInfo.prototype.loadProtobuf = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protobuf.loadSync(filePath)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    FileInfo.prototype.getFileTypes = function (blocks) {
        var _this = this;
        var types = [];
        if ((blocks === null || blocks === void 0 ? void 0 : blocks.length) > 0) {
            blocks.forEach(function (block) {
                if (block.blockType == model_1.BlockType.TYPE ||
                    block.blockType == model_1.BlockType.ENUM) {
                    types.push({
                        name: block.name,
                        isNamespace: false,
                        nested: undefined,
                        fields: block.fields,
                        type: block.blockType,
                    });
                }
                else if (block.blockType == model_1.BlockType.NAMESPACE) {
                    var nestedTypes = _this.getFileTypes(block.blocks);
                    types.push({
                        name: block.name,
                        isNamespace: true,
                        nested: nestedTypes,
                    });
                }
            });
        }
        return types;
    };
    FileInfo.prototype.getAllType = function (files) {
        var _a;
        var typeList = [];
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var file = files_1[_i];
            if (file.isDirectory) {
                typeList.push.apply(typeList, this.getAllType(file.nested));
            }
            else {
                if (((_a = file.typeList) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                    typeList.push({
                        fileName: file.name,
                        name: "",
                        types: file.typeList,
                        fieldType: [],
                        importStr: "",
                        filePath: file.path,
                    });
                }
            }
        }
        return typeList;
    };
    FileInfo.prototype.getImportedTypes = function (files, allTypes) {
        var _this = this;
        files.forEach(function (file) {
            var _a, _b;
            if (file.isDirectory) {
                file.nested = _this.getImportedTypes(file.nested, allTypes);
            }
            else {
                file.importedType = [];
                (_b = (_a = file.importFiles) === null || _a === void 0 ? void 0 : _a.imports) === null || _b === void 0 ? void 0 : _b.forEach(function (imp) {
                    if (imp.isGrpcPath == true)
                        return;
                    if (imp.name.startsWith("google")) {
                        // file.importedType.push({
                        //   import: imp,
                        //   name: imp.symbol,
                        //   fileName: "google-protobuf",
                        //   fieldType: [],
                        //   importStr: `import * as google from "google-protobuf"`,
                        //   types: [],
                        // });
                        return;
                    }
                    var types = allTypes.find(function (x) { return x.fileName == imp.name; });
                    if (types) {
                        imp.types = types.types;
                        imp.paths = types.filePath;
                        imp.name = types.name;
                    }
                    else {
                        debugger;
                    }
                    // let spl = imp.source.split("/");
                    // let fileName = spl[spl.length - 1];
                    // let importedTypes = allTypes.filter((x) => x.fileName == fileName);
                    // if (importedTypes.length > 0) {
                    //   importedTypes.forEach((item) => {
                    //     item.name = imp.symbol;
                    //     item.import = imp;
                    //   });
                    //   file.importedType.push(...importedTypes);
                    // }
                    //'../common/types_common_v1'
                });
            }
        });
        return files;
    };
    FileInfo.prototype.getProtoIgnoreList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pathResolved, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pathResolved = path.resolve("./.protoIgnore");
                        if (!fs.existsSync(pathResolved)) return [3 /*break*/, 2];
                        return [4 /*yield*/, new fileUtil_1.FileUtil().read(pathResolved)];
                    case 1:
                        data = _a.sent();
                        if (data) {
                            return [2 /*return*/, data.split(/\r?\n/)];
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/, []];
                }
            });
        });
    };
    FileInfo.prototype.isValidFile = function (fileName, ignoreList) {
        if (!fileName.endsWith(".proto"))
            return false;
        if (ignoreList.includes(fileName)) {
            debugger;
            return false;
        }
        return true;
    };
    return FileInfo;
}());
exports.FileInfo = FileInfo;
//# sourceMappingURL=fileInfo.js.map