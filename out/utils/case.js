"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pascalCase = exports.capitalizeFirstLetter = exports.camelize = void 0;
function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
        if (+match === 0)
            return ""; // or if (/\s+/.test(match)) for white spaces
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
}
exports.camelize = camelize;
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
exports.capitalizeFirstLetter = capitalizeFirstLetter;
function pascalCase(str) {
    return str.replace(/\w+/g, function (w) {
        return w[0].toUpperCase() + w.slice(1).toLowerCase();
    });
}
exports.pascalCase = pascalCase;
//# sourceMappingURL=case.js.map