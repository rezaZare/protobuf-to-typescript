import path from "path";
import * as protobuf from "protobufjs";
import { IService } from "protobufjs/minimal";

export class ServiceMethod {
  name: string;
  requestType: string;
  responseType: string;
  requestStream?: boolean;
  responseStream?: boolean;
  serviceName: string;
  packageName: string;
  constructor(
    name: string,
    requestType: string,
    responseType: string,
    serviceName: string,
    packageName: string
  ) {
    this.name = name;
    this.requestType = requestType;
    this.responseType = responseType;
    this.serviceName = serviceName;
    this.packageName = packageName;
  }
  getCode() {
    const ret: string[] = [];

    const methodDescriptorPropName = `methodDescriptor_${this.name}`;
    ret.push(
      `export async function ${this.name}(`,
      `  model: ${this.packageName}.${this.requestType},`,
      `  metaData: global.MetaData`,
      `): Promise<global.ResponseModel<${this.packageName}.${this.responseType}>> {`,
      `  try {`
    );

    ret.push(
      `  let ${methodDescriptorPropName} =  new MethodDescriptor<${this.packageName}.${this.requestType}, ${this.packageName}.${this.responseType}>(`,
      `  '/${this.packageName}.${this.serviceName}/${this.name}',`,
      `  ${this.responseStream ? `'server_streaming'` : `MethodType.UNARY`},`,
      `  ${this.packageName}.${this.requestType},`,
      `  ${this.packageName}.${this.responseType},`,
      `  (req: ${this.packageName}.${this.requestType}) => ${this.packageName}.${this.requestType}.encode(req).finish(),`,
      `  ${this.packageName}.${this.responseType}.decode,`,
      `);`
    );

    ret.push(
      `let response = await grpc.makeInterceptedUnaryCall('/${this.packageName}.${this.serviceName}/${this.name}', model, ${methodDescriptorPropName}, metaData);`
    );
    ret.push(
      `    return global.ResponseModel.Data(response);`,
      `  } catch (exp) {`,
      `    return global.ResponseModel.Error(exp);`,
      `  }`,
      `}`
    );

    return ret.join(`\n${getIndentSpaces(3)}`);
  }
}

export class ServiceGenerator {
  //outDir:./sample/proto/admin_service_v1.proto
  methods: ServiceMethod[] = [];
  globalPath: string;
  fileName: string;
  nameSpace: string[] = [];
  constructor(root: protobuf.Root, outDir: string, globalDir: string) {
    let outParse = path.parse(outDir);
    this.globalPath = path.relative(outParse.dir, globalDir);
    if (!this.globalPath.startsWith("."))
      this.globalPath = "./" + this.globalPath;
    this.fileName = outParse.name;

    let serviceInfo = this.getService(root.nested);
    let packageName = "";
    if (serviceInfo?.nameSpace?.length > 0) {
      this.nameSpace = serviceInfo.nameSpace;
      packageName = serviceInfo.nameSpace.join(".");
    }

    if (serviceInfo && serviceInfo.service?.methods) {
      let obj = mapServiceMethods(serviceInfo.service?.methods);
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
    let codes: string[] = [];
    codes.push(
      `import { MethodType, MethodDescriptor } from "grpc-web";`,
      `import * as global from "${this.globalPath}"`
    );
    if (this.nameSpace.length > 0) {
      codes.push(`import { ${this.nameSpace[0]} } from "./${this.fileName}"`);
    }

    codes.push(`let grpc = new global.GrpcService(global.srvPath());`);
    codes.push(...this.methods.map((x) => x.getCode()));
    return codes.join(`\n${getIndentSpaces(1)}`);
  }

  getService(element, nameSpace?: string[]): ServiceInfo {
    if (!nameSpace) nameSpace = [];
    if (typeof element == "object") {
      for (const [key, value] of Object.entries(element)) {
        if (value instanceof protobuf.Service) {
          return {
            service: value,
            nameSpace,
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
}

interface ServiceInfo {
  service: protobuf.Service;
  nameSpace: string[];
}

//----- util
function mapServiceMethods(methods: IService["methods"]) {
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
function getObjectKeys<T>(target: T) {
  return Object.keys(target) as (keyof T)[];
}
function strcmp(a: string, b: string): number {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else {
    return 0;
  }
}
export function getIndentSpaces(level: number = 0) {
  return new Array(2 * level).fill(" ").join("");
}
