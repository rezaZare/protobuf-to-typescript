import { Import } from "./Import";
import { Code, Def } from "./Code";
import { ConditionalOutput } from "./ConditionalOutput";
import { isPlainObject } from "./is-plain-object";
import { Literal } from "./Literal";
export { Code } from "./Code";
export { Import } from "./Import";
export { saveFiles } from "./saveFiles";
/** A template literal to format code and auto-organize imports. */
export function code(literals, ...placeholders) {
    return new Code(literals, placeholders.map((p) => {
        if (isPlainObject(p)) {
            return literalOf(p);
        }
        else {
            return p;
        }
    }));
}
export function literalOf(object) {
    return new Literal(object);
}
export function arrayOf(...elements) {
    return literalOf(elements);
}
export function joinCode(chunks, opts = {}) {
    const { on = "", trim = true } = opts;
    const literals = [""];
    for (let i = 0; i < chunks.length - 1; i++) {
        literals.push(on);
    }
    literals.push("");
    if (trim) {
        chunks.forEach((c) => (c.trim = true));
    }
    return new Code(literals, chunks);
}
/** Creates an import that will be auto-imported at the top of the output file. */
export function imp(spec, opts = {}) {
    const sym = Import.from(spec);
    if (opts && opts.definedIn) {
        sym.definedIn = opts.definedIn;
    }
    return sym;
}
/** Defines `symbol` as being locally defined in the file, to avoid import collisions. */
export function def(symbol) {
    return new Def(symbol);
}
/** Creates a conditionally-output code snippet. */
export function conditionalOutput(usageSite, declarationSite) {
    return new ConditionalOutput(usageSite, declarationSite);
}
//# sourceMappingURL=index.js.map