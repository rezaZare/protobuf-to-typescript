"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conditionalOutput = exports.def = exports.imp = exports.joinCode = exports.arrayOf = exports.literalOf = exports.code = exports.saveFiles = exports.Import = exports.Code = void 0;
var Import_1 = require("./Import");
var Code_1 = require("./Code");
var ConditionalOutput_1 = require("./ConditionalOutput");
var is_plain_object_1 = require("./is-plain-object");
var Literal_1 = require("./Literal");
var Code_2 = require("./Code");
Object.defineProperty(exports, "Code", { enumerable: true, get: function () { return Code_2.Code; } });
var Import_2 = require("./Import");
Object.defineProperty(exports, "Import", { enumerable: true, get: function () { return Import_2.Import; } });
var saveFiles_1 = require("./saveFiles");
Object.defineProperty(exports, "saveFiles", { enumerable: true, get: function () { return saveFiles_1.saveFiles; } });
/** A template literal to format code and auto-organize imports. */
function code(literals) {
    var placeholders = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        placeholders[_i - 1] = arguments[_i];
    }
    return new Code_1.Code(literals, placeholders.map(function (p) {
        if ((0, is_plain_object_1.isPlainObject)(p)) {
            return literalOf(p);
        }
        else {
            return p;
        }
    }));
}
exports.code = code;
function literalOf(object) {
    return new Literal_1.Literal(object);
}
exports.literalOf = literalOf;
function arrayOf() {
    var elements = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        elements[_i] = arguments[_i];
    }
    return literalOf(elements);
}
exports.arrayOf = arrayOf;
function joinCode(chunks, opts) {
    if (opts === void 0) { opts = {}; }
    var _a = opts.on, on = _a === void 0 ? "" : _a, _b = opts.trim, trim = _b === void 0 ? true : _b;
    var literals = [""];
    for (var i = 0; i < chunks.length - 1; i++) {
        literals.push(on);
    }
    literals.push("");
    if (trim) {
        chunks.forEach(function (c) { return (c.trim = true); });
    }
    return new Code_1.Code(literals, chunks);
}
exports.joinCode = joinCode;
/** Creates an import that will be auto-imported at the top of the output file. */
function imp(spec, opts) {
    if (opts === void 0) { opts = {}; }
    var sym = Import_1.Import.from(spec);
    if (opts && opts.definedIn) {
        sym.definedIn = opts.definedIn;
    }
    return sym;
}
exports.imp = imp;
/** Defines `symbol` as being locally defined in the file, to avoid import collisions. */
function def(symbol) {
    return new Code_1.Def(symbol);
}
exports.def = def;
/** Creates a conditionally-output code snippet. */
function conditionalOutput(usageSite, declarationSite) {
    return new ConditionalOutput_1.ConditionalOutput(usageSite, declarationSite);
}
exports.conditionalOutput = conditionalOutput;
//# sourceMappingURL=index.js.map