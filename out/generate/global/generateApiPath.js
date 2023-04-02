"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateApiPathCode = void 0;
var ts_poet_1 = require("../../ts-poet");
function generateApiPathCode() {
    return (0, ts_poet_1.code)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    const developModel = location.hostname === \"localhost\";\n    export function srvPath(): string {\n        const hostName = !developModel\n            ? location.origin + \"/api\"\n            : \"https://vodteam.com/api\";\n        return hostName;\n    }\n    "], ["\n    const developModel = location.hostname === \"localhost\";\n    export function srvPath(): string {\n        const hostName = !developModel\n            ? location.origin + \"/api\"\n            : \"https://vodteam.com/api\";\n        return hostName;\n    }\n    "])));
}
exports.generateApiPathCode = generateApiPathCode;
var templateObject_1;
//# sourceMappingURL=generateApiPath.js.map