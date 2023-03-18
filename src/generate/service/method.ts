import { code, Code } from "ts-poet";
import { camelize } from "../../utils/case";

export interface MethodType {
  name: string;
  requestType: string;
  responseType: string;
  code?: Code;
}
export function generateMethod(service: protobuf.Method, pbName: string) {
  let method: MethodType = {
    name: service.name,
    requestType: service.requestType,
    responseType: service.responseType,
  };
  method.code = generateMethodCode(method, pbName);
  return method;
}

//TODO:request and response google.protobuf.Empty

export function generateMethodCode(method: MethodType, pbName: string) {
  return code`
      async ${method.name} (model:${
    method.requestType
  } , metaData: global.MetaData):Promise<global.ResponseModel<${getResponseModel(
    method.responseType
  )}>> {
        try {
            // const rqModel = new ${pbName}.${method.requestType}();
            const reqModel = global.toProto(${pbName}.${
    method.requestType
  },model)
            let response = new Promise<
                global.ResponseModel<${getResponseModel(method.responseType)}>
            >((resolve) => {
                this.client().${camelize(method.name)}(
                  reqModel,
                global.mergeMetaData(metaData),
                (err, response) => {
                    resolve(
                    global.ResponseModel.ToResponModel(err, response?.toObject())
                    );
                }
                );
            });

            return await response;
        } catch (exp) {
            return global.ResponseModel.Error(exp);
        }
    }`;
}

function getResponseModel(responseType) {
  if (responseType === "google.protobuf.Empty") {
    return "{}";
  }
  return responseType;
}
