"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Method = void 0;
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
        if (this.requestType == "google.protobuf.Empty" ||
            this.requestType.toLocaleLowerCase().includes("empty")) {
            haveRequestModel = false;
        }
        //------------------------------------
        return "\n        async ".concat(this.name, " (").concat(haveRequestModel ? "model:" + this.requestType + " ," : "", " metaData: global.MetaData):Promise<global.ResponseModel<").concat(getResponseModel(this.responseType), ">> {\n          try {\n             ").concat(haveRequestModel
            ? "const reqModel = global.toProto(".concat(this.pbRequestType, ",model)")
            : "", "\n              \n             const response = new Promise<\n                  global.ResponseModel<").concat(getResponseModel(this.responseType), ">\n              >((resolve) => {\n                  this.client().").concat((0, case_1.camelize)(this.name), "(\n                    ").concat(haveRequestModel
            ? "reqModel"
            : "new google_protobuf_empty.Empty()", " \n                  ,global.mergeMetaData(metaData),\n                  (err, response) => {\n                      resolve(\n                      global.ResponseModel.ToResponModel(err, response?.toObject())\n                      );\n                  }\n                  );\n              });\n  \n              return await response;\n          } catch (exp) {\n              return global.ResponseModel.Error(exp);\n          }\n      }");
    };
    return Method;
}());
exports.Method = Method;
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
// async SetUserBaseInfo(
//   model: SetUserBaseInfoRequest,
//   metaData: global.MetaData
// ): Promise<global.ResponseModel<SetUserBaseInfoResponse>> {
//   try {
//     //schema
//     const toProto = global.toProto.createFromObject(
//       user_pb.SetUserBaseInfoRequest,
//       {
//         userInfo: global.toProto.createFromObject(type_pb.UserBaseInfo),
//       }
//     );
//     const reqModel = toProto(model);
//     const response = new Promise<
//       global.ResponseModel<SetUserBaseInfoResponse>
//     >((resolve) => {
//       this.client().setUserBaseInfo(
//         reqModel,
//         global.mergeMetaData(metaData),
//         (err, response) => {
//           resolve(
//             global.ResponseModel.ToResponModel(err, response?.toObject())
//           );
//         }
//       );
//     });
//     return await response;
//   } catch (exp) {
//     return global.ResponseModel.Error(exp);
//   }
// }
// }
//# sourceMappingURL=method.js.map