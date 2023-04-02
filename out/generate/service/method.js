"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Method = void 0;
var ts_poet_1 = require("../../ts-poet");
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
        return (0, ts_poet_1.code)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        async ", " (", " metaData: global.MetaData):Promise<global.ResponseModel<", ">> {\n          try {\n             ", "\n              \n              let response = new Promise<\n                  global.ResponseModel<", ">\n              >((resolve) => {\n                  this.client().", "(\n                    ", " \n                  ,global.mergeMetaData(metaData),\n                  (err, response) => {\n                      resolve(\n                      global.ResponseModel.ToResponModel(err, response?.toObject())\n                      );\n                  }\n                  );\n              });\n  \n              return await response;\n          } catch (exp) {\n              return global.ResponseModel.Error(exp);\n          }\n      }"], ["\n        async ", " (", " metaData: global.MetaData):Promise<global.ResponseModel<", ">> {\n          try {\n             ", "\n              \n              let response = new Promise<\n                  global.ResponseModel<", ">\n              >((resolve) => {\n                  this.client().", "(\n                    ", " \n                  ,global.mergeMetaData(metaData),\n                  (err, response) => {\n                      resolve(\n                      global.ResponseModel.ToResponModel(err, response?.toObject())\n                      );\n                  }\n                  );\n              });\n  \n              return await response;\n          } catch (exp) {\n              return global.ResponseModel.Error(exp);\n          }\n      }"])), this.name, haveRequestModel ? "model:" + this.requestType + " ," : "", getResponseModel(this.responseType), haveRequestModel
            ? "const reqModel = global.toProto(".concat(this.pbRequestType, ",model)")
            : "", getResponseModel(this.responseType), (0, case_1.camelize)(this.name), haveRequestModel
            ? "reqModel"
            : "new google.protobuf.empty()");
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
var templateObject_1;
//# sourceMappingURL=method.js.map