var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const fs = require("fs");
var path = require("path");
var util = require("util");
var log_file = fs.createWriteStream(__dirname + "/debug.log", { flags: "w" });
var log_stdout = process.stdout;
console.log = function (d) {
    //
    log_file.write(util.format(d) + "\n");
    log_stdout.write(util.format(d) + "\n");
};
class Block {
    constructor(_content, _isNamespace, _isClass, _name, _blocks, _level, _ended) {
        this.content = _content;
        this.isNamespace = _isNamespace;
        this.isClass = _isClass;
        this.name = _name;
        this.blocks = _blocks;
        this.level = _level;
        this.ended = _ended;
    }
}
const newLine = "\r\n";
let replaces = [];
let replaceBuffer = [];
let replaceGlobalFile = [];
let imports = [];
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield generate("./node/v1/cmd/", "./node/model/v1/cmd/");
        yield generate("./node/v1/common/", "./node/model/v1/common/");
        yield generate("./node/v1/qry/", "./node/model/v1/qry/");
        yield generate("./node/v1/qry/admin/", "./node/model/v1/qry/admin/");
    });
}
function generate(rootpath, savePath) {
    return __awaiter(this, void 0, void 0, function* () {
        let allFile = yield getAllFileAndDirectory(rootpath);
        for (let i = 0; i < allFile.length; i++) {
            let file = allFile[i];
            console.log(i);
            if (file.isDirectory)
                continue;
            let ext = path.extname(file.name);
            if (file.name.includes("grpc_web_pb") ||
                file.name.includes("index") ||
                ext == ".js")
                continue;
            const name = file.name.replace("d.ts", "ts");
            console.log("start parse");
            yield grpcToBlock(rootpath, rootpath + file.name, savePath + name, true);
            console.log("end parse");
        }
        console.log("end parser function");
    });
}
function grpcToBlock(rootPath, rootFileName, saveFilePath, generate) {
    return __awaiter(this, void 0, void 0, function* () {
        let fileContent = yield fs.readFileSync(rootFileName, "utf-8");
        imports = [];
        replaceBuffer = [];
        replaceGlobalFile = [];
        let blocks = getBlocks(fileContent);
        let newFile = yield getImports(rootPath);
        blocks.forEach((block) => {
            replaces = [];
            let blockSection = blockToObject(block);
            if ((blockSection === null || blockSection === void 0 ? void 0 : blockSection.length) > 0) {
                let file = generateNewFile(blockSection[0], undefined);
                file = replaceOnBlock(file);
                newFile += file;
            }
        });
        newFile = replaceGlobal(newFile);
        newFile = replaceWithBuffer(newFile);
        // newFile = newFile.replace(/.AsObject/gi, "");
        if (generate) {
            yield fs.writeFileSync(saveFilePath, newFile);
        }
        else {
            return blocks;
        }
    });
}
function getBlocks(block) {
    let lines = getLines(block);
    let blocks = [];
    imports = [];
    if ((lines === null || lines === void 0 ? void 0 : lines.length) > 0) {
        let startBlock = 0;
        let block = "";
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
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
                    block += line + newLine;
                }
                else {
                    block = block + "}";
                    blocks.push(block);
                    block = "";
                }
            }
        }
    }
    return blocks;
}
function blockToObject(_block) {
    let lines = getLines(_block);
    let level = -1;
    let result = [];
    let stack = [];
    lines.forEach((line) => {
        let isBracket = false;
        if (line.includes("{")) {
            level += 1;
            let newBlock = new Block(line, line.includes("namespace"), line.includes("class"), getName(line), [], level, false);
            if (stack.length > 0) {
                stack[stack.length - 1].blocks.push(newBlock);
            }
            stack.push(newBlock);
            isBracket = true;
        }
        if (line.includes("}")) {
            stack[stack.length - 1].content += line;
            if (stack.length == 1) {
                result = [...result, ...stack];
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
    let finalContent = "";
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
            finalContent += newLine + `export namespace ${block.name} {` + newLine;
        }
        for (let i = 0; i < block.blocks.length; i++) {
            if (block.blocks[i].content.includes(" AsObject")) {
                replaceGlobalFile.push({
                    str: (block === null || block === void 0 ? void 0 : block.name) + ".AsObject",
                    replaceStr: (block === null || block === void 0 ? void 0 : block.name) + "." + (block === null || block === void 0 ? void 0 : block.name),
                });
            }
            let returned = generateNewFile(block.blocks[i], block);
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
    let words = line.trim().split(" ");
    return words[2];
}
function getAllFileAndDirectory(root) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = [];
        let directorys = yield fs
            .readdirSync(root, { withFileTypes: true })
            .map((dirent) => {
            return {
                name: dirent.name,
                isDirectory: dirent.isDirectory(),
            };
        });
        result.push(...directorys);
        return result;
    });
}
function replaceOnBlock(block) {
    if ((replaces === null || replaces === void 0 ? void 0 : replaces.length) > 0) {
        replaces.forEach((info) => {
            const reg = `\\.${info.str}`;
            let regx = new RegExp(reg, "g");
            block = block.replace(regx, info.replaceStr);
        });
    }
    return block;
}
function addBuffer(str, replaceStr) {
    if (replaceBuffer.findIndex((x) => x.str == str) < 0) {
        replaceBuffer.push({
            str: str,
            replaceStr: replaceStr,
        });
    }
}
function replaceWithBuffer(block) {
    if ((replaceBuffer === null || replaceBuffer === void 0 ? void 0 : replaceBuffer.length) > 0) {
        replaceBuffer.forEach((info) => {
            const reg = `${info.str}`;
            let regx = new RegExp(reg, "g");
            block = block.replace(regx, info.replaceStr);
        });
    }
    return block;
}
function replaceGlobal(block) {
    if ((replaceGlobalFile === null || replaceGlobalFile === void 0 ? void 0 : replaceGlobalFile.length) > 0) {
        replaceGlobalFile.forEach((info) => {
            const reg = `${info.str}`;
            let regx = new RegExp(reg, "g");
            block = block.replace(regx, info.replaceStr);
        });
    }
    return block;
}
function getImports(rootPath) {
    return __awaiter(this, void 0, void 0, function* () {
        let content = "";
        if (imports.length > 0) {
            let needBuf = [];
            for (let i = 0; i < imports.length; i++) {
                let item = imports[i];
                if (item.includes("jspb"))
                    continue;
                content += item + newLine;
                needBuf.push(item);
            }
            for (let i = 0; i < imports.length; i++) {
                yield bufferImportedBlock(rootPath, imports[i]);
            }
            return content;
        }
        return "";
    });
}
function bufferImportedBlock(rootPath, _imported) {
    return __awaiter(this, void 0, void 0, function* () {
        if (rootPath.endsWith("/")) {
            rootPath = rootPath.substring(0, rootPath.length - 1);
        }
        let _path = getPath(_imported, rootPath);
        if (_path) {
            let fileContent = yield fs.readFileSync(_path.path, "utf-8");
            let blocks = getBlocks(fileContent);
            blocks.forEach((block) => {
                let blockSection = blockToObject(block);
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
        }
    });
}
function getPath(_imported, root) {
    let spl = _imported.replace(/(?:'|;|")/g, "").split(" ");
    if (spl[5].startsWith(".")) {
        let path = spl[5].split("/");
        let rootpath = root.split("/");
        path.forEach((item, index) => {
            if (item == "..") {
                rootpath.splice(rootpath.length - 1, 1);
                path.splice(index, 1);
            }
        });
        return {
            name: spl[3],
            path: rootpath.join("/") + "/" + path.join("/") + ".d.ts",
        };
    }
    return undefined;
}
main();
//# sourceMappingURL=parser.js.map