"use strict";
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
        while (_) try {
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
exports.generate = void 0;
var fileUtil_1 = require("../utils/fileUtil");
var validationType_1 = require("../generate/types/validationType");
var toBlock_1 = require("./file/toBlock");
function generate(pbPath, grpcPath, outTsPath) {
    return __awaiter(this, void 0, void 0, function () {
        var fileBlocks, listfileType;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, toBlock_1.fileToBlock(pbPath, grpcPath, outTsPath)];
                case 1:
                    fileBlocks = _a.sent();
                    listfileType = getLisOfType(fileBlocks);
                    fileBlocks = getImportedTypes(fileBlocks, listfileType);
                    fileBlocks = validationType_1.typeCheckAndFix(fileBlocks);
                    debugger;
                    if (fileBlocks.length > 0) {
                        new fileUtil_1.FileUtil().write(fileBlocks);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.generate = generate;
function getImportedTypes(files, allTypes) {
    files.forEach(function (file) {
        if (file.isDirectory) {
            file.nested = getImportedTypes(file.nested, allTypes);
        }
        else {
            file.importedType = [];
            file.imports.forEach(function (imp) {
                var _a;
                var spl = imp.source.split("/");
                var fileName = spl[spl.length - 1];
                var importedTypes = allTypes.filter(function (x) { return x.fileName == fileName; });
                if (importedTypes.length > 0) {
                    importedTypes.forEach(function (item) {
                        item.name = imp.symbol;
                        item.import = imp;
                    });
                    (_a = file.importedType).push.apply(_a, importedTypes);
                }
                //'../common/types_common_v1'
            });
        }
    });
    return files;
}
function getLisOfType(files) {
    var _a;
    var typeList = [];
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        if (file.isDirectory) {
            typeList.push.apply(typeList, getLisOfType(file.nested));
        }
        else {
            if (((_a = file.typeList) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                typeList.push({
                    fileName: file.name,
                    name: "",
                    types: file.typeList,
                    fieldType: [],
                });
            }
        }
    }
    return typeList;
}
//# sourceMappingURL=generate.js.map