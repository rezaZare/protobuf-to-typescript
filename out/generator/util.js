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
Object.defineProperty(exports, "__esModule", { value: true });
exports.combinationPath = exports.getRelativePath = exports.getNameWithoutExtension = exports.getName = void 0;
var path = __importStar(require("path"));
function getName(str) {
    return str.replace(/^.*[\\\/]/, "");
}
exports.getName = getName;
function getNameWithoutExtension(str) {
    return getName(str).replace(".proto", "");
}
exports.getNameWithoutExtension = getNameWithoutExtension;
function getRelativePath(currentPath, destPath) {
    var currentParse = path.parse(currentPath);
    var DestParse = path.parse(destPath);
    var relPath = path.relative(currentParse.dir, DestParse.dir);
    if (relPath === "") {
        relPath = "./" + DestParse.base;
    }
    else {
        relPath = relPath + "/" + DestParse.base;
    }
    var name = DestParse.name;
    var fileName = DestParse.base;
    return {
        path: relPath,
        name: name,
        fileName: fileName,
    };
}
exports.getRelativePath = getRelativePath;
function combinationPath(currentPath, desPath) {
    var dest = desPath.split("/");
    var joined = path.join(currentPath, "../".repeat(dest.length) + desPath);
    return "./" + joined;
}
exports.combinationPath = combinationPath;
//# sourceMappingURL=util.js.map