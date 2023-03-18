import path from "path";
import protobuf from "protobufjs";
import { code, Code, imp, joinCode } from "ts-poet";
import { capitalizeFirstLetter } from "../../utils/case";
import { PathInfo, ServiceType } from "../model";
import { generateMethod, MethodType } from "./method";

export function generateService(element, filepath: PathInfo): ServiceType {
  let services = getService(element);
  let serviceRelativePath = path.relative(filepath.outPath, filepath.grpcPath);
  let globalRelativePath = path.relative(filepath.outPath, filepath.globalpath);

  let pbName = filepath.grpcPb.replace(/\.[^/.]+$/, "");
  let pbServiceName = filepath.grpcServicePb.replace(/\.[^/.]+$/, "");

  let pbImport = `import * as ${pbName} from '${serviceRelativePath}/${pbName}';`;
  let pbServiceImport = `import * as ${pbServiceName} from '${serviceRelativePath}/${capitalizeFirstLetter(
    pbServiceName
  )}';`;
  let globalImport = `import * as global from '${globalRelativePath}'`;
  // let pbImport = imp(`${pbName}*${rel}/${pbName}`);
  // let serviceImport = imp(
  //   `${pbServiceName}*${rel}/${capitalizeFirstLetter(pbServiceName)}`
  // );

  if (services) {
    let methods: MethodType[] = [];
    for (const [key, value] of Object.entries(services.methods)) {
      if (value instanceof protobuf.Method) {
        methods.push(generateMethod(value, pbName));
      }
      // else if (value instanceof protobuf.Namespace) {
      // }
    }

    let _code = generateServiceCode(
      methods,
      services.name,
      pbServiceName,
      pbImport,
      pbServiceImport,
      globalImport
    );

    return {
      code: _code,
      methods: methods,
    };
  }
  return undefined;
}
export function getService(element) {
  if (element instanceof protobuf.Root) {
    if (element.nested) {
      return getService(element.nested);
    }
  } else {
    if (typeof element == "object") {
      for (const [key, value] of Object.entries(element)) {
        if (value instanceof protobuf.Service) {
          return value;
        } else if (value instanceof protobuf.Namespace) {
          return getService(value["nested"]);
        }
      }
    }
  }
}
export function generateServiceCode(
  methods: MethodType[],
  apiName: string,
  pbServiceName: string,
  pbImport,
  pbServiceImport,
  globalImport
) {
  return code`
//---------------------------------------------------------------
// -----                  Service Section                   -----
//---------------------------------------------------------------
  ${pbImport}
  ${pbServiceImport}
  ${globalImport}
  
  export class Services {
            //import section
            ${generateClientCode(apiName, pbServiceName)}
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

export function generateClientCode(apiName: string, pbServiceName: string) {
  return code`client = (): ${pbServiceName}.${apiName}Client => {
        const _client = new ${pbServiceName}.${apiName}Client(
          global.srvPath(),
          {}
        );
        global.enabledDevMode(_client);
        return _client;
      };`;
}
