import protobuf from "protobufjs";
import { code, Code, joinCode } from "ts-poet";
import { generateMethod, MethodType } from "./method";

export interface ServiceType {
  methods: MethodType[];
  code: Code;
}

export function generateService(element: protobuf.Service): ServiceType {
  if (element.methods) {
    let methods: MethodType[] = [];
    for (const [key, value] of Object.entries(element.methods)) {
      if (value instanceof protobuf.Method) {
        methods.push(generateMethod(value));
      }
    }
    return {
      code: generateServiceCode(methods),
      methods: methods,
    };
  }
  return undefined;
}
export function generateServiceCode(methods: MethodType[]) {
  return code`export class Services {
            //import section
            ${generateClientCode()}
            ${getAllMethodCode(methods)}
        }`;
}

function getAllMethodCode(methods: MethodType[]) {
  if (methods.length > 0) {
    return joinCode(
      methods.filter((x) => x.code !== undefined).map((x) => x.code),
      { on: "\n" }
    ).toString();
  }
  return "";
}

export function generateClientCode() {
  return code`const client = (): Admin_service_v1ServiceClientPb.AdminServiceClient => {
        const _client = new Admin_service_v1ServiceClientPb.AdminServiceClient(
          global.srvPath(),
          {}
        );
        global.enabledDevMode(_client);
        return _client;
      };`;
}
