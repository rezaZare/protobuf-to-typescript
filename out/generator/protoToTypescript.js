"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.ProtoToTs = void 0;
var block_1 = require("./block");
var file_1 = require("./file");
var fileInfo_1 = require("./fileInfo");
var protobuf = __importStar(require("protobufjs"));
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
var fileUtil_1 = require("../utils/fileUtil");
var import_1 = require("./import");
var service_1 = require("./service");
var util_1 = require("./util");
var GenerateGlobalFiles_1 = require("./global/GenerateGlobalFiles");
var typeCheck_1 = require("./typeCheck");
function ProtoToTs(model) {
    return __awaiter(this, void 0, void 0, function () {
        var files, blockMaps, fileIo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, load(model)];
                case 1:
                    files = _a.sent();
                    blockMaps = getFileMap(files);
                    files = updateImports(files, blockMaps);
                    files = new typeCheck_1.TypeCheck(files).checkBlockType();
                    if (!(files.length > 0)) return [3 /*break*/, 4];
                    fileIo = new file_1.FileIo();
                    return [4 /*yield*/, fileIo.writeGlobalFiles((0, GenerateGlobalFiles_1.GenerateGlobalFiles)(model), model.globalFilePath)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, fileIo.write(files, model)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.ProtoToTs = ProtoToTs;
function load(model) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function () {
        var ignoreList, fileInfoList, directorys, _loop_1, _i, directorys_1, dirent;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    ignoreList = [];
                    fileInfoList = [];
                    return [4 /*yield*/, fs.readdirSync(model.protobufPath, {
                            withFileTypes: true,
                        })];
                case 1:
                    directorys = _f.sent();
                    _loop_1 = function (dirent) {
                        var fileInfo, isDirectory, _g, pathResolved, protobufString, parsed, imp, _h, _j, impStr, imp_1, importedTsPath, getRelpath, pathParsed, importedTs, protoBuf;
                        var _k;
                        return __generator(this, function (_l) {
                            switch (_l.label) {
                                case 0:
                                    fileInfo = new fileInfo_1.FileInfo();
                                    isDirectory = dirent.isDirectory();
                                    fileInfo.pathInfo = {
                                        protobufPath: model.protobufPath + "/" + dirent.name,
                                        generatedTypescriptPath: model.generatedTypescriptPath +
                                            "/" +
                                            dirent.name.replace(".proto", "_pb.ts"),
                                        outPath: model.outPath + "/" + dirent.name.replace(".proto", ".ts"),
                                        globalFilePath: model.globalFilePath,
                                    };
                                    if (!isDirectory) return [3 /*break*/, 2];
                                    _g = fileInfo;
                                    return [4 /*yield*/, load(__assign(__assign({}, fileInfo.pathInfo), { tsSuffix: model.tsSuffix }))];
                                case 1:
                                    _g.nested = _l.sent();
                                    return [3 /*break*/, 5];
                                case 2:
                                    if (!isValidFile(model.protobufPath + "/" + dirent.name, ignoreList))
                                        return [2 /*return*/, "continue"];
                                    pathResolved = path.resolve(model.protobufPath + "/" + dirent.name);
                                    return [4 /*yield*/, file_1.FileIo.read(pathResolved)];
                                case 3:
                                    protobufString = _l.sent();
                                    if (protobufString) {
                                        parsed = protobuf.parse(protobufString);
                                        if (parsed) {
                                            fileInfo.package = parsed.package;
                                            if (((_a = parsed.imports) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                                                fileInfo.imports = [];
                                                imp = new import_1.Import();
                                                for (_h = 0, _j = parsed.imports; _h < _j.length; _h++) {
                                                    impStr = _j[_h];
                                                    if (impStr.startsWith("google")) {
                                                        debugger;
                                                        imp_1 = getGoogleImport(impStr);
                                                        if (imp_1) {
                                                            fileInfo.imports.push(imp_1);
                                                        }
                                                        continue;
                                                    }
                                                    fileInfo.imports.push(imp.setProtoStrImport(impStr, fileInfo.pathInfo.protobufPath));
                                                    importedTsPath = (0, util_1.combinationPath)(fileInfo.pathInfo.generatedTypescriptPath, impStr);
                                                    getRelpath = (0, util_1.getRelativePath)(fileInfo.pathInfo.outPath, importedTsPath);
                                                    pathParsed = path.parse(importedTsPath);
                                                    importedTs = new import_1.Import();
                                                    importedTs.name = getRelpath.name;
                                                    importedTs.type = import_1.ImportType.GRPC_PB_Imported;
                                                    importedTs.fileName = getRelpath.fileName.replace(".proto", "_pb.ts");
                                                    importedTs.importStr = "import * as ".concat(pathParsed.name, "_pb from '").concat(getRelpath.path.replace(".proto", "_pb"), "'");
                                                    fileInfo.imports.push(importedTs);
                                                }
                                            }
                                        }
                                    }
                                    return [4 /*yield*/, file_1.FileIo.loadProtobuf(pathResolved)];
                                case 4:
                                    protoBuf = _l.sent();
                                    if (protoBuf) {
                                        fileInfo.codeBlocks = new block_1.RootBlock(protoBuf);
                                        fileInfo.services = new service_1.Service(protoBuf, fileInfo);
                                        if (((_c = (_b = fileInfo.services) === null || _b === void 0 ? void 0 : _b.methods) === null || _c === void 0 ? void 0 : _c.length) > 0) {
                                            if (!fileInfo.imports)
                                                fileInfo.imports = [];
                                            (_k = fileInfo.imports).push.apply(_k, addImportedFile(fileInfo));
                                        }
                                        (_e = (_d = fileInfo.services) === null || _d === void 0 ? void 0 : _d.methods) === null || _e === void 0 ? void 0 : _e.forEach(function (method) {
                                            method.load(fileInfo);
                                        });
                                    }
                                    fileInfo.typescriptPbFile = [];
                                    fileInfoList.push(fileInfo);
                                    _l.label = 5;
                                case 5: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, directorys_1 = directorys;
                    _f.label = 2;
                case 2:
                    if (!(_i < directorys_1.length)) return [3 /*break*/, 5];
                    dirent = directorys_1[_i];
                    return [5 /*yield**/, _loop_1(dirent)];
                case 3:
                    _f.sent();
                    _f.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, fileInfoList];
            }
        });
    });
}
function addImportedFile(fileInfo) {
    var imp = [];
    // import global -----------------------------------------
    var globalRelative = (0, util_1.getRelativePath)(fileInfo.pathInfo.outPath, fileInfo.pathInfo.globalFilePath);
    imp.push({
        name: "global",
        importStr: "import * as global from '" + globalRelative.path + "'",
        type: import_1.ImportType.GLOBAL,
    });
    // import Protobuf File -----------------------------------------
    var relativePath = (0, util_1.getRelativePath)(fileInfo.pathInfo.outPath, fileInfo.pathInfo.generatedTypescriptPath);
    imp.push({
        name: relativePath.name,
        fileName: relativePath.fileName,
        importStr: "import * as ".concat(relativePath.name, " from '") +
            relativePath.path.replace(".ts", "") +
            "'",
        type: import_1.ImportType.GRPC_PB,
    });
    // import Protobuf Service file -----------------------------------------
    imp.push({
        name: relativePath.name.replace("_pb", "Service"),
        fileName: relativePath.name.replace("_pb", "_grpc_web_pb"),
        importStr: "import * as ".concat(relativePath.name.replace("_pb", "Service"), " from '") +
            relativePath.path.replace("_pb.ts", "_grpc_web_pb") +
            "'",
        type: import_1.ImportType.GRPC_SERVICE,
    });
    // -----------------------------------------
    fileInfo.imports;
    return imp;
}
function getGoogleImport(imp) {
    if (imp === "google/protobuf/struct.proto") {
        var newImp = new import_1.Import();
        newImp.name = "google_protobuf_struct";
        newImp.type = import_1.ImportType.GOOGLE;
        newImp.importStr = "import * as google_protobuf_struct from 'google-protobuf/google/protobuf/struct_pb';";
        return newImp;
    }
    return undefined;
}
function getFileMap(files) {
    var _a;
    var fileMap = new Map();
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        if (((_a = file.nested) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            var nestedMap = getFileMap(file.nested);
            nestedMap.forEach(function (value, key) {
                fileMap.set(key, value);
            });
        }
        else {
            var path_1 = file.pathInfo.protobufPath;
            fileMap.set(path_1, file);
        }
    }
    return fileMap;
}
function updateImports(files, blockMaps) {
    var _a;
    for (var _i = 0, files_2 = files; _i < files_2.length; _i++) {
        var file = files_2[_i];
        if (file.nested) {
            updateImports(file.nested, blockMaps);
        }
        else {
            if (((_a = file.imports) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                for (var _b = 0, _c = file.imports; _b < _c.length; _b++) {
                    var imp = _c[_b];
                    if (imp.type == import_1.ImportType.TS) {
                        imp.file = blockMaps.get(imp.file.pathInfo.protobufPath);
                        var parsed = path.parse(imp.file.pathInfo.outPath);
                        imp.name = parsed.name;
                        var relativePath = (0, util_1.getRelativePath)(file.pathInfo.outPath, imp.file.pathInfo.outPath);
                        imp.importStr = "import * as ".concat(relativePath.name, " from '").concat(relativePath.path.replace(".ts", ""), "';");
                    }
                }
                // fileName: 'type.proto'
                // name: 'type'
                // protoStr: 'account/v2/type.proto'
                // {"./sample/web/account/v2/org.ts" => RootBlock}
                // {"./sample/web/account/v2/plan.ts" => RootBlock}
                // {"./sample/web/account/v2/type.ts" => RootBlock}
                // {"./sample/web/account/v2/user.ts" => RootBlock}
            }
        }
    }
    return files;
}
function isValidFile(fileName, ignoreList) {
    if (!fileName.endsWith(".proto"))
        return false;
    if (ignoreList.includes(fileName)) {
        return false;
    }
    return true;
}
function getProtoIgnoreList() {
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
}
//# sourceMappingURL=protoToTypescript.js.map