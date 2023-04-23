"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeCheck = void 0;
var TypeCheck = /** @class */ (function () {
    function TypeCheck(_files) {
        this.files = _files;
    }
    TypeCheck.prototype.checkBlockType = function () {
        this.files = this.internalCheck(this.files);
        this.files = this.importedTypecheck(this.files);
        return this.files;
    };
    TypeCheck.prototype.internalCheck = function (files) {
        var _a;
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var file = files_1[_i];
            if (((_a = file === null || file === void 0 ? void 0 : file.nested) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                this.internalCheck(file.nested);
            }
            else {
                file.codeBlocks.typeCheck(file.imports);
            }
        }
        return files;
    };
    TypeCheck.prototype.importedTypecheck = function (files) {
        // for (let file of files) {
        //   if (file?.nested?.length > 0) {
        //     this.importedTypecheck(file.nested);
        //   } else {
        //     file.codeBlocks.typeCheck(file.imports);
        //   }
        // }
        return files;
    };
    return TypeCheck;
}());
exports.TypeCheck = TypeCheck;
//# sourceMappingURL=typeCheck.js.map