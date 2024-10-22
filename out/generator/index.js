"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadFile = exports.protoToTs = void 0;
const fs = require("fs");
const path = require("path");
const protobuf = require("protobufjs");
const fs_1 = require("fs");
const protobufTest = require("./protobuf");
const generate_1 = require("./generate");
const generateGlobal_1 = require("./generateGlobal");
async function protoToTs(name, protoDir, outDir, endPoint, unauthorizedPath) {
    var _a;
    let files = await loadFile(protoDir, outDir);
    let fielMap = getFileMap(files);
    files = updateImports(files, fielMap);
    await (0, generate_1.generateAllinOneFile)(getAllProtoPath(files), outDir, name);
    // /*
    //    this section generate global files
    // */
    let globalDir = (0, generateGlobal_1.GenerateGlobalFiles)(endPoint, outDir, unauthorizedPath);
    if (files.length > 0) {
        for (let file of files) {
            let importedPath;
            let needGoogleImport = false;
            if (((_a = file.imports) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                importedPath = file.imports.map(function (x) {
                    if (x.notDetect) {
                        needGoogleImport = true;
                        return x.protoPath;
                    }
                    else
                        return x.path.inPath;
                });
            }
            await (0, generate_1.generate)(file.path.inPath, file.path.outPath, importedPath, globalDir, needGoogleImport, name);
        }
    }
    await (0, generate_1.generateIndex)(name, outDir, files);
}
exports.protoToTs = protoToTs;
function getAllProtoPath(files) {
    var _a;
    let protoPath = [];
    if (files.length > 0) {
        for (let file of files) {
            if (((_a = file.nested) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                protoPath.push(...getAllProtoPath(file.nested));
            }
            else {
                protoPath.push(file.path.inPath);
            }
        }
    }
    return protoPath;
}
async function testGen() {
    let files = [
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
    const staticObjectsSource = await protobufTest.generateStaticObjects(files);
    const staticObjectsFilename = path.resolve("./sample/auth/dist", `indexTest.js`);
    await fs_1.promises.writeFile(staticObjectsFilename, staticObjectsSource);
    //---------------------------
    const staticDeclarationsSource = await protobufTest.generateStaticDeclarations(staticObjectsFilename);
    const staticDeclarationsFilename = path.resolve("./sample/auth/dist", `indexTest.d.ts`);
    await fs_1.promises.writeFile(staticDeclarationsFilename, staticDeclarationsSource);
}
async function loadFile(protoDir, outDir) {
    var _a;
    let fileInfoList = [];
    let directorys = await fs.readdirSync(protoDir, {
        withFileTypes: true,
    });
    for (let dirent of directorys) {
        const isDirectory = dirent.isDirectory();
        let fileInfo = {
            name: path.parse(dirent.name).name,
            fileName: dirent.name,
            path: {
                inPath: protoDir + "/" + dirent.name,
                outPath: outDir + "/" + dirent.name,
            },
            imports: [],
            package: "",
        };
        if (isDirectory) {
            debugger;
            fileInfo.nested = await loadFile(protoDir, outDir);
        }
        else {
            if (path.extname(dirent.name) != ".proto")
                continue;
            let pathResolved = path.resolve(protoDir + "/" + dirent.name);
            let protobufString = await fs.readFileSync(pathResolved, "utf8");
            if (protobufString) {
                let parsed = protobuf.parse(protobufString);
                fileInfo.package = parsed.package;
                if (parsed) {
                    if (((_a = parsed.imports) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                        for (let impStr of parsed.imports) {
                            if (impStr.startsWith("google")) {
                                fileInfo.imports.push({
                                    fileName: impStr,
                                    protoPath: impStr,
                                    notDetect: true,
                                });
                            }
                            else {
                                let parsePath = path.parse(impStr);
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
        }
        fileInfoList.push(fileInfo);
    }
    return fileInfoList;
}
exports.loadFile = loadFile;
function getFileMap(files) {
    var _a;
    let fileMap = new Map();
    for (let file of files) {
        if (((_a = file.nested) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            let nestedMap = getFileMap(file.nested);
            nestedMap.forEach((value, key) => {
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
    for (let file of files) {
        if (file.nested) {
            updateImports(file.nested, blockMaps);
        }
        else {
            if (((_a = file.imports) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                for (let imp of file.imports) {
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