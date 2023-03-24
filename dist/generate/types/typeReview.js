"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeReview = void 0;
var TypeReview = /** @class */ (function () {
    function TypeReview() {
    }
    TypeReview.prototype.serviceRequestType = function (typeName, internalTypes, importedTypes) {
        if (typeName.includes(".")) {
        }
        else {
            return typeName;
        }
        return typeName;
    };
    TypeReview.prototype.serviceResponseType = function (typeName, internalTypes, importedTypes) {
        if (!typeName.includes(".")) {
            if (internalTypes.includes(typeName)) {
                return typeName;
            }
            else if (internalTypes.includes(typeName + "." + typeName)) {
                return typeName + "." + typeName;
            }
        }
        else {
            if (typeName == "google.protobuf.Empty") {
                return "google.protobuf.Empty";
            }
            else {
            }
        }
        return typeName;
    };
    return TypeReview;
}());
exports.TypeReview = TypeReview;
//# sourceMappingURL=typeReview.js.map