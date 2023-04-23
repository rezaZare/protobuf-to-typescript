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
exports.generateIndex = void 0;
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
// async function main() {
//   await generateIndex("./node/v1");
//   await generateIndex("./node/model");
// }
function generateIndex(root) {
    return __awaiter(this, void 0, void 0, function () {
        var indexPath, indexTypePath, directorys, content, _i, directorys_1, file;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    indexPath = root + "/index.js";
                    indexTypePath = root + "/index.d.ts";
                    return [4 /*yield*/, deleteIfExisted(indexPath)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, deleteIfExisted(indexTypePath)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, getAllFileAndDirectory(root)];
                case 3:
                    directorys = _a.sent();
                    if (!(directorys.length > 0)) return [3 /*break*/, 7];
                    return [4 /*yield*/, makeIndexFile(root, directorys)];
                case 4:
                    content = _a.sent();
                    return [4 /*yield*/, createIndexFile(indexPath, content)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, createIndexFile(indexTypePath, content)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    _i = 0, directorys_1 = directorys;
                    _a.label = 8;
                case 8:
                    if (!(_i < directorys_1.length)) return [3 /*break*/, 11];
                    file = directorys_1[_i];
                    if (!file.isDirectory) return [3 /*break*/, 10];
                    return [4 /*yield*/, generateIndex(root + "/" + file.name)];
                case 9:
                    _a.sent();
                    _a.label = 10;
                case 10:
                    _i++;
                    return [3 /*break*/, 8];
                case 11: return [2 /*return*/];
            }
        });
    });
}
exports.generateIndex = generateIndex;
function getAllFileAndDirectory(root) {
    return __awaiter(this, void 0, void 0, function () {
        var result, directorys;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = [];
                    return [4 /*yield*/, fs
                            .readdirSync(root, { withFileTypes: true })
                            .map(function (dirent) {
                            return {
                                name: dirent.name,
                                isDirectory: dirent.isDirectory(),
                            };
                        })];
                case 1:
                    directorys = _a.sent();
                    result.push.apply(result, directorys);
                    return [2 /*return*/, result];
            }
        });
    });
}
function makeIndexFile(root, files) {
    return __awaiter(this, void 0, void 0, function () {
        var content, _i, files_1, file, name, ext;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    content = "";
                    _i = 0, files_1 = files;
                    _a.label = 1;
                case 1:
                    if (!(_i < files_1.length)) return [3 /*break*/, 5];
                    file = files_1[_i];
                    name = file.name;
                    ext = path.extname(name);
                    if (!ext) return [3 /*break*/, 3];
                    if (ext != ".ts") {
                        return [3 /*break*/, 4];
                    }
                    return [4 /*yield*/, fileNeadToBeExport(root + "/" + file.name)];
                case 2:
                    if (_a.sent()) {
                        if (name.endsWith(".d.ts")) {
                            name = name.replace(".d.ts", "");
                        }
                        else {
                            name = name.replace(ext, "");
                        }
                        content += "export * as ".concat(name, " from \"./").concat(name, "\";\n");
                    }
                    return [3 /*break*/, 4];
                case 3:
                    content += "export * as ".concat(name, " from \"./").concat(name, "\";\n");
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/, content];
            }
        });
    });
}
function createIndexFile(path, content) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.writeFile(path, content, function (err) {
                        if (err)
                            throw err;
                        console.log("File is created successfully.");
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function deleteIfExisted(path) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.existsSync(path)];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 3];
                    return [4 /*yield*/, fs.unlinkSync(path)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function fileNeadToBeExport(filename) {
    return __awaiter(this, void 0, void 0, function () {
        var contents;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.readFileSync(filename, "utf-8")];
                case 1:
                    contents = _a.sent();
                    return [2 /*return*/, contents.includes("export")];
            }
        });
    });
}
//# sourceMappingURL=generateIndex.js.map