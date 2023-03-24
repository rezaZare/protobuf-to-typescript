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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var fs = require("fs");
var path = require("path");
var util = require("util");
var log_file = fs.createWriteStream(__dirname + "/debug.log", { flags: "w" });
var log_stdout = process.stdout;
console.log = function (d) {
    //
    log_file.write(util.format(d) + "\n");
    log_stdout.write(util.format(d) + "\n");
};
var Block = /** @class */ (function () {
    function Block(_content, _isNamespace, _isClass, _name, _blocks, _level, _ended) {
        this.content = _content;
        this.isNamespace = _isNamespace;
        this.isClass = _isClass;
        this.name = _name;
        this.blocks = _blocks;
        this.level = _level;
        this.ended = _ended;
    }
    return Block;
}());
var newLine = "\r\n";
var replaces = [];
var replaceBuffer = [];
var replaceGlobalFile = [];
var imports = [];
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, generate("./node/v1/cmd/", "./node/model/v1/cmd/")];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, generate("./node/v1/common/", "./node/model/v1/common/")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, generate("./node/v1/qry/", "./node/model/v1/qry/")];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, generate("./node/v1/qry/admin/", "./node/model/v1/qry/admin/")];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function generate(rootpath, savePath) {
    return __awaiter(this, void 0, void 0, function () {
        var allFile, i, file, ext, name;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAllFileAndDirectory(rootpath)];
                case 1:
                    allFile = _a.sent();
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < allFile.length)) return [3 /*break*/, 5];
                    file = allFile[i];
                    console.log(i);
                    if (file.isDirectory)
                        return [3 /*break*/, 4];
                    ext = path.extname(file.name);
                    if (file.name.includes("grpc_web_pb") ||
                        file.name.includes("index") ||
                        ext == ".js")
                        return [3 /*break*/, 4];
                    name = file.name.replace("d.ts", "ts");
                    console.log("start parse");
                    return [4 /*yield*/, grpcToBlock(rootpath, rootpath + file.name, savePath + name, true)];
                case 3:
                    _a.sent();
                    console.log("end parse");
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5:
                    console.log("end parser function");
                    return [2 /*return*/];
            }
        });
    });
}
function grpcToBlock(rootPath, rootFileName, saveFilePath, generate) {
    return __awaiter(this, void 0, void 0, function () {
        var fileContent, blocks, newFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.readFileSync(rootFileName, "utf-8")];
                case 1:
                    fileContent = _a.sent();
                    imports = [];
                    replaceBuffer = [];
                    replaceGlobalFile = [];
                    blocks = getBlocks(fileContent);
                    return [4 /*yield*/, getImports(rootPath)];
                case 2:
                    newFile = _a.sent();
                    blocks.forEach(function (block) {
                        replaces = [];
                        var blockSection = blockToObject(block);
                        if ((blockSection === null || blockSection === void 0 ? void 0 : blockSection.length) > 0) {
                            var file = generateNewFile(blockSection[0], undefined);
                            file = replaceOnBlock(file);
                            newFile += file;
                        }
                    });
                    newFile = replaceGlobal(newFile);
                    newFile = replaceWithBuffer(newFile);
                    if (!generate) return [3 /*break*/, 4];
                    return [4 /*yield*/, fs.writeFileSync(saveFilePath, newFile)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4: return [2 /*return*/, blocks];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function getBlocks(block) {
    var lines = getLines(block);
    var blocks = [];
    imports = [];
    if ((lines === null || lines === void 0 ? void 0 : lines.length) > 0) {
        var startBlock = 0;
        var block_1 = "";
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (line.trim() == "")
                continue;
            if (line.includes("import")) {
                imports.push(line);
                continue;
            }
            else {
                if (line.includes("{")) {
                    startBlock += 1;
                }
                if (line.includes("}")) {
                    startBlock -= 1;
                }
                if (startBlock != 0) {
                    block_1 += line + newLine;
                }
                else {
                    block_1 = block_1 + "}";
                    blocks.push(block_1);
                    block_1 = "";
                }
            }
        }
    }
    return blocks;
}
function blockToObject(_block) {
    var lines = getLines(_block);
    var level = -1;
    var result = [];
    var stack = [];
    lines.forEach(function (line) {
        var isBracket = false;
        if (line.includes("{")) {
            level += 1;
            var newBlock = new Block(line, line.includes("namespace"), line.includes("class"), getName(line), [], level, false);
            if (stack.length > 0) {
                stack[stack.length - 1].blocks.push(newBlock);
            }
            stack.push(newBlock);
            isBracket = true;
        }
        if (line.includes("}")) {
            stack[stack.length - 1].content += line;
            if (stack.length == 1) {
                result = __spreadArray(__spreadArray([], result, true), stack, true);
            }
            stack.splice(stack.length - 1, 1);
            level -= 1;
            isBracket = true;
        }
        if (!isBracket) {
            stack[stack.length - 1].content += line;
        }
    });
    return result;
}
function generateNewFile(block, parent) {
    var _a;
    var finalContent = "";
    if (block.content.includes("jspb.Message"))
        return "";
    if (block.blocks.length == 1 && block.isNamespace) {
        block.blocks[0].content = block.blocks[0].content.replace(" AsObject", " " + block.name);
        finalContent += newLine + block.blocks[0].content;
        replaces.push({
            str: block.name + ".AsObject",
            replaceStr: "." + block.name,
        });
        replaceGlobalFile.push({
            str: (block === null || block === void 0 ? void 0 : block.name) + ".AsObject",
            replaceStr: block === null || block === void 0 ? void 0 : block.name,
        });
    }
    else if (((_a = block.blocks) === null || _a === void 0 ? void 0 : _a.length) > 1) {
        if (block.isNamespace) {
            finalContent += newLine + "export namespace ".concat(block.name, " {") + newLine;
        }
        for (var i = 0; i < block.blocks.length; i++) {
            if (block.blocks[i].content.includes(" AsObject")) {
                replaceGlobalFile.push({
                    str: (block === null || block === void 0 ? void 0 : block.name) + ".AsObject",
                    replaceStr: (block === null || block === void 0 ? void 0 : block.name) + "." + (block === null || block === void 0 ? void 0 : block.name),
                });
            }
            var returned = generateNewFile(block.blocks[i], block);
            finalContent += newLine + returned;
        }
        finalContent += "}";
    }
    else {
        if (block.content.includes(" AsObject")) {
            block.content = block.content.replace(" AsObject", " " + (parent === null || parent === void 0 ? void 0 : parent.name));
            replaces.push({
                str: (parent === null || parent === void 0 ? void 0 : parent.name) + ".AsObject",
                replaceStr: "." + (parent === null || parent === void 0 ? void 0 : parent.name) + "." + (parent === null || parent === void 0 ? void 0 : parent.name),
            });
        }
        finalContent += newLine + block.content;
    }
    // finalContent = finalContent.replace(/.AsObject/gi, "");
    return finalContent;
}
function getLines(block) {
    return block.split(/\r?\n/);
}
function getName(line) {
    var words = line.trim().split(" ");
    return words[2];
}
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
function replaceOnBlock(block) {
    if ((replaces === null || replaces === void 0 ? void 0 : replaces.length) > 0) {
        replaces.forEach(function (info) {
            var reg = "\\.".concat(info.str);
            var regx = new RegExp(reg, "g");
            block = block.replace(regx, info.replaceStr);
        });
    }
    return block;
}
function addBuffer(str, replaceStr) {
    if (replaceBuffer.findIndex(function (x) { return x.str == str; }) < 0) {
        replaceBuffer.push({
            str: str,
            replaceStr: replaceStr,
        });
    }
}
function replaceWithBuffer(block) {
    if ((replaceBuffer === null || replaceBuffer === void 0 ? void 0 : replaceBuffer.length) > 0) {
        replaceBuffer.forEach(function (info) {
            var reg = "".concat(info.str);
            var regx = new RegExp(reg, "g");
            block = block.replace(regx, info.replaceStr);
        });
    }
    return block;
}
function replaceGlobal(block) {
    if ((replaceGlobalFile === null || replaceGlobalFile === void 0 ? void 0 : replaceGlobalFile.length) > 0) {
        replaceGlobalFile.forEach(function (info) {
            var reg = "".concat(info.str);
            var regx = new RegExp(reg, "g");
            block = block.replace(regx, info.replaceStr);
        });
    }
    return block;
}
function getImports(rootPath) {
    return __awaiter(this, void 0, void 0, function () {
        var content, needBuf, i, item, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    content = "";
                    if (!(imports.length > 0)) return [3 /*break*/, 5];
                    needBuf = [];
                    for (i = 0; i < imports.length; i++) {
                        item = imports[i];
                        if (item.includes("jspb"))
                            continue;
                        content += item + newLine;
                        needBuf.push(item);
                    }
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < imports.length)) return [3 /*break*/, 4];
                    return [4 /*yield*/, bufferImportedBlock(rootPath, imports[i])];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, content];
                case 5: return [2 /*return*/, ""];
            }
        });
    });
}
function bufferImportedBlock(rootPath, _imported) {
    return __awaiter(this, void 0, void 0, function () {
        var _path, fileContent, blocks;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (rootPath.endsWith("/")) {
                        rootPath = rootPath.substring(0, rootPath.length - 1);
                    }
                    _path = getPath(_imported, rootPath);
                    if (!_path) return [3 /*break*/, 2];
                    return [4 /*yield*/, fs.readFileSync(_path.path, "utf-8")];
                case 1:
                    fileContent = _a.sent();
                    blocks = getBlocks(fileContent);
                    blocks.forEach(function (block) {
                        var blockSection = blockToObject(block);
                        if ((blockSection === null || blockSection === void 0 ? void 0 : blockSection.length) > 0) {
                            if (blockSection[0].isNamespace) {
                                if (blockSection[0].blocks.length == 1) {
                                    addBuffer((_path === null || _path === void 0 ? void 0 : _path.name) + "." + blockSection[0].name + ".AsObject", (_path === null || _path === void 0 ? void 0 : _path.name) + "." + blockSection[0].name);
                                }
                                else if (blockSection[0].blocks.length > 1) {
                                    addBuffer((_path === null || _path === void 0 ? void 0 : _path.name) + "." + blockSection[0].name + ".AsObject", (_path === null || _path === void 0 ? void 0 : _path.name) +
                                        "." +
                                        blockSection[0].name +
                                        "." +
                                        blockSection[0].name);
                                }
                            }
                        }
                    });
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
function getPath(_imported, root) {
    var spl = _imported.replace(/(?:'|;|")/g, "").split(" ");
    if (spl[5].startsWith(".")) {
        var path_1 = spl[5].split("/");
        var rootpath_1 = root.split("/");
        path_1.forEach(function (item, index) {
            if (item == "..") {
                rootpath_1.splice(rootpath_1.length - 1, 1);
                path_1.splice(index, 1);
            }
        });
        return {
            name: spl[3],
            path: rootpath_1.join("/") + "/" + path_1.join("/") + ".d.ts",
        };
    }
    return undefined;
}
main();
//# sourceMappingURL=parser.js.map