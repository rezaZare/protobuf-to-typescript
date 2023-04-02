import { Node } from "./Node";
import { MaybeOutput } from "./ConditionalOutput";
import { isPlainObject } from "./is-plain-object";
/**
 * A literal source representation of the provided object.
 */
export class Literal extends Node {
    constructor(object) {
        super();
        this.tokens = flatten(object);
    }
    get childNodes() {
        return this.tokens;
    }
    toCodeString(used) {
        return this.tokens
            .map((node) => {
            if (typeof node === "string")
                return node;
            if (node instanceof Node)
                return node.toCodeString(used);
            return "";
        })
            .join(" ");
    }
}
function flatten(o) {
    if (typeof o === "undefined") {
        return ["undefined"];
    }
    if (typeof o === "object" && o != null) {
        if (o instanceof Node || o instanceof MaybeOutput) {
            return [o];
        }
        else if (Array.isArray(o)) {
            const nodes = ["["];
            for (let i = 0; i < o.length; i++) {
                if (i !== 0)
                    nodes.push(",");
                nodes.push(...flatten(o[i]));
            }
            nodes.push("]");
            return nodes;
        }
        else if (isPlainObject(o)) {
            const nodes = ["{"];
            const entries = Object.entries(o);
            for (let i = 0; i < entries.length; i++) {
                if (i !== 0)
                    nodes.push(",");
                const [key, value] = entries[i];
                nodes.push(JSON.stringify(key), ":", ...flatten(value));
            }
            nodes.push("}");
            return nodes;
        }
    }
    return [JSON.stringify(o)];
}
//# sourceMappingURL=Literal.js.map