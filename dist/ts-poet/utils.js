export function groupBy(list, fn, valueFn) {
    const result = {};
    list.forEach((o) => {
        var _a;
        const group = fn(o);
        (_a = result[group]) !== null && _a !== void 0 ? _a : (result[group] = []);
        result[group].push(valueFn ? valueFn(o) : o);
    });
    return result;
}
export function last(list) {
    return list[list.length - 1];
}
//# sourceMappingURL=utils.js.map