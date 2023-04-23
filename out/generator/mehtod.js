"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Method = void 0;
var case_1 = require("../utils/case");
var import_1 = require("./import");
var Method = /** @class */ (function () {
    function Method(service, file) {
        this.name = service.name;
        this.requestType = file.codeBlocks.getType(service.requestType);
        this.responseType = file.codeBlocks.getType(service.responseType);
        // if (service.requestType.includes(".")) {
        //   let spl = service.requestType.split(".");
        //   spl[0] = spl[0] + "_pb";
        //   this.pbRequestType = spl.join(".");
        // } else {
        //   // this.pbRequestType = pbName + "." + service.requestType;
        // }
    }
    Method.prototype.load = function (file) {
        var _a;
        var impPb = (_a = file.imports) === null || _a === void 0 ? void 0 : _a.find(function (x) { return x.type == import_1.ImportType.GRPC_PB; });
        if (impPb) {
            this.pbRequestType = impPb.name + "." + this.requestType;
        }
    };
    Method.prototype.getCode = function () {
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
//# sourceMappingURL=mehtod.js.map