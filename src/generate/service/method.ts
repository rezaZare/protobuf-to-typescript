import { code, Code } from "ts-poet";
import { camelize } from "../../utils/case";

export class Method {
  name: string;
  requestType: string;
  responseType: string;
  pbRequestType: string;
  code?: Code;
  pbName: string;
  constructor(service: protobuf.Method, pbName) {
    this.name = service.name;
    this.requestType = service.requestType;
    this.responseType = service.responseType;

    this.pbName = pbName;

    if (service.requestType.includes(".")) {
      let spl = service.requestType.split(".");
      spl[0] = spl[0] + "_pb";
      this.pbRequestType = spl.join(".");
    } else {
      this.pbRequestType = pbName + "." + service.requestType;
    }
  }
  generateCode() {
    this.code = this.generateMethodCode();
  }

  private generateMethodCode() {
    let haveRequestModel = true;
    if (this.requestType == "google.protobuf.Empty") {
      haveRequestModel = false;
    }
    //------------------------------------

    return code`
        async ${this.name} (${
      haveRequestModel ? "model:" + this.requestType + " ," : ""
    } metaData: global.MetaData):Promise<global.ResponseModel<${getResponseModel(
      this.responseType
    )}>> {
          try {
             ${
               haveRequestModel
                 ? `const reqModel = global.toProto(${this.pbRequestType},model)`
                 : ""
             }
              
              let response = new Promise<
                  global.ResponseModel<${getResponseModel(this.responseType)}>
              >((resolve) => {
                  this.client().${camelize(this.name)}(
                    ${haveRequestModel ? "reqModel" : "{}"} 
                  ,global.mergeMetaData(metaData),
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
}

// export function generateMethod() {
//   //, pbName: string

//   this.code = generateMethodCode(this, this.pbName); // TODO: this function must use another function for generate all method Code
//   return method;
// }

//TODO: request and response google.protobuf.Empty

//TODO: if requst or response bein in another file must import file
//TODO:

// export function generateMethodCode(method: MethodType, pbName: string) {
//   let haveRequestModel = true;
//   if (method.requestType == "google.protobuf.Empty") {
//     haveRequestModel = false;
//   }
//   //------------------------------------

//   return code`
//       async ${method.name} (${
//     haveRequestModel ? "model:" + method.requestType + " ," : ""
//   } metaData: global.MetaData):Promise<global.ResponseModel<${getResponseModel(
//     method.responseType
//   )}>> {
//         try {
//            ${
//              haveRequestModel
//                ? `const reqModel = global.toProto(${pbName}.${method.requestType},model)`
//                : ""
//            }

//             let response = new Promise<
//                 global.ResponseModel<${getResponseModel(method.responseType)}>
//             >((resolve) => {
//                 this.client().${camelize(method.name)}(
//                   ${haveRequestModel ? "reqModel" : "{}"}
//                 ,global.mergeMetaData(metaData),
//                 (err, response) => {
//                     resolve(
//                     global.ResponseModel.ToResponModel(err, response?.toObject())
//                     );
//                 }
//                 );
//             });

//             return await response;
//         } catch (exp) {
//             return global.ResponseModel.Error(exp);
//         }
//     }`;
// }

function getResponseModel(responseType) {
  if (responseType === "google.protobuf.Empty") {
    return "{}";
  }
  return responseType;
}

function getType(type: string) {
  if (type === "google.protobuf.Empty") {
    return "{}";
  }
}
