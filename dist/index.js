var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  generateIndex: () => generateIndex2,
  protoToTs: () => protoToTs
});
module.exports = __toCommonJS(src_exports);

// src/generator/index.ts
var fs2 = __toESM(require("fs"));
var path3 = __toESM(require("path"));
var protobuf2 = __toESM(require("protobufjs"));
var import_fs2 = require("fs");

// src/generator/protobuf.ts
var protobufjs = __toESM(require("protobufjs/minimal"));
var protobufjsCli = __toESM(require("protobufjs-cli"));
function generateStaticObjects(protoFiles) {
  return new Promise((resolve3, reject) => {
    protobufjsCli.pbjs.main(
      [
        "--target",
        "static-module",
        "--wrap",
        "commonjs",
        "--sparse",
        "--no-create",
        "--no-verify",
        "--no-convert",
        "--no-service",
        ...protoFiles
      ],
      (error, output) => {
        if (error || !output) {
          reject(error || new Error("Empty output"));
          return;
        }
        resolve3(output);
      }
    );
  });
}
function generateStaticDeclarations(staticObjectsFile) {
  return new Promise((resolve3, reject) => {
    protobufjsCli.pbts.main([staticObjectsFile], (error, output) => {
      if (error || !output) {
        reject(error || new Error("Empty output"));
        return;
      }
      resolve3(output);
    });
  });
}

// src/generator/generate.ts
var path2 = __toESM(require("path"));
var import_fs = require("fs");
var $protobuf = __toESM(require("protobufjs"));

// src/generator/service.ts
var path = __toESM(require("path"));
var protobuf = __toESM(require("protobufjs"));
var ServiceMethod = class {
  constructor(name, requestType, responseType, serviceName, packageName) {
    this.name = name;
    this.requestType = requestType;
    this.responseType = responseType;
    this.serviceName = serviceName;
    this.packageName = packageName;
  }
  getCode() {
    const ret = [];
    let packageName = this.packageName ? this.packageName + "." : "";
    let reqType = packageName + this.requestType;
    if (this.requestType.includes("google")) {
      reqType = this.requestType;
    }
    let resType = packageName + this.responseType;
    if (this.responseType.includes("google")) {
      resType = this.responseType;
    }
    let modelType = "";
    if (this.requestType.includes("google")) {
      modelType = this.requestType;
    } else {
      modelType = packageName + "I" + this.requestType;
    }
    const methodDescriptorPropName = `methodDescriptor_${this.name}`;
    ret.push(
      `export async function ${this.name}(`,
      `  model: ${modelType},`,
      `  metaData: global.MetaData,`,
      `  cacheable?: boolean`,
      `): Promise<global.ResponseModel<${resType}>> {`,
      `if (cacheable) {`,
      `   const data = await getApi<${modelType},${resType}>('/${packageName}${this.serviceName}/${this.name}', model);`,
      `   if (data) return global.ResponseModel.Data(data.response);`,
      `}`,
      `const id = global.getNewId();`,
      `global.SendMessage({
        endpoint: '/${packageName}${this.serviceName}/${this.name}',
        id: id,
        messageType: "grpc",
        type: "request",
        body: model,
        metaData: metaData,
      });`,
      `  try {`
    );
    if (!this.requestType.includes("google")) {
      ret.push(`const ${this.requestType}: new () => ${reqType} = ${reqType};`);
    }
    if (!this.responseType.includes("google")) {
      ret.push(
        `const ${this.responseType}: new () => ${resType} = ${resType};`
      );
    }
    ret.push(
      `  const ${methodDescriptorPropName} =  new MethodDescriptor<${reqType}, ${resType}>(`,
      `  '/${packageName}${this.serviceName}/${this.name}',`,
      `  ${this.responseStream ? `'server_streaming'` : `MethodType.UNARY`},`,
      `  ${this.requestType},`,
      `  ${this.responseType},`,
      `  (req: ${reqType}) => ${reqType}.encode(req).finish(),`,
      `  ${resType}.decode,`,
      `);`
    );
    ret.push(`global.SendMessage({
      endpoint: '/${packageName}${this.serviceName}/${this.name}',
      id: id,
      messageType: "grpc",
      type: "request",
      body: model,
      metaData: metaData,
      isSendRequest: true,
    });`);
    ret.push(
      `const response = await grpc.makeInterceptedUnaryCall('/${packageName}${this.serviceName}/${this.name}', model, ${methodDescriptorPropName}, global.mergeMetaData(metaData));`
    );
    ret.push(`global.SendMessage({
      endpoint: '/${packageName}${this.serviceName}/${this.name}',
      id: id,
      messageType: "grpc",
      type: "response",
      body: response,
      metaData: metaData,
      isSendRequest: true,
    });`);
    ret.push(`
    if (cacheable)
      await setApi<${modelType},${resType}>('/${packageName}${this.serviceName}/${this.name}', model, response);
    `);
    ret.push(
      `    return global.ResponseModel.Data(response);`,
      `  } catch (exp) {`,
      `global.SendMessage({
        endpoint: '/${packageName}${this.serviceName}/${this.name}',
        id: id,
        messageType: "grpc",
        type: "error",
        body: exp,
        metaData: metaData,
        isSendRequest: true,
      });`,
      `    return global.ResponseModel.Error(exp);`,
      `  }`,
      `}`
    );
    return ret.join(`
${getIndentSpaces(3)}`);
  }
};
var ServiceGenerator = class {
  constructor(root, outDir, globalDir, needGoogleImport, finalFileName) {
    //outDir:./sample/proto/admin_service_v1.proto
    this.methods = [];
    this.nameSpace = [];
    var _a, _b, _c;
    let outParse = path.parse(outDir);
    this.needGoogleImport = needGoogleImport;
    this.globalPath = path.relative(outParse.dir, globalDir);
    if (!this.globalPath.startsWith("."))
      this.globalPath = "./" + this.globalPath;
    this.fileName = outParse.name;
    this.finalFileName = finalFileName;
    let serviceInfo = this.getService(root.nested);
    let packageName = "";
    if (((_a = serviceInfo == null ? void 0 : serviceInfo.nameSpace) == null ? void 0 : _a.length) > 0) {
      this.nameSpace = serviceInfo.nameSpace;
      packageName = serviceInfo.nameSpace.join(".");
    }
    if (serviceInfo && ((_b = serviceInfo.service) == null ? void 0 : _b.methods)) {
      let obj = mapServiceMethods((_c = serviceInfo.service) == null ? void 0 : _c.methods);
      for (let method of obj) {
        let newMethod = new ServiceMethod(
          method.name,
          method.requestType,
          method.responseType,
          serviceInfo.service.name,
          packageName
        );
        this.methods.push(newMethod);
      }
    }
  }
  getCode() {
    let codes = [];
    codes.push(
      `import { MethodType, MethodDescriptor } from "grpc-web";`,
      `import * as global from "${this.globalPath}";`,
      `import { getApi, setApi } from "@espad/cache";`
    );
    if (this.finalFileName) {
      codes.push(
        `import { ${this.finalFileName} ${this.needGoogleImport ? ", google " : ""} } from "./${this.finalFileName}"`
      );
    }
    codes.push(`const grpc = new global.GrpcService(global.srvPath());`);
    codes.push(...this.methods.map((x) => x.getCode()));
    return codes.join(`
${getIndentSpaces(1)}`);
  }
  getService(element, nameSpace) {
    if (!nameSpace)
      nameSpace = [];
    if (typeof element == "object") {
      for (const [key, value] of Object.entries(element)) {
        if (value instanceof protobuf.Service) {
          return {
            service: value,
            nameSpace
          };
        } else if (value instanceof protobuf.Namespace) {
          if (value.nested) {
            nameSpace.push(value.name);
            return this.getService(value.nested, nameSpace);
          }
        }
      }
    }
  }
};
function mapServiceMethods(methods) {
  return getObjectKeys(methods).map((method) => ({
    name: String(method),
    requestType: methods[method].requestType,
    responseType: methods[method].responseType,
    requestStream: methods[method].requestStream,
    responseStream: methods[method].responseStream
  })).sort((a, b) => strcmp(a.name, b.name));
}
function getObjectKeys(target) {
  return Object.keys(target);
}
function strcmp(a, b) {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else {
    return 0;
  }
}
function getIndentSpaces(level = 0) {
  return new Array(2 * level).fill(" ").join("");
}

// src/generator/generate.ts
async function generate(protoFile, outputDir, importedPath, globalDir, needGoogleImport, finalFileName) {
  try {
    let outParse = path2.parse(outputDir);
    const packageDefinition = await $protobuf.loadSync(protoFile);
    const codegenDirectory = path2.resolve(outParse.dir);
    await import_fs.promises.mkdir(codegenDirectory, { recursive: true });
    const serviceGenerator = new ServiceGenerator(
      packageDefinition,
      outputDir,
      globalDir,
      needGoogleImport,
      finalFileName
    ).getCode();
    const staticGrpcFilename = path2.resolve(
      outParse.dir,
      `${outParse.name}_grpc.ts`
    );
    await import_fs.promises.writeFile(staticGrpcFilename, serviceGenerator);
  } catch (error) {
    console.error("grpcw-service-generator [error]:", error);
    process.exit(1);
  }
}
async function generateAllinOneFile(protoFiles, outputDir, name) {
  try {
    let outParse = path2.parse(outputDir + "/" + name + ".js");
    const codegenDirectory = path2.resolve(outParse.dir);
    await import_fs.promises.mkdir(codegenDirectory, { recursive: true });
    const staticObjectsSource = await generateStaticObjects(
      protoFiles
    );
    const staticObjectsFilename = path2.resolve(
      outParse.dir,
      `${outParse.name}.js`
    );
    await import_fs.promises.writeFile(staticObjectsFilename, staticObjectsSource);
    const staticDeclarationsSource = await generateStaticDeclarations(
      staticObjectsFilename
    );
    const staticDeclarationsFilename = path2.resolve(
      outParse.dir,
      `${outParse.name}.d.ts`
    );
    await import_fs.promises.writeFile(staticDeclarationsFilename, staticDeclarationsSource);
  } catch (error) {
    console.error("grpcw-service-generator [error]:", error);
    process.exit(1);
  }
}
async function generateIndex(name, outDir, files) {
  var _a;
  let codes = [];
  let codeExportVariable = [];
  codes.push(`export * from "./${name}";`);
  codes.push(`export * from "./global";`);
  for (let file of files) {
    let importName = "";
    let packageSpl = (_a = file == null ? void 0 : file.package) == null ? void 0 : _a.split(".");
    if ((packageSpl == null ? void 0 : packageSpl.length) > 0) {
      importName = packageSpl[0];
    }
    codes.push(`import * as ${file.name}_grpc from "./${file.name}_grpc";`);
    codeExportVariable.push(`${file.name}:${file.name}_grpc ,`);
  }
  let exportCode = `
  export const ${name}Services = {
      ${codeExportVariable.join(`
`)}
  }
  `;
  let sourceCode = codes.join(`
`) + "\n" + exportCode;
  await import_fs.promises.writeFile(outDir + "/index.ts", sourceCode);
}

// src/generator/generateGlobal.ts
var writeUtil = __toESM(require("write"));
function GenerateGlobalFiles(apiPath, outDir, unauthorizedPath) {
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
function generateApiPathCode(apiPath) {
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
function generateResponseModel(unauthorizedPath) {
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
        return new ResponseModel<T>(false, undefined, "\u062E\u0637\u0627 \u0646\u0627\u0634\u0646\u0627\u062E\u062A\u0647", 0);
      }
      public static InvalidRequestModel<T>(): ResponseModel<T> {
        return new ResponseModel<T>(
          false,
          undefined,
          "\u062F\u0627\u062F\u0647\u200C\u0647\u0627\u06CC \u0627\u0631\u0633\u0627\u0644\u06CC \u0635\u062D\u06CC\u062D \u0646\u0645\u06CC\u200C\u0628\u0627\u0634\u062F"
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
async function writeGlobalFiles(apiPath, path5, unauthorizedPath) {
  let apiPathCode = generateApiPathCode(apiPath);
  if (apiPathCode) {
    await writeUtil.sync(path5 + "/apiPath.ts", apiPathCode, {
      newline: true,
      overwrite: true
    });
  }
  let responseModel = generateResponseModel(unauthorizedPath);
  if (responseModel) {
    await writeUtil.sync(path5 + "/responseModel.ts", responseModel, {
      newline: true,
      overwrite: true
    });
  }
  let enabledDevMode = generateEnabledDevMode();
  if (enabledDevMode) {
    await writeUtil.sync(path5 + "/enableDevMode.ts", enabledDevMode, {
      newline: true,
      overwrite: true
    });
  }
  let sendMessage = generateSendMessage();
  if (sendMessage) {
    await writeUtil.sync(path5 + "/sendMessage.ts", sendMessage, {
      newline: true,
      overwrite: true
    });
  }
  let metadata = generateMetadata();
  if (metadata) {
    await writeUtil.sync(path5 + "/metadata.ts", metadata, {
      newline: true,
      overwrite: true
    });
  }
  let grpcCall = generateGrpcCall();
  if (grpcCall) {
    await writeUtil.sync(path5 + "/grpc.ts", grpcCall, {
      newline: true,
      overwrite: true
    });
  }
  await writeUtil.sync(
    path5 + "/index.ts",
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
      overwrite: true
    }
  );
}

// src/generator/index.ts
async function protoToTs(name, protoDir, outDir, endPoint, unauthorizedPath) {
  var _a;
  let files = await loadFile(protoDir, outDir);
  let fielMap = getFileMap(files);
  files = updateImports(files, fielMap);
  await generateAllinOneFile(getAllProtoPath(files), outDir, name);
  let globalDir = GenerateGlobalFiles(endPoint, outDir, unauthorizedPath);
  if (files.length > 0) {
    for (let file of files) {
      let importedPath;
      let needGoogleImport = false;
      if (((_a = file.imports) == null ? void 0 : _a.length) > 0) {
        importedPath = file.imports.map(function(x) {
          if (x.notDetect) {
            needGoogleImport = true;
            return x.protoPath;
          } else
            return x.path.inPath;
        });
      }
      await generate(
        file.path.inPath,
        file.path.outPath,
        importedPath,
        globalDir,
        needGoogleImport,
        name
      );
    }
  }
  await generateIndex(name, outDir, files);
}
function getAllProtoPath(files) {
  var _a;
  let protoPath = [];
  if (files.length > 0) {
    for (let file of files) {
      if (((_a = file.nested) == null ? void 0 : _a.length) > 0) {
        protoPath.push(...getAllProtoPath(file.nested));
      } else {
        protoPath.push(file.path.inPath);
      }
    }
  }
  return protoPath;
}
async function loadFile(protoDir, outDir) {
  var _a;
  let fileInfoList = [];
  let directorys = await fs2.readdirSync(protoDir, {
    withFileTypes: true
  });
  for (let dirent of directorys) {
    const isDirectory = dirent.isDirectory();
    let fileInfo = {
      name: path3.parse(dirent.name).name,
      fileName: dirent.name,
      path: {
        inPath: protoDir + "/" + dirent.name,
        outPath: outDir + "/" + dirent.name
      },
      imports: [],
      package: ""
    };
    if (isDirectory) {
      debugger;
      fileInfo.nested = await loadFile(protoDir, outDir);
    } else {
      if (path3.extname(dirent.name) != ".proto")
        continue;
      let pathResolved = path3.resolve(protoDir + "/" + dirent.name);
      let protobufString = await fs2.readFileSync(pathResolved, "utf8");
      if (protobufString) {
        let parsed = protobuf2.parse(protobufString);
        fileInfo.package = parsed.package;
        if (parsed) {
          if (((_a = parsed.imports) == null ? void 0 : _a.length) > 0) {
            for (let impStr of parsed.imports) {
              if (impStr.startsWith("google")) {
                fileInfo.imports.push({
                  fileName: impStr,
                  protoPath: impStr,
                  notDetect: true
                });
              } else {
                let parsePath = path3.parse(impStr);
                fileInfo.imports.push({
                  fileName: parsePath.base,
                  protoPath: impStr,
                  notDetect: false
                });
              }
            }
          }
        }
      }
    }
    fileInfoList.push(fileInfo);
  }
  return fileInfoList;
}
function getFileMap(files) {
  var _a;
  let fileMap = /* @__PURE__ */ new Map();
  for (let file of files) {
    if (((_a = file.nested) == null ? void 0 : _a.length) > 0) {
      let nestedMap = getFileMap(file.nested);
      nestedMap.forEach((value, key) => {
        fileMap.set(key, value);
      });
    } else {
      fileMap.set(file.fileName, file.path);
    }
  }
  return fileMap;
}
function updateImports(files, blockMaps) {
  var _a;
  for (let file of files) {
    if (file.nested) {
      updateImports(file.nested, blockMaps);
    } else {
      if (((_a = file.imports) == null ? void 0 : _a.length) > 0) {
        for (let imp of file.imports) {
          if (!imp.notDetect) {
            imp.path = blockMaps.get(imp.fileName);
          }
        }
      }
    }
  }
  return files;
}

// src/generator/generateIndex.ts
var fs3 = __toESM(require("fs"));
var path4 = __toESM(require("path"));
async function generateIndex2(root) {
  let indexPath = root + "/index.ts";
  let indexTypePath = root + "/index.d.ts";
  const pathParse = path4.parse(root);
  if (pathParse.name !== "global") {
    await deleteIfExisted(indexPath);
    await deleteIfExisted(indexTypePath);
    let directorys = await getAllFileAndDirectory(root);
    if (directorys.length > 0) {
      let content = await makeIndexFile(root, directorys);
      await createIndexFile(indexPath, content);
      await createIndexFile(indexTypePath, content);
    }
    for (const file of directorys) {
      if (file.isDirectory) {
        if (file == "global")
          continue;
        await generateIndex2(root + "/" + file.name);
      }
    }
  }
}
async function getAllFileAndDirectory(root) {
  let result = [];
  let directorys = await fs3.readdirSync(root, { withFileTypes: true }).map((dirent) => {
    return {
      name: dirent.name,
      isDirectory: dirent.isDirectory()
    };
  });
  result.push(...directorys);
  return result;
}
async function makeIndexFile(root, files) {
  let content = "";
  for (const file of files) {
    let name = file.name;
    const ext = path4.extname(name);
    if (ext) {
      if (ext != ".ts") {
        continue;
      }
      if (await fileNeadToBeExport(root + "/" + file.name)) {
        if (name.endsWith(".d.ts")) {
          name = name.replace(".d.ts", "");
        } else {
          name = name.replace(ext, "");
        }
        content += `export * as ${name} from "./${name}";
`;
      }
    } else {
      content += `export * as ${name} from "./${name}";
`;
    }
  }
  return content;
}
async function createIndexFile(path5, content) {
  await fs3.writeFile(path5, content, function(err) {
    if (err)
      throw err;
    console.log("File is created successfully.");
  });
}
async function deleteIfExisted(path5) {
  if (await fs3.existsSync(path5)) {
    await fs3.unlinkSync(path5);
  }
}
async function fileNeadToBeExport(filename) {
  const contents = await fs3.readFileSync(filename, "utf-8");
  return contents.includes("export");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  generateIndex,
  protoToTs
});
