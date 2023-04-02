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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sameModule = exports.maybeRelativePath = exports.emitImports = exports.SideEffect = exports.Augmented = exports.ImportsAll = exports.ImportsDefault = exports.ImportsName = exports.Imported = exports.Implicit = exports.Import = exports.importType = void 0;
var path = __importStar(require("path"));
var Node_1 = require("./Node");
var utils_1 = require("./utils");
var typeImportMarker = "(?:t:)?";
var fileNamePattern = "(?:[a-zA-Z0-9._-]+)";
var modulePattern = "@?(?:(?:".concat(fileNamePattern, "(?:/").concat(fileNamePattern, ")*))");
var identPattern = "(?:(?:[a-zA-Z][_a-zA-Z0-9.]*)|(?:[_a-zA-Z][_a-zA-Z0-9.]+))";
exports.importType = "[*@+=]";
var importPattern = "^(".concat(typeImportMarker).concat(identPattern, ")?(").concat(exports.importType, ")(").concat(modulePattern, ")(?:#(").concat(identPattern, "))?");
var sourceIdentPattern = "(?:(?:".concat(identPattern, ":)?)");
var sourceImportPattern = "^(".concat(typeImportMarker).concat(sourceIdentPattern).concat(identPattern, ")?(@)(").concat(modulePattern, ")(?:#(").concat(identPattern, "))?");
/**
 * Specifies a symbol and its related origin, either via import or implicit/local declaration.
 */
var Import = /** @class */ (function (_super) {
    __extends(Import, _super);
    function Import(symbol) {
        var _this = _super.call(this) || this;
        _this.symbol = symbol;
        return _this;
    }
    /**
     * Parses a symbol reference pattern to create a symbol. The pattern
     * allows the simple definition of all symbol types including any possible
     * import variation. If the spec to parse does not follow the proper format
     * an implicit symbol is created from the unparsed spec.
     *
     * Pattern: `symbolName? importType modulePath (#<augmentedSymbolName>)?`
     *
     * Where:
     *
     * - `symbolName` is any legal JS/TS symbol. If none, we use the last part of the module path as a guess.
     * - `importType` is one of `@` or `*` or `+`, where:
     *    - `@` is a named import
     *       - `Foo@bar` becomes `import { Foo } from 'bar'`
     *    - `*` is a star import,
     *       - `*Foo` becomes `import * as Foo from 'Foo'`
     *       - `Foo*foo` becomes `import * as Foo from 'foo'`
     *    - `+` is an implicit import
     *       - E.g. `Foo+foo` becomes `import 'foo'`
     * - `modulePath` is a path
     *    - E.g. `<filename>(/<filename)*`
     * - augmentedSymbolName = `[a-zA-Z0-9_]+`
     *
     *        Any valid symbol name that represents the symbol that is being augmented. For example,
     *        the import `rxjs/add/observable/from` attaches the `from` method to the `Observable` class.
     *        To import it correctly the spec should be `+rxjs/add/observable/from#Observable`. Adding this
     *        parameter to augmented imports ensures they are output only when the symbol being augmented
     *        is actually used.
     *
     *
     * @param spec Symbol spec to parse.
     * @return Parsed symbol specification
     */
    Import.from = function (spec) {
        var matched = spec.match(importPattern);
        if (matched === null) {
            matched = spec.match(sourceImportPattern);
        }
        if (matched != null) {
            var modulePath = matched[3];
            var kind = matched[2] || "@";
            var symbolName = matched[1] || (0, utils_1.last)(modulePath.split("/")) || "";
            var targetName = matched[4];
            switch (kind) {
                case "*":
                    return Import.importsAll(symbolName, modulePath);
                case "@":
                    var isTypeImport = symbolName.startsWith("t:");
                    var exportedNames = void 0;
                    if (isTypeImport) {
                        exportedNames = symbolName.substring(2).split(":");
                    }
                    else {
                        exportedNames = symbolName.split(":");
                    }
                    var exportedName = exportedNames.pop();
                    var sourceExportedName = exportedNames[0];
                    return Import.importsName(exportedName, modulePath, isTypeImport, sourceExportedName);
                case "=":
                    return Import.importsDefault(symbolName, modulePath);
                case "+":
                    return targetName
                        ? Import.augmented(symbolName, modulePath, targetName)
                        : Import.sideEffect(symbolName, modulePath);
                default:
                    throw new Error("Invalid import kind character");
            }
        }
        return Import.implicit(spec);
    };
    Import.fromMaybeString = function (spec) {
        return typeof spec === "string" ? Import.from(spec) : spec;
    };
    Import.prototype.toCodeString = function () {
        return this.symbol;
    };
    Object.defineProperty(Import.prototype, "childNodes", {
        get: function () {
            return [];
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Creates an import of all the modules exported symbols as a single
     * local named symbol
     *
     * e.g. `import * as Engine from 'templates';`
     *
     * @param localName The local name of the imported symbols
     * @param from The module to import the symbols from
     */
    Import.importsAll = function (localName, from) {
        return new ImportsAll(localName, from);
    };
    /**
     * Creates an import of a single named symbol from the module's exported
     * symbols.
     *
     * e.g. `import { Engine } from 'templates';`
     *
     * @param exportedName The symbol that is both exported and imported
     * @param from The module the symbol is exported from
     * @param typeImport whether this is an `import type` import
     */
    Import.importsName = function (exportedName, from, typeImport, sourceExportedName) {
        return new ImportsName(exportedName, from, sourceExportedName, typeImport);
    };
    /**
     * Creates a symbol that is brought in by a whole module import
     * that "augments" an existing symbol.
     *
     * e.g. `import 'rxjs/add/operator/flatMap'`
     *
     * @param symbolName The augmented symbol to be imported
     * @param from The entire import that does the augmentation
     * @param target The symbol that is augmented
     */
    Import.augmented = function (symbolName, from, target) {
        return new Augmented(symbolName, from, target);
    };
    /**
     * Creates a symbol that is brought in as a side effect of
     * an import.
     *
     * e.g. `import 'mocha'`
     *
     * @param symbolName The symbol to be imported
     * @param from The entire import that does the augmentation
     */
    Import.sideEffect = function (symbolName, from) {
        return new SideEffect(symbolName, from);
    };
    /**
     * An implied symbol that does no tracking of imports
     *
     * @param name The implicit symbol name
     */
    Import.implicit = function (name) {
        return new Implicit(name);
    };
    /**
     * Creates an import of a single named symbol from the module's exported
     * default.
     *
     * e.g. `import Engine from 'engine';`
     *
     * @param exportedName The symbol that is both exported and imported
     * @param from The module the symbol is exported from
     */
    Import.importsDefault = function (exportedName, from) {
        return new ImportsDefault(exportedName, from);
    };
    return Import;
}(Node_1.Node));
exports.Import = Import;
/**
 * Non-imported symbol
 */
var Implicit = /** @class */ (function (_super) {
    __extends(Implicit, _super);
    function Implicit(symbol) {
        var _this = _super.call(this, symbol) || this;
        _this.source = undefined;
        return _this;
    }
    return Implicit;
}(Import));
exports.Implicit = Implicit;
/** Common base class for imported symbols. */
var Imported = /** @class */ (function (_super) {
    __extends(Imported, _super);
    /** The symbol is the imported symbol, i.e. `BarClass`, and source is the path it comes from. */
    function Imported(symbol, source) {
        var _this = _super.call(this, source) || this;
        _this.symbol = symbol;
        _this.source = source;
        return _this;
    }
    return Imported;
}(Import));
exports.Imported = Imported;
/**
 * Imports a single named symbol from the module's exported
 * symbols.
 *
 * E.g.:
 *
 * `import { Engine } from 'templates'` or
 * `import { Engine as Engine2 } from 'templates'`
 */
var ImportsName = /** @class */ (function (_super) {
    __extends(ImportsName, _super);
    /**
     * @param symbol
     * @param source
     * @param sourceSymbol is the optional original symbol, i.e if we're renaming the symbol it is `Engine`
     * @param typeImport whether this is an `import type` import
     */
    function ImportsName(symbol, source, sourceSymbol, typeImport) {
        var _this = _super.call(this, symbol, source) || this;
        _this.sourceSymbol = sourceSymbol;
        _this.typeImport = typeImport;
        return _this;
    }
    ImportsName.prototype.toImportPiece = function () {
        return this.sourceSymbol
            ? "".concat(this.sourceSymbol, " as ").concat(this.symbol)
            : this.symbol;
    };
    return ImportsName;
}(Imported));
exports.ImportsName = ImportsName;
/**
 * Imports a single named symbol from the module's exported
 * default.
 *
 * e.g. `import Engine from 'engine';`
 */
var ImportsDefault = /** @class */ (function (_super) {
    __extends(ImportsDefault, _super);
    function ImportsDefault(symbol, source) {
        return _super.call(this, symbol, source) || this;
    }
    return ImportsDefault;
}(Imported));
exports.ImportsDefault = ImportsDefault;
/**
 * Imports all of the modules exported symbols as a single
 * named symbol
 *
 * e.g. `import * as Engine from 'templates';`
 */
var ImportsAll = /** @class */ (function (_super) {
    __extends(ImportsAll, _super);
    function ImportsAll(symbol, source) {
        return _super.call(this, symbol, source) || this;
    }
    return ImportsAll;
}(Imported));
exports.ImportsAll = ImportsAll;
/**
 * A symbol that is brought in by a whole module import
 * that "augments" an existing symbol.
 *
 * e.g. `import 'rxjs/add/operator/flatMap'`
 */
var Augmented = /** @class */ (function (_super) {
    __extends(Augmented, _super);
    function Augmented(symbol, source, augmented) {
        var _this = _super.call(this, symbol, source) || this;
        _this.augmented = augmented;
        return _this;
    }
    return Augmented;
}(Imported));
exports.Augmented = Augmented;
/**
 * A symbol that is brought in as a side effect of an import.
 *
 * E.g. `from("Foo+mocha")` will add `import 'mocha'`
 */
var SideEffect = /** @class */ (function (_super) {
    __extends(SideEffect, _super);
    function SideEffect(symbol, source) {
        return _super.call(this, symbol, source) || this;
    }
    return SideEffect;
}(Imported));
exports.SideEffect = SideEffect;
/** Generates the `import ...` lines for the given `imports`. */
function emitImports(imports, ourModulePath, importMappings) {
    if (imports.length == 0) {
        return "";
    }
    var result = "";
    var augmentImports = (0, utils_1.groupBy)(filterInstances(imports, Augmented), function (a) { return a.augmented; });
    // Group the imports by source module they're imported from
    var importsByModule = (0, utils_1.groupBy)(imports.filter(function (it) {
        return it.source !== undefined &&
            // Ignore imports that are in our own file
            !(it instanceof ImportsName &&
                it.definedIn &&
                sameModule(it.definedIn, ourModulePath));
    }), function (it) { return it.source; });
    // Output each source module as one line
    Object.entries(importsByModule).forEach(function (_a) {
        var modulePath = _a[0], imports = _a[1];
        // Skip imports from the current module
        if (sameModule(ourModulePath, modulePath)) {
            return;
        }
        if (modulePath in importMappings) {
            modulePath = importMappings[modulePath];
        }
        var importPath = maybeRelativePath(ourModulePath, modulePath);
        // Output star imports individually
        unique(filterInstances(imports, ImportsAll).map(function (i) { return i.symbol; })).forEach(function (symbol) {
            result += "import * as ".concat(symbol, " from '").concat(importPath, "';\n");
            var augments = augmentImports[symbol];
            if (augments) {
                augments.forEach(function (augment) { return (result += "import '".concat(augment.source, "';\n")); });
            }
        });
        // Partition named imported into `import type` vs. regular imports
        var allNames = filterInstances(imports, ImportsName);
        var names = unique(allNames.filter(function (i) { return !i.typeImport; }).map(function (it) { return it.toImportPiece(); }));
        var def = unique(filterInstances(imports, ImportsDefault).map(function (it) { return it.symbol; }));
        // Output named imports as a group
        if (names.length > 0 || def.length > 0) {
            var namesPart = names.length > 0 ? ["{ ".concat(names.join(", "), " }")] : [];
            var defPart = def.length > 0 ? [def[0]] : [];
            result += "import ".concat(__spreadArray(__spreadArray([], defPart, true), namesPart, true).join(", "), " from '").concat(importPath, "';\n");
            __spreadArray(__spreadArray([], names, true), def, true).forEach(function (name) {
                var augments = augmentImports[name];
                if (augments) {
                    augments.forEach(function (augment) { return (result += "import '".concat(augment.source, "';\n")); });
                }
            });
        }
        var typeImports = unique(allNames
            .filter(function (i) { return i.typeImport; })
            .map(function (it) { return it.toImportPiece(); })
            // If the `import type` is already used as a concrete import, just use that
            .filter(function (p) { return !names.includes(p); }));
        if (typeImports.length > 0) {
            result += "import type { ".concat(typeImports.join(", "), " } from '").concat(importPath, "';\n");
        }
    });
    var sideEffectImports = (0, utils_1.groupBy)(filterInstances(imports, SideEffect), function (a) { return a.source; });
    Object.keys(sideEffectImports).forEach(function (it) { return (result += "import '".concat(it, "';\n")); });
    return result;
}
exports.emitImports = emitImports;
function filterInstances(list, t) {
    return list.filter(function (e) { return e instanceof t; });
}
function unique(list) {
    return list; //[...new Set(list)];
}
function maybeRelativePath(outputPath, importPath) {
    if (!importPath.startsWith("./")) {
        return importPath;
    }
    importPath = path.normalize(importPath);
    outputPath = path.normalize(outputPath);
    var outputPathDir = path.dirname(outputPath);
    var relativePath = path
        .relative(outputPathDir, importPath)
        .split(path.sep)
        .join(path.posix.sep);
    if (!relativePath.startsWith(".")) {
        // ensure the js compiler recognizes this is a relative path.
        relativePath = "./" + relativePath;
    }
    return relativePath;
}
exports.maybeRelativePath = maybeRelativePath;
/** Checks if `path1 === path2` despite minor path differences like `./foo` and `foo`. */
function sameModule(path1, path2) {
    // TypeScript: import paths ending in .js and .ts are resolved to the .ts file.
    // Check the base paths (without the .js or .ts suffix).
    var _a = [path1, path2].map(function (p) {
        return p.replace(/\.[tj]sx?/, "");
    }), basePath1 = _a[0], basePath2 = _a[1];
    return (basePath1 === basePath2 ||
        path.resolve(basePath1) === path.resolve(basePath2));
}
exports.sameModule = sameModule;
//# sourceMappingURL=Import.js.map