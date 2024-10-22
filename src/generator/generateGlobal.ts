import * as writeUtil from "write";

export function GenerateGlobalFiles(
  apiPath: string,
  outDir: string,
  unauthorizedPath: string
) {
  writeGlobalFiles(apiPath, outDir + "/global", unauthorizedPath);
  return outDir + "/global";
}

function generateGrpcCall() {
  return `
  
  import {
    GrpcWebClientBase,
    GrpcWebClientBaseOptions,
    Metadata,
    MethodType,
    MethodDescriptor,
    UnaryInterceptor,
  } from "grpc-web";
  
  export type MethodOptions = {
    ignoreInterceptors?: boolean;
  };
  
  export type GrpcServiceOptions = GrpcWebClientBaseOptions & {
    unaryInterceptors?: ArrayLike<UnaryInterceptor<any, any>>;
    fakeMethods?: boolean;
  };
  export class GrpcService {
    private client: GrpcWebClientBase;
    private metadata: Metadata = {};
    private hostname: string;
    private options: GrpcServiceOptions;
    private interceptingPromise?: Promise<any>;
    public interceptors: { errors: ((e: any) => Promise<any>)[] } = {
      errors: [],
    };
    constructor(hostname: string, options: GrpcServiceOptions = {}) {
      this.options = options;
      this.hostname = hostname;
      this.client = new GrpcWebClientBase(this.options);
    }
    public makeInterceptedUnaryCall = <Result, Params>(
      command: string,
      params: Params,
      methodDescriptor: MethodDescriptor<Params, Result>,
      metadata: Metadata = {},
      options: MethodOptions = {}
    ): Promise<Result> => {
      const unaryCallHandler = (): Promise<Result> =>
        this.client.thenableCall(
          this.hostname + command,
          params,
          metadata,
          methodDescriptor
        );
  
      if (options.ignoreInterceptors) {
        return unaryCallHandler();
      }
  
      if (this.interceptingPromise) {
        return this.interceptingPromise.then(() => {
          this.interceptingPromise = undefined;
          return unaryCallHandler();
        });
      }
  
      return new Promise((resolve, reject) => {
        unaryCallHandler()
          .then(resolve)
          .catch(reject);
      });
    };
    private chainingInterceptors = (
      interceptors: ((e: any) => Promise<any>)[],
      value: any
    ) => {
      this.interceptingPromise = interceptors.reduce(
        (chain, nextInterceptor) => chain.then(nextInterceptor),
        Promise.resolve(value)
      );
      return this.interceptingPromise;
    };
    public setMetadata = (metadata: Metadata = {}) => {
      this.metadata = Object.assign({}, this.metadata, metadata);
    };
    public getMetadata = () => {
      return this.metadata;
    };
  }
  
  `;
}

function generateApiPathCode(apiPath: string) {
  return `
      const developModel = location.hostname === "localhost";
      export function srvPath(): string {
          const hostName = !developModel
              ? location.origin + "/api"
              : "${apiPath}";
          return hostName;
      }
      `;
}
function generateEnabledDevMode() {
  return `
       export function enabledDevMode<T>(client: T): void {
      // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      if (window) {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const enableDevTools = window["__GRPCWEB_DEVTOOLS__"] || (() => {});
        enableDevTools([client]);
      }
    }
  `;
}
function generateMetadata() {
  return `
      export type MetaData = { [key: string]: string } | {};
  // /**
  //  * Merge global metaData with the EUD(End user developer) ones
  //  */
  
  export function mergeMetaData(metaData: MetaData): MetaData {
    const authorization = localStorage.getItem("token");
    if (authorization && authorization?.length > 0) {
      
      return { ...metaData, authorization };
    }
    return metaData;
  }
      `;
}

function generateResponseModel(unauthorizedPath: string) {
  return `
    import * as grpcWeb from "grpc-web";

    function getErrorMessage(errorMessage?: string | undefined) {
      try {
        if (errorMessage) {
          const errorParsed = JSON.parse(errorMessage);
          const description = errorParsed.description;
          if (description && description.indexOf("{") >= 0) {
            const startIndex = description.indexOf("{");
            const jsonString = description.substring(startIndex);
            const error = jsonString && JSON.parse(jsonString);
            return error.description;
          }
          //
          return errorParsed.description;
        }
  
        return errorMessage;
      } catch {
        return errorMessage;
      }
    }

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
          this.errorMessage = getErrorMessage(_errorMessage);
        }
        if (_error) {
          this.error = _error;
        }
        this.code = _code;
        if (_code != undefined && (_code == 16 || _code == 7)) {
          window.location.href = "${unauthorizedPath}";
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
      public static Error<T>(
        exp: grpcWeb.RpcError | string | Error | unknown
      ): ResponseModel<T> {
        if (exp instanceof grpcWeb.RpcError) {
          return new ResponseModel<T>(false, undefined, exp.message, exp.code);
        }
        if (typeof exp == "string") {
          return new ResponseModel<T>(false, undefined, exp, 0);
        }
        if (exp instanceof Error) {
          return new ResponseModel<T>(false, undefined, exp.message, 0);
        }
        return new ResponseModel<T>(false, undefined, "خطا ناشناخته", 0);
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
function generateSendMessage() {
  return `
  type MetaData = { [key: string]: string };
interface MessageType {
  messageName?: "Espad__GRPC_WEB_DEVTOOLS";
  messageType: "grpc";
  type: "request" | "response" | "error";
  id?: string;
  endpoint: string;
  time?: number;
  body?: any; // json
  error?: string; //json
  isSendRequest?: boolean;
  metaData?: MetaData;
}

export function SendMessage(message: MessageType) {
  try {
    if (window) {
      message.time = Date.now();
      message.messageName = "Espad__GRPC_WEB_DEVTOOLS";
      window.postMessage(message, "*");
    }
  } catch (e) {}
}
export const getNewId = () => {
  return Math.random().toString(36).substring(2);
};

  
      `;
}

async function writeGlobalFiles(
  apiPath,
  path: string,
  unauthorizedPath: string
) {
  let apiPathCode = generateApiPathCode(apiPath);
  if (apiPathCode) {
    await writeUtil.sync(path + "/" + "apiPath.ts", apiPathCode, {
      newline: true,
      overwrite: true,
    });
  }
  let responseModel = generateResponseModel(unauthorizedPath);
  if (responseModel) {
    await writeUtil.sync(path + "/" + "responseModel.ts", responseModel, {
      newline: true,
      overwrite: true,
    });
  }
  let enabledDevMode = generateEnabledDevMode();
  if (enabledDevMode) {
    await writeUtil.sync(path + "/" + "enableDevMode.ts", enabledDevMode, {
      newline: true,
      overwrite: true,
    });
  }
  let sendMessage = generateSendMessage();
  if (sendMessage) {
    await writeUtil.sync(path + "/" + "sendMessage.ts", sendMessage, {
      newline: true,
      overwrite: true,
    });
  }
  let metadata = generateMetadata();
  if (metadata) {
    await writeUtil.sync(path + "/" + "metadata.ts", metadata, {
      newline: true,
      overwrite: true,
    });
  }

  let grpcCall = generateGrpcCall();
  if (grpcCall) {
    await writeUtil.sync(path + "/" + "grpc.ts", grpcCall, {
      newline: true,
      overwrite: true,
    });
  }

  await writeUtil.sync(
    path + "/" + "index.ts",
    `
    export { srvPath } from "./apiPath";
    export { enabledDevMode } from "./enableDevMode";
    export { mergeMetaData } from "./metadata";
    export type { MetaData } from "./metadata";
    export { GrpcService , MethodOptions } from "./grpc";
    export { default as ResponseModel } from "./responseModel";
    export { SendMessage, getNewId } from "./sendMessage";
    
    `,
    {
      newline: true,
      overwrite: true,
    }
  );
}
