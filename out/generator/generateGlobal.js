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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateGlobalFiles = void 0;
var writeUtil = __importStar(require("write"));
function GenerateGlobalFiles(apiPath, outDir) {
    writeGlobalFiles(apiPath, outDir + "/global");
    return outDir + "/global";
}
exports.GenerateGlobalFiles = GenerateGlobalFiles;
function generateGrpcCall() {
    return "\n  \n  import {\n    GrpcWebClientBase,\n    GrpcWebClientBaseOptions,\n    Metadata,\n    MethodType,\n    MethodDescriptor,\n    UnaryInterceptor,\n  } from \"grpc-web\";\n\n  export type MethodOptions = {\n    ignoreInterceptors?: boolean;\n  };\n  \n  export type GrpcServiceOptions = GrpcWebClientBaseOptions & {\n    unaryInterceptors?: ArrayLike<UnaryInterceptor<any, any>>;\n    fakeMethods?: boolean;\n  };\n  export class GrpcService {\n    private client: GrpcWebClientBase;\n    private metadata: Metadata = {};\n    private hostname: string;\n    private options: GrpcServiceOptions;\n    private interceptingPromise?: Promise<any>;\n    public interceptors: { errors: ((e: any) => Promise<any>)[] } = {\n      errors: [],\n    };\n    constructor(hostname: string, options: GrpcServiceOptions = {}) {\n      this.options = options;\n      this.hostname = hostname;\n      this.client = new GrpcWebClientBase(this.options);\n    }\n    public makeInterceptedUnaryCall = <Result, Params>(\n      command: string,\n      params: Params,\n      methodDescriptor: MethodDescriptor<Params, Result>,\n      options: MethodOptions = {}\n    ): Promise<Result> => {\n      const unaryCallHandler = (): Promise<Result> =>\n        this.client.thenableCall(\n          this.hostname + command,\n          params,\n          this.metadata,\n          methodDescriptor\n        );\n  \n      if (options.ignoreInterceptors) {\n        return unaryCallHandler();\n      }\n  \n      if (this.interceptingPromise) {\n        return this.interceptingPromise.then(() => {\n          this.interceptingPromise = undefined;\n          return unaryCallHandler();\n        });\n      }\n  \n      return new Promise((resolve, reject) => {\n        unaryCallHandler()\n          .then(resolve)\n          .catch((e) => {\n            this.chainingInterceptors(this.interceptors.errors, e)\n              .then(() => {\n                this.makeInterceptedUnaryCall<Result, Params>(\n                  command,\n                  params,\n                  methodDescriptor\n                )\n                  .then(resolve)\n                  .catch(reject);\n              })\n              .catch(reject);\n          });\n      });\n    };\n    private chainingInterceptors = (\n      interceptors: ((e: any) => Promise<any>)[],\n      value: any\n    ) => {\n      this.interceptingPromise = interceptors.reduce(\n        (chain, nextInterceptor) => chain.then(nextInterceptor),\n        Promise.resolve(value)\n      );\n      return this.interceptingPromise;\n    };\n    public setMetadata = (metadata: Metadata = {}) => {\n      this.metadata = Object.assign({}, this.metadata, metadata);\n    };\n    public getMetadata = () => {\n      return this.metadata;\n    };\n  }\n  ";
}
function generateApiPathCode(apiPath) {
    return "\n      const developModel = location.hostname === \"localhost\";\n      export function srvPath(): string {\n          const hostName = !developModel\n              ? location.origin + \"/api\"\n              : \"".concat(apiPath, "\";\n          return hostName;\n      }\n      ");
}
function generateEnabledDevMode() {
    return "\n       export function enabledDevMode<T>(client: T): void {\n      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types\n      if (window) {\n        // eslint-disable-next-line @typescript-eslint/no-empty-function\n        const enableDevTools = window[\"__GRPCWEB_DEVTOOLS__\"] || (() => {});\n        enableDevTools([client]);\n      }\n    }\n  ";
}
function generateMetadata() {
    return "\n      export type MetaData = { [key: string]: string } | {};\n  // /**\n  //  * Merge global metaData with the EUD(End user developer) ones\n  //  */\n  \n  export function mergeMetaData(metaData: MetaData): MetaData {\n    const authorization = localStorage.getItem(\"token\");\n    if (authorization && authorization?.length > 0) {\n      console.log(\"token\", { ...metaData, authorization });\n      return { ...metaData, authorization };\n    }\n    return metaData;\n  }\n      ";
}
function generateResponseModel() {
    return "\n    import * as grpcWeb from \"grpc-web\";\n    class ResponseModel<T> {\n      constructor(\n        _status: boolean,\n        _data?: T,\n        _errorMessage?: string,\n        _code?: number,\n        _error?: ErrorModel\n      ) {\n        this.status = _status;\n        if (_status) {\n          this.data = _data;\n        } else {\n          this.errorMessage = _errorMessage;\n        }\n        if (_error) {\n          this.error = _error;\n        }\n        this.code = _code;\n        if (_code != undefined && _code == 16) {\n          window.location.href = \"/login\";\n        }\n      }\n      public data?: T;\n      public status: boolean;\n      public errorMessage?: string;\n      public code?: number;\n      public status_code: number;\n      public error: ErrorModel;\n      public static Data<T>(data: T): ResponseModel<T> {\n        return new ResponseModel(true, data);\n      }\n      public static Error<T>(\n        exp: grpcWeb.RpcError | string | Error | unknown\n      ): ResponseModel<T> {\n        if (exp instanceof grpcWeb.RpcError) {\n          return new ResponseModel<T>(false, undefined, exp.message, exp.code);\n        }\n        if (typeof exp == \"string\") {\n          return new ResponseModel<T>(false, undefined, exp, 0);\n        }\n        if (exp instanceof Error) {\n          return new ResponseModel<T>(false, undefined, exp.message, 0);\n        }\n        return new ResponseModel<T>(false, undefined, \"\u062E\u0637\u0627 \u0646\u0627\u0634\u0646\u0627\u062E\u062A\u0647\", 0);\n      }\n      public static InvalidRequestModel<T>(): ResponseModel<T> {\n        return new ResponseModel<T>(\n          false,\n          undefined,\n          \"\u062F\u0627\u062F\u0647\u200C\u0647\u0627\u06CC \u0627\u0631\u0633\u0627\u0644\u06CC \u0635\u062D\u06CC\u062D \u0646\u0645\u06CC\u200C\u0628\u0627\u0634\u062F\"\n        );\n      }\n      public static ToResponModel<T>(\n        error: grpcWeb.RpcError,\n        data: T\n      ): ResponseModel<T> {\n        if (error) {\n          return new ResponseModel<T>(false, undefined, error.message, error.code, {\n            code: error.code,\n            message: error.message,\n            details: {\n              code: error.code,\n              errorStack: error.stack,\n              message: error.message,\n              type: \"\",\n            },\n          });\n        } else {\n          return new ResponseModel<T>(true, data);\n        }\n      }\n    }\n    export interface ErrorDetail {\n      type: string;\n      code: number;\n      message: string;\n      errorStack?: string;\n    }\n    export interface ErrorModel {\n      code: number;\n      message: string;\n      details: ErrorDetail;\n    }\n    export default ResponseModel;  \n  ";
}
function generateToProto() {
    return "\n    export function toProto(reqType, resType, model) {\n        return reqType.deserializeBinary(resType.encode(model).finish());\n      }\n      ";
}
function writeGlobalFiles(apiPath, path) {
    return __awaiter(this, void 0, void 0, function () {
        var apiPathCode, responseModel, enabledDevMode, metadata, grpcCall;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    apiPathCode = generateApiPathCode(apiPath);
                    if (!apiPathCode) return [3 /*break*/, 2];
                    return [4 /*yield*/, writeUtil.sync(path + "/" + "apiPath.ts", apiPathCode, {
                            newline: true,
                            overwrite: true,
                        })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    responseModel = generateResponseModel();
                    if (!responseModel) return [3 /*break*/, 4];
                    return [4 /*yield*/, writeUtil.sync(path + "/" + "responseModel.ts", responseModel, {
                            newline: true,
                            overwrite: true,
                        })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    enabledDevMode = generateEnabledDevMode();
                    if (!enabledDevMode) return [3 /*break*/, 6];
                    return [4 /*yield*/, writeUtil.sync(path + "/" + "enableDevMode.ts", enabledDevMode, {
                            newline: true,
                            overwrite: true,
                        })];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    metadata = generateMetadata();
                    if (!metadata) return [3 /*break*/, 8];
                    return [4 /*yield*/, writeUtil.sync(path + "/" + "metadata.ts", metadata, {
                            newline: true,
                            overwrite: true,
                        })];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8:
                    grpcCall = generateGrpcCall();
                    if (!grpcCall) return [3 /*break*/, 10];
                    return [4 /*yield*/, writeUtil.sync(path + "/" + "grpc.ts", grpcCall, {
                            newline: true,
                            overwrite: true,
                        })];
                case 9:
                    _a.sent();
                    _a.label = 10;
                case 10: return [4 /*yield*/, writeUtil.sync(path + "/" + "index.ts", "\n    export { srvPath } from \"./apiPath\";\n    export { enabledDevMode } from \"./enableDevMode\";\n    export { mergeMetaData } from \"./metadata\";\n    export type { MetaData } from \"./metadata\";\n    export { GrpcService , MethodOptions } from \"./grpc\";\n    export { default as ResponseModel } from \"./responseModel\";\n    ", {
                        newline: true,
                        overwrite: true,
                    })];
                case 11:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=generateGlobal.js.map