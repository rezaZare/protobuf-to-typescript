"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateApiPathCode = void 0;
function generateApiPathCode(apiPath) {
    return "\n    const developModel = location.hostname === \"localhost\";\n    export function srvPath(): string {\n        const hostName = !developModel\n            ? location.origin + \"/api\"\n            : \"".concat(apiPath, "\";\n        return hostName;\n    }\n    ");
}
exports.generateApiPathCode = generateApiPathCode;
//# sourceMappingURL=generateApiPath.js.map