"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.last = exports.groupBy = void 0;
function groupBy(list, fn, valueFn) {
    var result = {};
    list.forEach(function (o) {
        var _a;
        var group = fn(o);
        (_a = result[group]) !== null && _a !== void 0 ? _a : (result[group] = []);
        result[group].push(valueFn ? valueFn(o) : o);
    });
    return result;
}
exports.groupBy = groupBy;
function last(list) {
    return list[list.length - 1];
}
exports.last = last;
//# sourceMappingURL=utils.js.map