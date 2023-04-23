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
exports.Import = exports.ImportType = void 0;
var fileInfo_1 = require("./fileInfo");
var util_1 = require("./util");
var path = __importStar(require("path"));
var ImportType;
(function (ImportType) {
    ImportType[ImportType["GRPC_PB"] = 0] = "GRPC_PB";
    ImportType[ImportType["GRPC_PB_Imported"] = 1] = "GRPC_PB_Imported";
    ImportType[ImportType["GRPC_SERVICE"] = 2] = "GRPC_SERVICE";
    ImportType[ImportType["TS"] = 3] = "TS";
    ImportType[ImportType["GLOBAL"] = 4] = "GLOBAL";
    ImportType[ImportType["GOOGLE"] = 5] = "GOOGLE";
})(ImportType = exports.ImportType || (exports.ImportType = {}));
var Import = /** @class */ (function () {
    function Import() {
    }
    //account/v2/type.proto
    Import.prototype.setProtoStrImport = function (imp, currentPath) {
        if (imp.length > 0) {
            var parsed = path.parse(imp);
            this.protoPath = imp;
            this.fileName = parsed.name + parsed.ext;
            this.type = ImportType.TS;
            this.name = parsed.name;
            this.file = new fileInfo_1.FileInfo();
            this.file.pathInfo = {
                protobufPath: (0, util_1.combinationPath)(currentPath, imp),
                generatedTypescriptPath: "",
                globalFilePath: "",
                outPath: "",
            };
        }
        return this;
    };
    return Import;
}());
exports.Import = Import;
//# sourceMappingURL=import.js.map