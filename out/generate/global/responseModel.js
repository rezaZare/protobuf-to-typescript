"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResponseModel = void 0;
var ts_poet_1 = require("ts-poet");
function generateResponseModel() {
    return (0, ts_poet_1.code)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  import * as grpcWeb from \"grpc-web\";\n  class ResponseModel<T> {\n    constructor(\n      _status: boolean,\n      _data?: T,\n      _errorMessage?: string,\n      _code?: number,\n      _error?: ErrorModel\n    ) {\n      this.status = _status;\n      if (_status) {\n        this.data = _data;\n      } else {\n        this.errorMessage = _errorMessage;\n      }\n      if (_error) {\n        this.error = _error;\n      }\n      this.code = _code;\n      if (_code != undefined && _code == 16) {\n        window.location.href = \"/login\";\n      }\n    }\n    public data?: T;\n    public status: boolean;\n    public errorMessage?: string;\n    public code?: number;\n    public status_code: number;\n    public error: ErrorModel;\n    public static Data<T>(data: T): ResponseModel<T> {\n      return new ResponseModel(true, data);\n    }\n    public static Error<T>(exp: grpcWeb.RpcError): ResponseModel<T> {\n      return new ResponseModel<T>(false, undefined, exp.message, exp.code);\n    }\n    public static InvalidRequestModel<T>(): ResponseModel<T> {\n      return new ResponseModel<T>(\n        false,\n        undefined,\n        \"\u062F\u0627\u062F\u0647\u200C\u0647\u0627\u06CC \u0627\u0631\u0633\u0627\u0644\u06CC \u0635\u062D\u06CC\u062D \u0646\u0645\u06CC\u200C\u0628\u0627\u0634\u062F\"\n      );\n    }\n    public static ToResponModel<T>(\n      error: grpcWeb.RpcError,\n      data: T\n    ): ResponseModel<T> {\n      if (error) {\n        return new ResponseModel<T>(false, undefined, error.message, error.code, {\n          code: error.code,\n          message: error.message,\n          details: {\n            code: error.code,\n            errorStack: error.stack,\n            message: error.message,\n            type: \"\",\n          },\n        });\n      } else {\n        return new ResponseModel<T>(true, data);\n      }\n    }\n  }\n  export interface ErrorDetail {\n    type: string;\n    code: number;\n    message: string;\n    errorStack?: string;\n  }\n  export interface ErrorModel {\n    code: number;\n    message: string;\n    details: ErrorDetail;\n  }\n  export default ResponseModel;  \n"], ["\n  import * as grpcWeb from \"grpc-web\";\n  class ResponseModel<T> {\n    constructor(\n      _status: boolean,\n      _data?: T,\n      _errorMessage?: string,\n      _code?: number,\n      _error?: ErrorModel\n    ) {\n      this.status = _status;\n      if (_status) {\n        this.data = _data;\n      } else {\n        this.errorMessage = _errorMessage;\n      }\n      if (_error) {\n        this.error = _error;\n      }\n      this.code = _code;\n      if (_code != undefined && _code == 16) {\n        window.location.href = \"/login\";\n      }\n    }\n    public data?: T;\n    public status: boolean;\n    public errorMessage?: string;\n    public code?: number;\n    public status_code: number;\n    public error: ErrorModel;\n    public static Data<T>(data: T): ResponseModel<T> {\n      return new ResponseModel(true, data);\n    }\n    public static Error<T>(exp: grpcWeb.RpcError): ResponseModel<T> {\n      return new ResponseModel<T>(false, undefined, exp.message, exp.code);\n    }\n    public static InvalidRequestModel<T>(): ResponseModel<T> {\n      return new ResponseModel<T>(\n        false,\n        undefined,\n        \"\u062F\u0627\u062F\u0647\u200C\u0647\u0627\u06CC \u0627\u0631\u0633\u0627\u0644\u06CC \u0635\u062D\u06CC\u062D \u0646\u0645\u06CC\u200C\u0628\u0627\u0634\u062F\"\n      );\n    }\n    public static ToResponModel<T>(\n      error: grpcWeb.RpcError,\n      data: T\n    ): ResponseModel<T> {\n      if (error) {\n        return new ResponseModel<T>(false, undefined, error.message, error.code, {\n          code: error.code,\n          message: error.message,\n          details: {\n            code: error.code,\n            errorStack: error.stack,\n            message: error.message,\n            type: \"\",\n          },\n        });\n      } else {\n        return new ResponseModel<T>(true, data);\n      }\n    }\n  }\n  export interface ErrorDetail {\n    type: string;\n    code: number;\n    message: string;\n    errorStack?: string;\n  }\n  export interface ErrorModel {\n    code: number;\n    message: string;\n    details: ErrorDetail;\n  }\n  export default ResponseModel;  \n"])));
}
exports.generateResponseModel = generateResponseModel;
var templateObject_1;
//# sourceMappingURL=responseModel.js.map