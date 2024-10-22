"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIndentSpaces = exports.ServiceGenerator = exports.ServiceMethod = void 0;
const path = require("path");
const protobuf = require("protobufjs");
class ServiceMethod {
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
        }
        else {
            modelType = packageName + "I" + this.requestType;
        }
        const methodDescriptorPropName = `methodDescriptor_${this.name}`;
        ret.push(`export async function ${this.name}(`, `  model: ${modelType},`, `  metaData: global.MetaData,`, `  cacheable?: boolean`, `): Promise<global.ResponseModel<${resType}>> {`, `if (cacheable) {`, `   const data = await getApi<${modelType},${resType}>('/${packageName}${this.serviceName}/${this.name}', model);`, `   if (data) return global.ResponseModel.Data(data.response);`, `}`, `const id = global.getNewId();`, `global.SendMessage({
        endpoint: '/${packageName}${this.serviceName}/${this.name}',
        id: id,
        messageType: "grpc",
        type: "request",
        body: model,
        metaData: metaData,
      });`, `  try {`);
        if (!this.requestType.includes("google")) {
            ret.push(`const ${this.requestType}: new () => ${reqType} = ${reqType};`);
        }
        if (!this.responseType.includes("google")) {
            ret.push(`const ${this.responseType}: new () => ${resType} = ${resType};`);
        }
        ret.push(`  const ${methodDescriptorPropName} =  new MethodDescriptor<${reqType}, ${resType}>(`, `  '/${packageName}${this.serviceName}/${this.name}',`, `  ${this.responseStream ? `'server_streaming'` : `MethodType.UNARY`},`, `  ${this.requestType},`, `  ${this.responseType},`, `  (req: ${reqType}) => ${reqType}.encode(req).finish(),`, `  ${resType}.decode,`, `);`);
        ret.push(`global.SendMessage({
      endpoint: '/${packageName}${this.serviceName}/${this.name}',
      id: id,
      messageType: "grpc",
      type: "request",
      body: model,
      metaData: metaData,
      isSendRequest: true,
    });`);
        ret.push(`const response = await grpc.makeInterceptedUnaryCall('/${packageName}${this.serviceName}/${this.name}', model, ${methodDescriptorPropName}, global.mergeMetaData(metaData));`);
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
        ret.push(`    return global.ResponseModel.Data(response);`, `  } catch (exp) {`, `global.SendMessage({
        endpoint: '/${packageName}${this.serviceName}/${this.name}',
        id: id,
        messageType: "grpc",
        type: "error",
        body: exp,
        metaData: metaData,
        isSendRequest: true,
      });`, `    return global.ResponseModel.Error(exp);`, `  }`, `}`);
        return ret.join(`\n${getIndentSpaces(3)}`);
    }
}
exports.ServiceMethod = ServiceMethod;
class ServiceGenerator {
    constructor(root, outDir, globalDir, needGoogleImport, finalFileName) {
        var _a, _b, _c;
        //outDir:./sample/proto/admin_service_v1.proto
        this.methods = [];
        this.nameSpace = [];
        let outParse = path.parse(outDir);
        this.needGoogleImport = needGoogleImport;
        this.globalPath = path.relative(outParse.dir, globalDir);
        if (!this.globalPath.startsWith("."))
            this.globalPath = "./" + this.globalPath;
        this.fileName = outParse.name;
        this.finalFileName = finalFileName;
        let serviceInfo = this.getService(root.nested);
        let packageName = "";
        if (((_a = serviceInfo === null || serviceInfo === void 0 ? void 0 : serviceInfo.nameSpace) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            this.nameSpace = serviceInfo.nameSpace;
            packageName = serviceInfo.nameSpace.join(".");
        }
        if (serviceInfo && ((_b = serviceInfo.service) === null || _b === void 0 ? void 0 : _b.methods)) {
            let obj = mapServiceMethods((_c = serviceInfo.service) === null || _c === void 0 ? void 0 : _c.methods);
            for (let method of obj) {
                let newMethod = new ServiceMethod(method.name, method.requestType, method.responseType, serviceInfo.service.name, packageName);
                this.methods.push(newMethod);
            }
        }
    }
    getCode() {
        let codes = [];
        codes.push(`import { MethodType, MethodDescriptor } from "grpc-web";`, `import * as global from "${this.globalPath}";`, `import { getApi, setApi } from "@espad/cache";`);
        if (this.finalFileName) {
            codes.push(`import { ${this.finalFileName} ${this.needGoogleImport ? ", google " : ""} } from "./${this.finalFileName}"`);
        }
        // if (this.nameSpace.length > 0) {
        //   codes.push(
        //     `import { ${this.nameSpace[0]} ${
        //       this.needGoogleImport ? ", google " : ""
        //     } } from "./${this.fileName}"`
        //   );
        // }
        codes.push(`const grpc = new global.GrpcService(global.srvPath());`);
        codes.push(...this.methods.map((x) => x.getCode()));
        return codes.join(`\n${getIndentSpaces(1)}`);
    }
    getService(element, nameSpace) {
        if (!nameSpace)
            nameSpace = [];
        if (typeof element == "object") {
            for (const [key, value] of Object.entries(element)) {
                if (value instanceof protobuf.Service) {
                    return {
                        service: value,
                        nameSpace,
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
    }
}
exports.ServiceGenerator = ServiceGenerator;
//----- util
function mapServiceMethods(methods) {
    return getObjectKeys(methods)
        .map((method) => ({
        name: String(method),
        requestType: methods[method].requestType,
        responseType: methods[method].responseType,
        requestStream: methods[method].requestStream,
        responseStream: methods[method].responseStream,
    }))
        .sort((a, b) => strcmp(a.name, b.name));
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
function getIndentSpaces(level = 0) {
    return new Array(2 * level).fill(" ").join("");
}
exports.getIndentSpaces = getIndentSpaces;
//# sourceMappingURL=service.js.map