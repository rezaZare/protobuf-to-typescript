var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as fs from "fs";
import * as path from "path";
import * as protobuf from "protobufjs";
import { FileUtil } from "../../utils/fileUtil";
import { blockType, } from "../model";
import { generateImportCode } from "../imports/generateImportCode";
import { generateTypes } from "../types/generateTypes";
import { Service } from "../service/service";
import { getFileName } from "../../utils/extension";
export class FileInfo {
    load(root, grpcPath, outPath, globalpath) {
        return __awaiter(this, void 0, void 0, function* () {
            let ignoreList = yield this.getProtoIgnoreList();
            this.files = yield this.loadInfo(root, grpcPath, outPath, globalpath, ignoreList);
            this.allType = this.getAllType(this.files);
            this.files = this.getImportedTypes(this.files, this.allType);
        });
    }
    loadInfo(root, grpcPath, outPath, globalpath, ignoreList) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let result = [];
            let directorys = yield fs.readdirSync(root, { withFileTypes: true });
            for (let dirent of directorys) {
                const isDirectory = dirent.isDirectory();
                let nestedDirectory = [];
                let typeBlocks = [];
                let service;
                let imports = [];
                let pathResolved = "";
                let fileName = getFileName(dirent.name);
                let pathInfo = {
                    outPath: outPath,
                    pbName: dirent.name,
                    grpcPb: fileName + "_pb.js",
                    grpcServicePb: fileName + "ServiceClientPb.ts",
                    path: root,
                    tsName: fileName + ".ts",
                    grpcPath: grpcPath,
                    pathResolved: pathResolved,
                    globalpath: globalpath,
                    fileName: fileName,
                };
                if (isDirectory) {
                    nestedDirectory = yield this.loadInfo(root + "/" + dirent.name, grpcPath + "/" + dirent.name, outPath + "/" + dirent.name, globalpath, ignoreList);
                }
                else {
                    if (!this.isValidFile(root + "/" + dirent.name, ignoreList))
                        continue;
                    //Fill Imports and codes
                    pathResolved = path.resolve(root + "/" + dirent.name);
                    let protobufStr = yield new FileUtil().read(pathResolved);
                    if (protobufStr) {
                        let parsed = protobuf.parse(protobufStr);
                        if (((_a = parsed.imports) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                            imports = generateImportCode(parsed.imports);
                        }
                    }
                    let protoBuf = yield this.loadProtoBuf(pathResolved);
                    if (protoBuf) {
                        typeBlocks = generateTypes(protoBuf);
                        service = new Service(protoBuf, pathInfo);
                    }
                }
                result.push({
                    path: pathInfo,
                    name: getFileName(dirent.name),
                    isDirectory: isDirectory,
                    nested: nestedDirectory,
                    imports: imports,
                    codeBlock: typeBlocks,
                    Service: service,
                    typeList: this.getFileTypes(typeBlocks),
                    importedType: [],
                });
            }
            return result;
        });
    }
    loadProtoBuf(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield protobuf.loadSync(filePath);
        });
    }
    getFileTypes(blocks) {
        let types = [];
        if (blocks.length > 0) {
            blocks.forEach((block) => {
                if (block.blockType == blockType.TYPE ||
                    block.blockType == blockType.ENUM) {
                    types.push({
                        name: block.name,
                        isNamespace: false,
                        nested: undefined,
                        fields: block.fields,
                        type: block.blockType,
                    });
                }
                else if (block.blockType == blockType.NAMESPACE) {
                    let nestedTypes = this.getFileTypes(block.blocks);
                    types.push({
                        name: block.name,
                        isNamespace: true,
                        nested: nestedTypes,
                    });
                }
            });
        }
        return types;
    }
    getAllType(files) {
        var _a;
        let typeList = [];
        for (let file of files) {
            if (file.isDirectory) {
                typeList.push(...this.getAllType(file.nested));
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
    }
    getImportedTypes(files, allTypes) {
        files.forEach((file) => {
            if (file.isDirectory) {
                file.nested = this.getImportedTypes(file.nested, allTypes);
            }
            else {
                file.importedType = [];
                file.imports.forEach((imp) => {
                    if (imp.symbol == "google") {
                        file.importedType.push({
                            import: imp,
                            name: imp.symbol,
                            fileName: "google-protobuf",
                            fieldType: [],
                            importStr: `import * as google from "google-protobuf"`,
                            types: [],
                        });
                        return;
                    }
                    let spl = imp.source.split("/");
                    let fileName = spl[spl.length - 1];
                    let importedTypes = allTypes.filter((x) => x.fileName == fileName);
                    if (importedTypes.length > 0) {
                        importedTypes.forEach((item) => {
                            item.name = imp.symbol;
                            item.import = imp;
                        });
                        file.importedType.push(...importedTypes);
                    }
                    //'../common/types_common_v1'
                });
            }
        });
        return files;
    }
    getProtoIgnoreList() {
        return __awaiter(this, void 0, void 0, function* () {
            let pathResolved = path.resolve("./.protoIgnore");
            if (fs.existsSync(pathResolved)) {
                let data = yield new FileUtil().read(pathResolved);
                if (data) {
                    return data.split(/\r?\n/);
                }
            }
            return [];
        });
    }
    isValidFile(fileName, ignoreList) {
        if (!fileName.endsWith(".proto"))
            return false;
        if (ignoreList.includes(fileName)) {
            debugger;
            return false;
        }
        return true;
    }
}
//# sourceMappingURL=fileInfo.js.map