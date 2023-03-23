import { code } from "ts-poet";

export function generateResponseModel() {
  return code`
  import * as grpcWeb from "grpc-web";
  class ResponseModel<T> {
    constructor(
      _status: boolean,
      _data?: T,
      _errorMessage?: string,
      _code?: number,
      _error?: ErrorModel
    ) {
      this.status = _status;
      if (_status) {
        this.data = _data;
      } else {
        this.errorMessage = _errorMessage;
      }
      if (_error) {
        this.error = _error;
      }
      this.code = _code;
      if (_code != undefined && _code == 16) {
        window.location.href = "/login";
      }
    }
    public data?: T;
    public status: boolean;
    public errorMessage?: string;
    public code?: number;
    public status_code: number;
    public error: ErrorModel;
    public static Data<T>(data: T): ResponseModel<T> {
      return new ResponseModel(true, data);
    }
    public static Error<T>(exp: grpcWeb.RpcError): ResponseModel<T> {
      return new ResponseModel<T>(false, undefined, exp.message, exp.code);
    }
    public static InvalidRequestModel<T>(): ResponseModel<T> {
      return new ResponseModel<T>(
        false,
        undefined,
        "داده‌های ارسالی صحیح نمی‌باشد"
      );
    }
    public static ToResponModel<T>(
      error: grpcWeb.RpcError,
      data: T
    ): ResponseModel<T> {
      if (error) {
        return new ResponseModel<T>(false, undefined, error.message, error.code, {
          code: error.code,
          message: error.message,
          details: {
            code: error.code,
            errorStack: error.stack,
            message: error.message,
            type: "",
          },
        });
      } else {
        return new ResponseModel<T>(true, data);
      }
    }
  }
  export interface ErrorDetail {
    type: string;
    code: number;
    message: string;
    errorStack?: string;
  }
  export interface ErrorModel {
    code: number;
    message: string;
    details: ErrorDetail;
  }
  export default ResponseModel;  
`;
}
