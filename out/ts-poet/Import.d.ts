import { Node } from "./Node";
export declare const importType = "[*@+=]";
/**
 * Specifies a symbol and its related origin, either via import or implicit/local declaration.
 */
export declare abstract class Import extends Node {
    symbol: string;
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
    static from(spec: string): Import;
    static fromMaybeString(spec: string | Import): Import;
    /**
     * Defined if the symbol is typically imported from a barrel/etc. path, but is technically defined in another file.
     *
     * We need to know this in case the "this comes from the barrel" type ends up being used in the file where
     * the symbol itself is defined, i.e. we don't need an import in that case.
     */
    definedIn?: string;
    protected constructor(symbol: string);
    toCodeString(): string;
    get childNodes(): unknown[];
    abstract source: string | undefined;
    /**
     * Creates an import of all the modules exported symbols as a single
     * local named symbol
     *
     * e.g. `import * as Engine from 'templates';`
     *
     * @param localName The local name of the imported symbols
     * @param from The module to import the symbols from
     */
    static importsAll(localName: string, from: string): Import;
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
    static importsName(exportedName: string, from: string, typeImport: boolean, sourceExportedName?: string): Import;
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
    static augmented(symbolName: string, from: string, target: string): Import;
    /**
     * Creates a symbol that is brought in as a side effect of
     * an import.
     *
     * e.g. `import 'mocha'`
     *
     * @param symbolName The symbol to be imported
     * @param from The entire import that does the augmentation
     */
    static sideEffect(symbolName: string, from: string): Import;
    /**
     * An implied symbol that does no tracking of imports
     *
     * @param name The implicit symbol name
     */
    static implicit(name: string): Import;
    /**
     * Creates an import of a single named symbol from the module's exported
     * default.
     *
     * e.g. `import Engine from 'engine';`
     *
     * @param exportedName The symbol that is both exported and imported
     * @param from The module the symbol is exported from
     */
    static importsDefault(exportedName: string, from: string): Import;
}
/**
 * Non-imported symbol
 */
export declare class Implicit extends Import {
    constructor(symbol: string);
    source: any;
}
/** Common base class for imported symbols. */
export declare abstract class Imported extends Import {
    symbol: string;
    source: string;
    /** The symbol is the imported symbol, i.e. `BarClass`, and source is the path it comes from. */
    protected constructor(symbol: string, source: string);
}
/**
 * Imports a single named symbol from the module's exported
 * symbols.
 *
 * E.g.:
 *
 * `import { Engine } from 'templates'` or
 * `import { Engine as Engine2 } from 'templates'`
 */
export declare class ImportsName extends Imported {
    sourceSymbol?: string;
    typeImport?: boolean;
    /**
     * @param symbol
     * @param source
     * @param sourceSymbol is the optional original symbol, i.e if we're renaming the symbol it is `Engine`
     * @param typeImport whether this is an `import type` import
     */
    constructor(symbol: string, source: string, sourceSymbol?: string, typeImport?: boolean);
    toImportPiece(): string;
}
/**
 * Imports a single named symbol from the module's exported
 * default.
 *
 * e.g. `import Engine from 'engine';`
 */
export declare class ImportsDefault extends Imported {
    constructor(symbol: string, source: string);
}
/**
 * Imports all of the modules exported symbols as a single
 * named symbol
 *
 * e.g. `import * as Engine from 'templates';`
 */
export declare class ImportsAll extends Imported {
    constructor(symbol: string, source: string);
}
/**
 * A symbol that is brought in by a whole module import
 * that "augments" an existing symbol.
 *
 * e.g. `import 'rxjs/add/operator/flatMap'`
 */
export declare class Augmented extends Imported {
    augmented: string;
    constructor(symbol: string, source: string, augmented: string);
}
/**
 * A symbol that is brought in as a side effect of an import.
 *
 * E.g. `from("Foo+mocha")` will add `import 'mocha'`
 */
export declare class SideEffect extends Imported {
    constructor(symbol: string, source: string);
}
/** Generates the `import ...` lines for the given `imports`. */
export declare function emitImports(imports: Import[], ourModulePath: string, importMappings: {
    [key: string]: string;
}): string;
export declare function maybeRelativePath(outputPath: string, importPath: string): string;
/** Checks if `path1 === path2` despite minor path differences like `./foo` and `foo`. */
export declare function sameModule(path1: string, path2: string): boolean;
