"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportFiles = void 0;
var path_1 = __importDefault(require("path"));
var ImportFiles = /** @class */ (function () {
    function ImportFiles(elements, pbPath) {
        this.imports = [];
        if (elements.length > 0) {
            for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
                var pathStr = elements_1[_i];
                pathStr = pathStr.replace(".proto", "");
                if (pathStr.startsWith("google")) {
                    if (!this.imports.find(function (x) { return x.name == "google"; })) {
                        var name = pathStr.replace(/[/]/g, "_");
                        this.imports.push({
                            name: name,
                            fileName: undefined,
                            importStr: "import * as ".concat(name, " from 'google-protobuf/").concat(pathStr, "_pb';"),
                        });
                    }
                }
                else {
                    if (pathStr.includes("timestamp")) {
                        debugger;
                    }
                    var importInfo = getFileNameFromRelativePath(pathStr);
                    var fullPath = extendPath(pbPath.path, importInfo.path);
                    var grpcPath = extendPath(pbPath.grpcPath, importInfo.path);
                    var rp1 = getRelativePath(pbPath.path, fullPath);
                    var grpcRp = getRelativePath(pbPath.path, grpcPath);
                    this.imports.push({
                        name: importInfo.fileName,
                        fileName: importInfo.fileName + ".proto",
                        relativePath: rp1,
                        importStr: "import * as ".concat(importInfo.fileName, " from '").concat(rp1, "/").concat(importInfo.fileName, "';"),
                    });
                    this.imports.push({
                        name: importInfo.fileName + "_pb",
                        fileName: importInfo.fileName + "_pb.proto",
                        relativePath: grpcRp,
                        importStr: "import * as ".concat(importInfo.fileName, "_pb from '").concat(grpcRp, "/").concat(importInfo.fileName, "_pb';"),
                        isGrpcPath: true,
                    });
                }
            }
        }
    }
    return ImportFiles;
}());
exports.ImportFiles = ImportFiles;
function getRelativePath(currentPath, importedPath) {
    var relativePath = path_1.default.relative(currentPath, importedPath);
    if (relativePath == "")
        return ".";
    return relativePath;
}
function extendPath(currentPath, relativePath) {
    if (relativePath == "") {
        return currentPath;
    }
    var relativePathSpl = relativePath.split("/");
    var importedPathSpl = currentPath.split("/");
    var currentSectionCount = importedPathSpl.length - 1;
    for (var _i = 0, relativePathSpl_1 = relativePathSpl; _i < relativePathSpl_1.length; _i++) {
        var pathSection = relativePathSpl_1[_i];
        importedPathSpl[currentSectionCount] = pathSection;
        currentSectionCount--;
    }
    return importedPathSpl.join("/");
}
function getFileNameFromRelativePath(relativePath) {
    var splPath = relativePath.split("/");
    var importedName = splPath.splice(splPath.length - 1, 1);
    return {
        fileName: importedName[0],
        path: splPath.join("/"),
    };
}
//# sourceMappingURL=import.js.map