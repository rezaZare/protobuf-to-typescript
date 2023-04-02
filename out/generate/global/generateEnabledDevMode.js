"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEnabledDevMode = void 0;
var ts_poet_1 = require("../../ts-poet");
function generateEnabledDevMode() {
    return (0, ts_poet_1.code)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n     export function enabledDevMode<T>(client: T): void {\n    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types\n    if (window) {\n      // eslint-disable-next-line @typescript-eslint/no-empty-function\n      const enableDevTools = window[\"__GRPCWEB_DEVTOOLS__\"] || (() => {});\n      enableDevTools([client]);\n    }\n  }\n"], ["\n     export function enabledDevMode<T>(client: T): void {\n    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types\n    if (window) {\n      // eslint-disable-next-line @typescript-eslint/no-empty-function\n      const enableDevTools = window[\"__GRPCWEB_DEVTOOLS__\"] || (() => {});\n      enableDevTools([client]);\n    }\n  }\n"])));
}
exports.generateEnabledDevMode = generateEnabledDevMode;
var templateObject_1;
//# sourceMappingURL=generateEnabledDevMode.js.map