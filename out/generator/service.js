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
exports.getIndentSpaces = exports.ServiceGenerator = exports.ServiceMethod = void 0;
var path = __importStar(require("path"));
var protobuf = __importStar(require("protobufjs"));
var ServiceMethod = /** @class */ (function () {
    function ServiceMethod(name, requestType, responseType, serviceName, packageName) {
        this.name = name;
        this.requestType = requestType;
        this.responseType = responseType;
        this.serviceName = serviceName;
        this.packageName = packageName;
    }
    ServiceMethod.prototype.getCode = function () {
        var ret = [];
        var packageName = this.packageName ? this.packageName + "." : "";
        var reqType = packageName + this.requestType;
        if (this.requestType.includes("google")) {
            reqType = this.requestType;
        }
        var resType = packageName + this.responseType;
        if (this.responseType.includes("google")) {
            debugger;
            resType = this.responseType;
        }
        var methodDescriptorPropName = "methodDescriptor_".concat(this.name);
        ret.push("export async function ".concat(this.name, "("), "  model: ".concat(packageName + "I" + this.requestType, ","), "  metaData: global.MetaData", "): Promise<global.ResponseModel<".concat(resType, ">> {"), "  try {");
        if (!this.requestType.includes("google")) {
            ret.push("const ".concat(this.requestType, ": new () => ").concat(reqType, " = ").concat(reqType, ";"));
        }
        if (!this.responseType.includes("google")) {
            ret.push("const ".concat(this.responseType, ": new () => ").concat(resType, " = ").concat(resType, ";"));
        }
        ret.push("  const ".concat(methodDescriptorPropName, " =  new MethodDescriptor<").concat(reqType, ", ").concat(resType, ">("), "  '/".concat(packageName).concat(this.serviceName, "/").concat(this.name, "',"), "  ".concat(this.responseStream ? "'server_streaming'" : "MethodType.UNARY", ","), "  ".concat(this.requestType, ","), "  ".concat(this.responseType, ","), "  (req: ".concat(reqType, ") => ").concat(reqType, ".encode(req).finish(),"), "  ".concat(resType, ".decode,"), ");");
        ret.push("const response = await grpc.makeInterceptedUnaryCall('/".concat(packageName).concat(this.serviceName, "/").concat(this.name, "', model, ").concat(methodDescriptorPropName, ", metaData);"));
        ret.push("    return global.ResponseModel.Data(response);", "  } catch (exp) {", "    return global.ResponseModel.Error(exp);", "  }", "}");
        return ret.join("\n".concat(getIndentSpaces(3)));
    };
    return ServiceMethod;
}());
exports.ServiceMethod = ServiceMethod;
var ServiceGenerator = /** @class */ (function () {
    function ServiceGenerator(root, outDir, globalDir, needGoogleImport, finalFileName) {
        var _a, _b, _c;
        //outDir:./sample/proto/admin_service_v1.proto
        this.methods = [];
        this.nameSpace = [];
        var outParse = path.parse(outDir);
        this.needGoogleImport = needGoogleImport;
        this.globalPath = path.relative(outParse.dir, globalDir);
        if (!this.globalPath.startsWith("."))
            this.globalPath = "./" + this.globalPath;
        this.fileName = outParse.name;
        this.finalFileName = finalFileName;
        var serviceInfo = this.getService(root.nested);
        var packageName = "";
        if (((_a = serviceInfo === null || serviceInfo === void 0 ? void 0 : serviceInfo.nameSpace) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            this.nameSpace = serviceInfo.nameSpace;
            packageName = serviceInfo.nameSpace.join(".");
        }
        if (serviceInfo && ((_b = serviceInfo.service) === null || _b === void 0 ? void 0 : _b.methods)) {
            var obj = mapServiceMethods((_c = serviceInfo.service) === null || _c === void 0 ? void 0 : _c.methods);
            for (var _i = 0, obj_1 = obj; _i < obj_1.length; _i++) {
                var method = obj_1[_i];
                var newMethod = new ServiceMethod(method.name, method.requestType, method.responseType, serviceInfo.service.name, packageName);
                this.methods.push(newMethod);
            }
        }
    }
    ServiceGenerator.prototype.getCode = function () {
        var codes = [];
        codes.push("import { MethodType, MethodDescriptor } from \"grpc-web\";", "import * as global from \"".concat(this.globalPath, "\""));
        if (this.finalFileName) {
            codes.push("import { ".concat(this.finalFileName, " ").concat(this.needGoogleImport ? ", google " : "", " } from \"./").concat(this.finalFileName, "\""));
        }
        // if (this.nameSpace.length > 0) {
        //   codes.push(
        //     `import { ${this.nameSpace[0]} ${
        //       this.needGoogleImport ? ", google " : ""
        //     } } from "./${this.fileName}"`
        //   );
        // }
        codes.push("const grpc = new global.GrpcService(global.srvPath());");
        codes.push.apply(codes, this.methods.map(function (x) { return x.getCode(); }));
        return codes.join("\n".concat(getIndentSpaces(1)));
    };
    ServiceGenerator.prototype.getService = function (element, nameSpace) {
        if (!nameSpace)
            nameSpace = [];
        if (typeof element == "object") {
            for (var _i = 0, _a = Object.entries(element); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                if (value instanceof protobuf.Service) {
                    return {
                        service: value,
                        nameSpace: nameSpace,
                    };
                }
                else if (value instanceof protobuf.Namespace) {
                    if (value.nested) {
                        nameSpace.push(value.name);
                        return this.getService(value.nested, nameSpace);
                    }
                }
            }
        }
    };
    return ServiceGenerator;
}());
exports.ServiceGenerator = ServiceGenerator;
//----- util
function mapServiceMethods(methods) {
    return getObjectKeys(methods)
        .map(function (method) { return ({
        name: String(method),
        requestType: methods[method].requestType,
        responseType: methods[method].responseType,
        requestStream: methods[method].requestStream,
        responseStream: methods[method].responseStream,
    }); })
        .sort(function (a, b) { return strcmp(a.name, b.name); });
}
function getObjectKeys(target) {
    return Object.keys(target);
}
function strcmp(a, b) {
    if (a < b) {
        return -1;
    }
    else if (a > b) {
        return 1;
    }
    else {
        return 0;
    }
}
function getIndentSpaces(level) {
    if (level === void 0) { level = 0; }
    return new Array(2 * level).fill(" ").join("");
}
exports.getIndentSpaces = getIndentSpaces;
//# sourceMappingURL=service.js.map