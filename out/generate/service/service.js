"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewServiceType = exports.Service = void 0;
var path_1 = __importDefault(require("path"));
var protobuf = __importStar(require("protobufjs"));
var ts_poet_1 = require("../../ts-poet");
var case_1 = require("../../utils/case");
var extension_1 = require("../../utils/extension");
var typeReview_1 = require("../types/typeReview");
var typeUtil_1 = require("../types/typeUtil");
var method_1 = require("./method");
var Service = /** @class */ (function () {
    function Service(element, filepath) {
        this.filepath = filepath;
        this.service = this.getService(element);
        var pbName = (0, extension_1.getFileName)(this.filepath.grpcPb);
        if (this.service) {
            this.methods = [];
            for (var _i = 0, _a = Object.entries(this.service.methods); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                if (value instanceof protobuf.Method) {
                    this.methods.push(new method_1.Method(value, pbName));
                }
            }
        }
    }
    Service.prototype.generate = function (importedType) {
        var serviceRelativePath = path_1.default.relative(this.filepath.outPath, this.filepath.grpcPath);
        var globalRelativePath = path_1.default.relative(this.filepath.outPath, this.filepath.globalpath);
        var pbName = (0, extension_1.getFileName)(this.filepath.grpcPb);
        var pbServiceName = (0, extension_1.getFileName)(this.filepath.grpcServicePb);
        var pbClientImport = "import * as ".concat(pbName, " from '").concat(serviceRelativePath, "/").concat(pbName, "';");
        var pbServiceImport = "import * as ".concat(pbServiceName, " from '").concat(serviceRelativePath, "/").concat((0, case_1.capitalizeFirstLetter)(pbServiceName), "';");
        var globalImport = "import * as global from '".concat(globalRelativePath, "'");
        for (var _i = 0, importedType_1 = importedType; _i < importedType_1.length; _i++) {
            var importType = importedType_1[_i];
            if (!importType.filePath || !importType.filePath.outPath)
                continue;
            var importedGrpcPath = path_1.default.relative(importType.filePath.outPath, importType.filePath.grpcPath);
            pbClientImport += "\n\rimport * as ".concat(importType.name, "_pb from '").concat(importedGrpcPath, "/").concat((0, extension_1.getFileName)(importType.filePath.grpcPb), "';");
        }
        if (this.service) {
            var _code = this.generateCode(this.service.name, pbServiceName, pbClientImport, pbServiceImport, globalImport);
            return _code;
        }
        return undefined;
    };
    Service.prototype.getService = function (element) {
        if (element instanceof protobuf.Root) {
            if (element.nested) {
                return this.getService(element.nested);
            }
        }
        else {
            if (typeof element == "object") {
                for (var _i = 0, _a = Object.entries(element); _i < _a.length; _i++) {
                    var _b = _a[_i], key = _b[0], value = _b[1];
                    if (value instanceof protobuf.Service) {
                        return value;
                    }
                    else if (value instanceof protobuf.Namespace) {
                        return this.getService(value["nested"]);
                    }
                }
            }
        }
    };
    Service.prototype.generateCode = function (apiName, pbServiceName, pbClientImport, pbServiceImport, globalImport) {
        return (0, ts_poet_1.code)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  //---------------------------------------------------------------\n  // -----                  Service Section                   -----\n  //---------------------------------------------------------------\n    ", "\n    ", "\n    ", "\n    \n    export class Services {\n              //import section\n              ", "\n              ", "\n          }"], ["\n  //---------------------------------------------------------------\n  // -----                  Service Section                   -----\n  //---------------------------------------------------------------\n    ", "\n    ", "\n    ", "\n    \n    export class Services {\n              //import section\n              ", "\n              ", "\n          }"])), pbClientImport, pbServiceImport, globalImport, this.generateClientCode(apiName, pbServiceName), this.getAllMethodCode());
    };
    Service.prototype.getAllMethodCode = function () {
        if (this.methods.length > 0) {
            return (0, ts_poet_1.joinCode)(this.methods.filter(function (x) { return x.code !== undefined; }).map(function (x) { return x.code; }), { on: "\n" }).toString();
        }
        return "";
    };
    Service.prototype.generateClientCode = function (apiName, pbServiceName) {
        return (0, ts_poet_1.code)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["client = (): ", ".", "Client => {\n          const _client = new ", ".", "Client(\n            global.srvPath(),\n            {}\n          );\n          global.enabledDevMode(_client);\n          return _client;\n        };"], ["client = (): ", ".", "Client => {\n          const _client = new ", ".", "Client(\n            global.srvPath(),\n            {}\n          );\n          global.enabledDevMode(_client);\n          return _client;\n        };"])), pbServiceName, apiName, pbServiceName, apiName);
    };
    Service.prototype.typeReview = function (internalTypes, importedTypes) {
        var _a;
        var typeReview = new typeReview_1.TypeReview();
        if (((_a = this.methods) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            this.methods.forEach(function (method) {
                method.requestType = typeReview.serviceResponseType(method.requestType, internalTypes, importedTypes);
                method.responseType = typeReview.serviceResponseType(method.responseType, internalTypes, importedTypes);
                method.generateCode();
            });
        }
    };
    return Service;
}());
exports.Service = Service;
function reviewServiceType(fileBlocks) {
    fileBlocks === null || fileBlocks === void 0 ? void 0 : fileBlocks.forEach(function (fileBlock) {
        var _a, _b;
        if (((_b = (_a = fileBlock.Service) === null || _a === void 0 ? void 0 : _a.methods) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            var _internalTypes = (0, typeUtil_1.getTypeListByTypes)(fileBlock.typeList);
            fileBlock.Service.typeReview(_internalTypes, fileBlock.importedType);
        }
        else {
            fileBlock.nested = reviewServiceType(fileBlock.nested);
        }
    });
    return fileBlocks;
}
exports.reviewServiceType = reviewServiceType;
var templateObject_1, templateObject_2;
//# sourceMappingURL=service.js.map