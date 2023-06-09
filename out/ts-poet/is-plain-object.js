"use strict";
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPlainObject = void 0;
function isPlainObject(o) {
    if (o === null || o === undefined)
        return false;
    if (!isObject(o))
        return false;
    // If has modified constructor
    var ctor = o.constructor;
    if (ctor === undefined)
        return true;
    // If has modified prototype
    if (!isObject(ctor.prototype))
        return false;
    // If constructor does not have an Object-specific method
    if (!ctor.prototype.hasOwnProperty("isPrototypeOf"))
        return false;
    // Most likely a plain Object
    return true;
}
exports.isPlainObject = isPlainObject;
function isObject(o) {
    return Object.prototype.toString.call(o) === "[object Object]";
}
//# sourceMappingURL=is-plain-object.js.map