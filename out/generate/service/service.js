"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateClientCode = exports.generateServiceCode = exports.generateService = void 0;
var protobufjs_1 = __importDefault(require("protobufjs"));
var ts_poet_1 = require("ts-poet");
var method_1 = require("./method");
function generateService(element) {
    if (element.methods) {
        var methods = [];
        for (var _i = 0, _a = Object.entries(element.methods); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (value instanceof protobufjs_1.default.Method) {
                methods.push(method_1.generateMethod(value));
            }
        }
        return {
            code: generateServiceCode(methods),
            methods: methods,
        };
    }
    return undefined;
}
exports.generateService = generateService;
function generateServiceCode(methods) {
    return ts_poet_1.code(templateObject_1 || (templateObject_1 = __makeTemplateObject(["export class Services {\n            //import section\n            ", "\n            ", "\n        }"], ["export class Services {\n            //import section\n            ", "\n            ", "\n        }"])), generateClientCode(), getAllMethodCode(methods));
}
exports.generateServiceCode = generateServiceCode;
function getAllMethodCode(methods) {
    if (methods.length > 0) {
        return ts_poet_1.joinCode(methods.filter(function (x) { return x.code !== undefined; }).map(function (x) { return x.code; }), { on: "\n" }).toString();
    }
    return "";
}
function generateClientCode() {
    return ts_poet_1.code(templateObject_2 || (templateObject_2 = __makeTemplateObject(["const client = (): Admin_service_v1ServiceClientPb.AdminServiceClient => {\n        const _client = new Admin_service_v1ServiceClientPb.AdminServiceClient(\n          global.srvPath(),\n          {}\n        );\n        global.enabledDevMode(_client);\n        return _client;\n      };"], ["const client = (): Admin_service_v1ServiceClientPb.AdminServiceClient => {\n        const _client = new Admin_service_v1ServiceClientPb.AdminServiceClient(\n          global.srvPath(),\n          {}\n        );\n        global.enabledDevMode(_client);\n        return _client;\n      };"])));
}
exports.generateClientCode = generateClientCode;
var templateObject_1, templateObject_2;
//# sourceMappingURL=service.js.map