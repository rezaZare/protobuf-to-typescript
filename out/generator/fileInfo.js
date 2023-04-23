"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileInfo = void 0;
var FileInfo = /** @class */ (function () {
    function FileInfo() {
    }
    FileInfo.prototype.getInfo = function () {
        var _a;
        return {
            code: this.codeBlocks,
            path: (_a = this.pathInfo.generatedTypescriptPath) !== null && _a !== void 0 ? _a : "",
        };
    };
    FileInfo.prototype.getCode = function () {
        var codes = [];
        codes.push.apply(codes, this.getImportCode());
        codes.push("\n");
        codes.push.apply(codes, this.codeBlocks.getCode());
        codes.push(this.services.getCode(this.imports));
        return codes;
    };
    FileInfo.prototype.getImportCode = function () {
        var _a;
        var codes = [];
        if (((_a = this.imports) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            for (var _i = 0, _b = this.imports; _i < _b.length; _i++) {
                var imp = _b[_i];
                codes.push(imp.importStr);
            }
        }
        return codes;
    };
    return FileInfo;
}());
exports.FileInfo = FileInfo;
//# sourceMappingURL=fileInfo.js.map