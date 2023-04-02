"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Def = exports.deepGenerate = exports.Code = void 0;
var Node_1 = require("./Node");
var Import_1 = require("./Import");
var is_plain_object_1 = require("./is-plain-object");
var ConditionalOutput_1 = require("./ConditionalOutput");
var index_1 = require("./index");
var dprint = __importStar(require("dprint-node"));
var Code = /** @class */ (function (_super) {
    __extends(Code, _super);
    function Code(literals, placeholders) {
        var _this = _super.call(this) || this;
        _this.literals = literals;
        _this.placeholders = placeholders;
        // Used by joinCode
        _this.trim = false;
        _this.oneline = false;
        return _this;
    }
    /** Returns the formatted code, with imports. */
    Code.prototype.toString = function (opts) {
        var _a;
        if (opts === void 0) { opts = {}; }
        (_a = this.codeWithImports) !== null && _a !== void 0 ? _a : (this.codeWithImports = this.generateCodeWithImports(opts));
        return opts.format === false
            ? this.codeWithImports
            : maybePretty(this.codeWithImports, opts.dprintOptions);
    };
    Code.prototype.asOneline = function () {
        this.oneline = true;
        return this;
    };
    Object.defineProperty(Code.prototype, "childNodes", {
        get: function () {
            return this.placeholders;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns the unformatted, import-less code.
     *
     * This is an internal API, see `toString` for the public API.
     */
    Code.prototype.toCodeString = function (used) {
        var _a;
        return ((_a = this.code) !== null && _a !== void 0 ? _a : (this.code = this.generateCode(used)));
    };
    Code.prototype.deepFindAll = function () {
        var used = [];
        var imports = [];
        var defs = [];
        var todo = [this];
        var i = 0;
        while (i < todo.length) {
            var placeholder = todo[i++];
            if (placeholder instanceof Node_1.Node) {
                todo.push.apply(todo, placeholder.childNodes);
            }
            else if (Array.isArray(placeholder)) {
                todo.push.apply(todo, placeholder);
            }
            if (placeholder instanceof ConditionalOutput_1.ConditionalOutput) {
                used.push(placeholder);
                todo.push.apply(todo, placeholder.declarationSiteCode.childNodes);
            }
            else if (placeholder instanceof Import_1.Import) {
                imports.push(placeholder);
            }
            else if (placeholder instanceof Def) {
                defs.push(placeholder);
            }
            else if (placeholder instanceof ConditionalOutput_1.MaybeOutput) {
                if (used.includes(placeholder.parent)) {
                    todo.push(placeholder.code);
                }
            }
        }
        return [used, imports, defs];
    };
    Code.prototype.deepReplaceNamedImports = function (forceDefaultImport, forceModuleImport) {
        // Keep a map of module name --> symbol we're importing, i.e. protobufjs/simple is _m1
        var assignedNames = {};
        function getName(source) {
            var name = assignedNames[source];
            if (!name) {
                name = "_m".concat(Object.values(assignedNames).length);
                assignedNames[source] = name;
            }
            return name;
        }
        var todo = [this];
        var i = 0;
        while (i < todo.length) {
            var placeholder = todo[i++];
            if (placeholder instanceof Node_1.Node) {
                var array = placeholder.childNodes;
                for (var j = 0; j < array.length; j++) {
                    var maybeImp = array[j];
                    if (maybeImp instanceof Import_1.ImportsName &&
                        forceDefaultImport.includes(maybeImp.source)) {
                        var name = getName(maybeImp.source);
                        array[j] = (0, index_1.code)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["", ".", ""], ["", ".", ""])), new Import_1.ImportsDefault(name, maybeImp.source), maybeImp.sourceSymbol || maybeImp.symbol);
                    }
                    else if (maybeImp instanceof Import_1.ImportsName &&
                        forceModuleImport.includes(maybeImp.source)) {
                        var name = getName(maybeImp.source);
                        array[j] = (0, index_1.code)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["", ".", ""], ["", ".", ""])), new Import_1.ImportsAll(name, maybeImp.source), maybeImp.sourceSymbol || maybeImp.symbol);
                    }
                    else if (maybeImp instanceof Import_1.ImportsDefault &&
                        forceModuleImport.includes(maybeImp.source)) {
                        // Change `import DataLoader from "dataloader"` to `import * as DataLoader from "dataloader"`
                        array[j] = new Import_1.ImportsAll(maybeImp.symbol, maybeImp.source);
                    }
                }
                todo.push.apply(todo, placeholder.childNodes);
            }
            else if (Array.isArray(placeholder)) {
                todo.push.apply(todo, placeholder);
            }
        }
    };
    Code.prototype.generateCode = function (used) {
        var _a = this, literals = _a.literals, placeholders = _a.placeholders;
        var result = "";
        // interleave the literals with the placeholders
        for (var i = 0; i < placeholders.length; i++) {
            result += literals[i] + deepGenerate(used, placeholders[i]);
        }
        // add the last literal
        result += literals[literals.length - 1];
        if (this.trim) {
            result = result.trim();
        }
        if (this.oneline) {
            result = result.replace(/\n/g, "");
        }
        return result;
    };
    Code.prototype.generateCodeWithImports = function (opts) {
        var _a = opts || {}, _b = _a.path, path = _b === void 0 ? "" : _b, forceDefaultImport = _a.forceDefaultImport, forceModuleImport = _a.forceModuleImport, prefix = _a.prefix, _c = _a.importMappings, importMappings = _c === void 0 ? {} : _c;
        var ourModulePath = path.replace(/\.[tj]sx?/, "");
        if (forceDefaultImport || forceModuleImport) {
            this.deepReplaceNamedImports(forceDefaultImport || [], forceModuleImport || []);
        }
        var _d = this.deepFindAll(), used = _d[0], imports = _d[1], defs = _d[2];
        assignAliasesIfNeeded(defs, imports, ourModulePath);
        var importPart = (0, Import_1.emitImports)(imports, ourModulePath, importMappings);
        var bodyPart = this.generateCode(used);
        var maybePrefix = prefix ? "".concat(prefix, "\n") : "";
        return maybePrefix + importPart + "\n" + bodyPart;
    };
    return Code;
}(Node_1.Node));
exports.Code = Code;
function deepGenerate(used, object) {
    var result = "";
    var todo = [object];
    var i = 0;
    while (i < todo.length) {
        var current = todo[i++];
        if (Array.isArray(current)) {
            todo.push.apply(todo, current);
        }
        else if (current instanceof Node_1.Node) {
            result += current.toCodeString(used);
        }
        else if (current instanceof ConditionalOutput_1.MaybeOutput) {
            if (used.includes(current.parent)) {
                result += current.code.toCodeString(used);
            }
        }
        else if (current === null) {
            result += "null";
        }
        else if (current !== undefined) {
            if ((0, is_plain_object_1.isPlainObject)(current)) {
                result += JSON.stringify(current);
            }
            else {
                result += current.toString();
            }
        }
        else {
            result += "undefined";
        }
    }
    return result;
}
exports.deepGenerate = deepGenerate;
/** Finds any namespace collisions of a named import colliding with def and assigns the import an alias it. */
function assignAliasesIfNeeded(defs, imports, ourModulePath) {
    // Keep track of used (whether declared or imported) symbols
    var usedSymbols = new Set();
    // Mark all locally-defined symbols as used
    defs.forEach(function (def) { return usedSymbols.add(def.symbol); });
    // A mapping of original to assigned alias, i.e. Foo@foo --> Foo2
    var assignedAliases = {};
    var j = 1;
    imports.forEach(function (i) {
        if (i instanceof Import_1.ImportsName &&
            // Don't both aliasing imports from our own module
            !((0, Import_1.sameModule)(i.source, ourModulePath) ||
                (i.definedIn && (0, Import_1.sameModule)(i.definedIn, ourModulePath)))) {
            var key = "".concat(i.symbol, "@").concat(i.source);
            if (usedSymbols.has(i.symbol)) {
                var alias = assignedAliases[key];
                if (!alias) {
                    alias = "".concat(i.symbol).concat(j++);
                    assignedAliases[key] = alias;
                }
                // Move the original symbol over
                if (alias !== i.symbol) {
                    i.sourceSymbol = i.symbol;
                }
                i.symbol = alias;
            }
            else {
                usedSymbols.add(i.symbol);
                assignedAliases[key] = i.symbol;
            }
        }
    });
}
// This default options are both "prettier-ish" plus also suite the ts-poet pre-formatted
// output which is all bunched together, so we want to force braces / force new lines.
var baseOptions = {
    useTabs: false,
    useBraces: "always",
    singleBodyPosition: "nextLine",
    "arrowFunction.useParentheses": "force",
    // dprint-node uses `node: true`, which we want to undo
    "module.sortImportDeclarations": "caseSensitive",
    lineWidth: 120,
    // For some reason dprint seems to wrap lines "before it should" w/o this set (?)
    preferSingleLine: true,
};
function maybePretty(input, options) {
    try {
        return dprint.format("file.ts", input.trim(), __assign(__assign({}, baseOptions), options));
    }
    catch (e) {
        return input; // assume it's invalid syntax and ignore
    }
}
/**
 * Represents a symbol defined in the current file.
 *
 * We use this to know if a symbol imported from a different file is going to
 * have a namespace collision.
 */
var Def = /** @class */ (function (_super) {
    __extends(Def, _super);
    function Def(symbol) {
        var _this = _super.call(this) || this;
        _this.symbol = symbol;
        return _this;
    }
    Def.prototype.toCodeString = function () {
        return this.symbol;
    };
    Object.defineProperty(Def.prototype, "childNodes", {
        /** Any potentially string/SymbolSpec/Code nested nodes within us. */
        get: function () {
            return [];
        },
        enumerable: false,
        configurable: true
    });
    return Def;
}(Node_1.Node));
exports.Def = Def;
var templateObject_1, templateObject_2;
//# sourceMappingURL=Code.js.map