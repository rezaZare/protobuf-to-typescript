import { code, Code } from "ts-poet";

export interface MethodType {
  name: string;
  requestType: string;
  responseType: string;
  code?: Code;
}
export function generateMethod(service: protobuf.Method) {
  let method: MethodType = {
    name: service.name,
    requestType: service.requestType,
    responseType: service.responseType,
  };
  method.code = generateMethodCode(method);
  return method;
}

export function generateMethodCode(method: MethodType) {
  return code`
     export async function ${method.name} (model:${method.requestType}):Promise<global.ResponseModel<${method.requestType}>> {
        try {
            const rqModel = new entry_service_v1_pb.${method.requestType}();
            let response = new Promise<
                global.ResponseModel<${method.requestType}>
            >((resolve) => {
                client().sendVerificationCode(
                rqModel,
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
