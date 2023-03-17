"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMethodCode = exports.generateMethod = void 0;
var ts_poet_1 = require("ts-poet");
function generateMethod(service) {
    var method = {
        name: service.name,
        requestType: service.requestType,
        responseType: service.responseType,
    };
    method.code = generateMethodCode(method);
    return method;
}
exports.generateMethod = generateMethod;
function generateMethodCode(method) {
    return ts_poet_1.code(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n     export async function ", " (model:", "):Promise<global.ResponseModel<", ">> {\n        try {\n            const rqModel = new entry_service_v1_pb.", "();\n            let response = new Promise<\n                global.ResponseModel<", ">\n            >((resolve) => {\n                client().sendVerificationCode(\n                rqModel,\n                global.mergeMetaData(metaData),\n                (err, response) => {\n                    resolve(\n                    global.ResponseModel.ToResponModel(err, response?.toObject())\n                    );\n                }\n                );\n            });\n\n            return await response;\n        } catch (exp) {\n            return global.ResponseModel.Error(exp);\n        }\n    }"], ["\n     export async function ", " (model:", "):Promise<global.ResponseModel<", ">> {\n        try {\n            const rqModel = new entry_service_v1_pb.", "();\n            let response = new Promise<\n                global.ResponseModel<", ">\n            >((resolve) => {\n                client().sendVerificationCode(\n                rqModel,\n                global.mergeMetaData(metaData),\n                (err, response) => {\n                    resolve(\n                    global.ResponseModel.ToResponModel(err, response?.toObject())\n                    );\n                }\n                );\n            });\n\n            return await response;\n        } catch (exp) {\n            return global.ResponseModel.Error(exp);\n        }\n    }"])), method.name, method.requestType, method.requestType, method.requestType, method.requestType);
}
exports.generateMethodCode = generateMethodCode;
var templateObject_1;
//# sourceMappingURL=method.js.map