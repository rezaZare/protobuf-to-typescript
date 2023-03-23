"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Method = void 0;
var ts_poet_1 = require("ts-poet");
var case_1 = require("../../utils/case");
var Method = /** @class */ (function () {
    function Method(service, pbName) {
        this.name = service.name;
        this.requestType = service.requestType;
        this.responseType = service.responseType;
        this.pbName = pbName;
        if (service.requestType.includes(".")) {
            var spl = service.requestType.split(".");
            spl[0] = spl[0] + "_pb";
            this.pbRequestType = spl.join(".");
        }
        else {
            this.pbRequestType = pbName + "." + service.requestType;
        }
    }
    Method.prototype.generateCode = function () {
        this.code = this.generateMethodCode();
    };
    Method.prototype.generateMethodCode = function () {
        var haveRequestModel = true;
        if (this.requestType == "google.protobuf.Empty") {
            haveRequestModel = false;
        }
        //------------------------------------
        return (0, ts_poet_1.code)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        async ", " (", " metaData: global.MetaData):Promise<global.ResponseModel<", ">> {\n          try {\n             ", "\n              \n              let response = new Promise<\n                  global.ResponseModel<", ">\n              >((resolve) => {\n                  this.client().", "(\n                    ", " \n                  ,global.mergeMetaData(metaData),\n                  (err, response) => {\n                      resolve(\n                      global.ResponseModel.ToResponModel(err, response?.toObject())\n                      );\n                  }\n                  );\n              });\n  \n              return await response;\n          } catch (exp) {\n              return global.ResponseModel.Error(exp);\n          }\n      }"], ["\n        async ", " (", " metaData: global.MetaData):Promise<global.ResponseModel<", ">> {\n          try {\n             ", "\n              \n              let response = new Promise<\n                  global.ResponseModel<", ">\n              >((resolve) => {\n                  this.client().", "(\n                    ", " \n                  ,global.mergeMetaData(metaData),\n                  (err, response) => {\n                      resolve(\n                      global.ResponseModel.ToResponModel(err, response?.toObject())\n                      );\n                  }\n                  );\n              });\n  \n              return await response;\n          } catch (exp) {\n              return global.ResponseModel.Error(exp);\n          }\n      }"])), this.name, haveRequestModel ? "model:" + this.requestType + " ," : "", getResponseModel(this.responseType), haveRequestModel
            ? "const reqModel = global.toProto(".concat(this.pbRequestType, ",model)")
            : "", getResponseModel(this.responseType), (0, case_1.camelize)(this.name), haveRequestModel ? "reqModel" : "{}");
    };
    return Method;
}());
exports.Method = Method;
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
function getType(type) {
    if (type === "google.protobuf.Empty") {
        return "{}";
    }
}
var templateObject_1;
//# sourceMappingURL=method.js.map