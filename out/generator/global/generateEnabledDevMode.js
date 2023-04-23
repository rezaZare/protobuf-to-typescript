"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEnabledDevMode = void 0;
function generateEnabledDevMode() {
    return "\n     export function enabledDevMode<T>(client: T): void {\n    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types\n    if (window) {\n      // eslint-disable-next-line @typescript-eslint/no-empty-function\n      const enableDevTools = window[\"__GRPCWEB_DEVTOOLS__\"] || (() => {});\n      enableDevTools([client]);\n    }\n  }\n";
}
exports.generateEnabledDevMode = generateEnabledDevMode;
//# sourceMappingURL=generateEnabledDevMode.js.map