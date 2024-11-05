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
exports.loadFile = exports.protoToTs = void 0;
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var protobuf = __importStar(require("protobufjs"));
var fs_1 = require("fs");
var protobufTest = __importStar(require("./protobuf"));
var generate_1 = require("./generate");
var generateGlobal_1 = require("./generateGlobal");
function protoToTs(name, protoDir, outDir, endPoint, unauthorizedPath) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var files, fielMap, globalDir, _loop_1, _i, files_1, file;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, loadFile(protoDir, outDir)];
                case 1:
                    files = _b.sent();
                    fielMap = getFileMap(files);
                    files = updateImports(files, fielMap);
                    return [4 /*yield*/, (0, generate_1.generateAllinOneFile)(getAllProtoPath(files), outDir, name)];
                case 2:
                    _b.sent();
                    globalDir = (0, generateGlobal_1.GenerateGlobalFiles)(endPoint, outDir, unauthorizedPath);
                    if (!(files.length > 0)) return [3 /*break*/, 6];
                    _loop_1 = function (file) {
                        var importedPath, needGoogleImport;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    importedPath = void 0;
                                    needGoogleImport = false;
                                    if (((_a = file.imports) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                                        importedPath = file.imports.map(function (x) {
                                            if (x.notDetect) {
                                                needGoogleImport = true;
                                                return x.protoPath;
                                            }
                                            else {
                                                if (x.path && x.path.inPath) {
                                                    return x.path.inPath;
                                                }
                                                else {
                                                    return "";
                                                }
                                            }
                                        });
                                    }
                                    return [4 /*yield*/, (0, generate_1.generate)(file.path.inPath, file.path.outPath, importedPath, globalDir, needGoogleImport, name)];
                                case 1:
                                    _c.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, files_1 = files;
                    _b.label = 3;
                case 3:
                    if (!(_i < files_1.length)) return [3 /*break*/, 6];
                    file = files_1[_i];
                    return [5 /*yield**/, _loop_1(file)];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [4 /*yield*/, (0, generate_1.generateIndex)(name, outDir, files)];
                case 7:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.protoToTs = protoToTs;
function getAllProtoPath(files) {
    var _a;
    var protoPath = [];
    if (files.length > 0) {
        for (var _i = 0, files_2 = files; _i < files_2.length; _i++) {
            var file = files_2[_i];
            if (((_a = file.nested) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                protoPath.push.apply(protoPath, getAllProtoPath(file.nested));
            }
            else {
                protoPath.push(file.path.inPath);
            }
        }
    }
    return protoPath;
}
function testGen() {
    return __awaiter(this, void 0, void 0, function () {
        var files, staticObjectsSource, staticObjectsFilename, staticDeclarationsSource, staticDeclarationsFilename;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    files = [
                        "./sample/auth/api/proto/auth/v1/admin_service_v1.proto",
                        "./sample/auth/api/proto/auth/v1/admin_v1.proto",
                        "./sample/auth/api/proto/auth/v1/api_service_v1.proto",
                        "./sample/auth/api/proto/auth/v1/common_v1.proto",
                        "./sample/auth/api/proto/auth/v1/entry_service_v1.proto",
                        "./sample/auth/api/proto/auth/v1/group_service_v1.proto",
                        "./sample/auth/api/proto/auth/v1/object_service_v1.proto",
                        "./sample/auth/api/proto/auth/v1/profile_service_v1.proto",
                        "./sample/auth/api/proto/auth/v1/user_service_v1.proto",
                    ];
                    return [4 /*yield*/, protobufTest.generateStaticObjects(files)];
                case 1:
                    staticObjectsSource = _a.sent();
                    staticObjectsFilename = path.resolve("./sample/auth/dist", "indexTest.js");
                    return [4 /*yield*/, fs_1.promises.writeFile(staticObjectsFilename, staticObjectsSource)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, protobufTest.generateStaticDeclarations(staticObjectsFilename)];
                case 3:
                    staticDeclarationsSource = _a.sent();
                    staticDeclarationsFilename = path.resolve("./sample/auth/dist", "indexTest.d.ts");
                    return [4 /*yield*/, fs_1.promises.writeFile(staticDeclarationsFilename, staticDeclarationsSource)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function loadFile(protoDir, outDir) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var fileInfoList, directorys, _i, directorys_1, dirent, isDirectory, fileInfo, _b, pathResolved, protobufString, parsed, _c, _d, impStr, parsePath;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    fileInfoList = [];
                    return [4 /*yield*/, fs.readdirSync(protoDir, {
                            withFileTypes: true,
                        })];
                case 1:
                    directorys = _e.sent();
                    _i = 0, directorys_1 = directorys;
                    _e.label = 2;
                case 2:
                    if (!(_i < directorys_1.length)) return [3 /*break*/, 8];
                    dirent = directorys_1[_i];
                    isDirectory = dirent.isDirectory();
                    fileInfo = {
                        name: path.parse(dirent.name).name,
                        fileName: dirent.name,
                        path: {
                            inPath: protoDir + "/" + dirent.name,
                            outPath: outDir + "/" + dirent.name,
                        },
                        imports: [],
                        package: "",
                    };
                    if (!isDirectory) return [3 /*break*/, 4];
                    _b = fileInfo;
                    return [4 /*yield*/, loadFile(protoDir, outDir)];
                case 3:
                    _b.nested = _e.sent();
                    return [3 /*break*/, 6];
                case 4:
                    if (path.extname(dirent.name) != ".proto")
                        return [3 /*break*/, 7];
                    pathResolved = path.resolve(protoDir + "/" + dirent.name);
                    return [4 /*yield*/, fs.readFileSync(pathResolved, "utf8")];
                case 5:
                    protobufString = _e.sent();
                    if (protobufString) {
                        parsed = protobuf.parse(protobufString);
                        fileInfo.package = parsed.package;
                        if (parsed) {
                            if (((_a = parsed.imports) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                                for (_c = 0, _d = parsed.imports; _c < _d.length; _c++) {
                                    impStr = _d[_c];
                                    if (impStr.startsWith("buf/validate")) {
                                        continue;
                                    }
                                    if (impStr.startsWith("google")) {
                                        fileInfo.imports.push({
                                            fileName: impStr,
                                            protoPath: impStr,
                                            notDetect: true,
                                        });
                                    }
                                    else {
                                        parsePath = path.parse(impStr);
                                        fileInfo.imports.push({
                                            fileName: parsePath.base,
                                            protoPath: impStr,
                                            notDetect: false,
                                        });
                                    }
                                }
                            }
                        }
                    }
                    _e.label = 6;
                case 6:
                    fileInfoList.push(fileInfo);
                    _e.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 2];
                case 8: return [2 /*return*/, fileInfoList];
            }
        });
    });
}
exports.loadFile = loadFile;
function getFileMap(files) {
    var _a;
    var fileMap = new Map();
    for (var _i = 0, files_3 = files; _i < files_3.length; _i++) {
        var file = files_3[_i];
        if (((_a = file.nested) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            var nestedMap = getFileMap(file.nested);
            nestedMap.forEach(function (value, key) {
                fileMap.set(key, value);
            });
        }
        else {
            fileMap.set(file.fileName, file.path);
        }
    }
    return fileMap;
}
function updateImports(files, blockMaps) {
    var _a;
    for (var _i = 0, files_4 = files; _i < files_4.length; _i++) {
        var file = files_4[_i];
        if (file.nested) {
            updateImports(file.nested, blockMaps);
        }
        else {
            if (((_a = file.imports) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                for (var _b = 0, _c = file.imports; _b < _c.length; _b++) {
                    var imp = _c[_b];
                    if (!imp.notDetect) {
                        imp.path = blockMaps.get(imp.fileName);
                    }
                }
            }
        }
    }
    return files;
}
//# sourceMappingURL=index.js.map