import { Import } from "./Import";
import { Code, Def } from "./Code";
import { Node } from "./Node";
import { ConditionalOutput } from "./ConditionalOutput";
export { Code } from "./Code";
export { Import } from "./Import";
export { saveFiles, SaveFilesOpts, CodegenFile } from "./saveFiles";
/** A template literal to format code and auto-organize imports. */
export declare function code(literals: TemplateStringsArray, ...placeholders: unknown[]): Code;
export declare function literalOf(object: unknown): Node;
export declare function arrayOf(...elements: unknown[]): Node;
export declare function joinCode(chunks: Code[], opts?: {
    on?: string;
    trim?: boolean;
}): Code;
/** Creates an import that will be auto-imported at the top of the output file. */
export declare function imp(spec: string, opts?: {
    definedIn?: string;
}): Import;
/** Defines `symbol` as being locally defined in the file, to avoid import collisions. */
export declare function def(symbol: string): Def;
/** Creates a conditionally-output code snippet. */
export declare function conditionalOutput(usageSite: string, declarationSite: Code): ConditionalOutput;
