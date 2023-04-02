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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaybeOutput = exports.ConditionalOutput = void 0;
var Node_1 = require("./Node");
/**
 * Helps output conditional helper methods.
 *
 * The `ConditionalOutput` concept is split into a usage site and a declaration
 * site, i.e. declaring a `function someHelper() { ... }`, and calling it
 * like `someHelper()`.
 *
 * While generating code, you can make usage sites by using `someHelper` as
 * a placeholder, and then output the declaration with `someHelper.ifUsed`
 * to output the declaration conditionally only if `someHelper` has been
 * seen in the tree.
 *
 * ```typescript
 * const someHelper = conditionalOutput(
 *   "someHelper",
 *   code`function someHelper(n: number) { return n * 2; } `
 * );
 *
 * const code = code`
 *   ${someHelper}(1);
 *
 *   ${someHelper.ifUsed}
 * `
 * ```
 *
 * In the above scenario, it's obvious that `someHelper` is being used, but in
 * code generators with misc configuration options and conditional output paths
 * (i.e. should I output a date helper if dates are even used for this file?)
 * it is harder to tell when exactly a helper should/should not be included.
 */
var ConditionalOutput = /** @class */ (function (_super) {
    __extends(ConditionalOutput, _super);
    // A given ConditionalOutput const could be used in multiple code
    // parents, and so we don't want to use instance state to store
    // "should I be output or not", b/c it depends on the containing tree.
    function ConditionalOutput(usageSiteName, declarationSiteCode) {
        var _this = _super.call(this) || this;
        _this.usageSiteName = usageSiteName;
        _this.declarationSiteCode = declarationSiteCode;
        return _this;
    }
    Object.defineProperty(ConditionalOutput.prototype, "ifUsed", {
        /** Returns the declaration code, typically to be included near the bottom of your output as top-level scope. */
        get: function () {
            return new MaybeOutput(this, this.declarationSiteCode);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ConditionalOutput.prototype, "childNodes", {
        get: function () {
            return [this.declarationSiteCode];
        },
        enumerable: false,
        configurable: true
    });
    ConditionalOutput.prototype.toCodeString = function () {
        return this.usageSiteName;
    };
    return ConditionalOutput;
}(Node_1.Node));
exports.ConditionalOutput = ConditionalOutput;
var MaybeOutput = /** @class */ (function () {
    function MaybeOutput(parent, code) {
        this.parent = parent;
        this.code = code;
    }
    return MaybeOutput;
}());
exports.MaybeOutput = MaybeOutput;
//# sourceMappingURL=ConditionalOutput.js.map