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
exports.Literal = void 0;
var Node_1 = require("./Node");
var ConditionalOutput_1 = require("./ConditionalOutput");
var is_plain_object_1 = require("./is-plain-object");
/**
 * A literal source representation of the provided object.
 */
var Literal = /** @class */ (function (_super) {
    __extends(Literal, _super);
    function Literal(object) {
        var _this = _super.call(this) || this;
        _this.tokens = flatten(object);
        return _this;
    }
    Object.defineProperty(Literal.prototype, "childNodes", {
        get: function () {
            return this.tokens;
        },
        enumerable: false,
        configurable: true
    });
    Literal.prototype.toCodeString = function (used) {
        return this.tokens
            .map(function (node) {
            if (typeof node === "string")
                return node;
            if (node instanceof Node_1.Node)
                return node.toCodeString(used);
            return "";
        })
            .join(" ");
    };
    return Literal;
}(Node_1.Node));
exports.Literal = Literal;
function flatten(o) {
    if (typeof o === "undefined") {
        return ["undefined"];
    }
    if (typeof o === "object" && o != null) {
        if (o instanceof Node_1.Node || o instanceof ConditionalOutput_1.MaybeOutput) {
            return [o];
        }
        else if (Array.isArray(o)) {
            var nodes = ["["];
            for (var i = 0; i < o.length; i++) {
                if (i !== 0)
                    nodes.push(",");
                nodes.push.apply(nodes, flatten(o[i]));
            }
            nodes.push("]");
            return nodes;
        }
        else if ((0, is_plain_object_1.isPlainObject)(o)) {
            var nodes = ["{"];
            var entries = Object.entries(o);
            for (var i = 0; i < entries.length; i++) {
                if (i !== 0)
                    nodes.push(",");
                var _a = entries[i], key = _a[0], value = _a[1];
                nodes.push.apply(nodes, __spreadArray([JSON.stringify(key), ":"], flatten(value), false));
            }
            nodes.push("}");
            return nodes;
        }
    }
    return [JSON.stringify(o)];
}
//# sourceMappingURL=Literal.js.map