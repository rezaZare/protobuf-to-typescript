export class TypeReview {
    serviceRequestType(typeName, internalTypes, importedTypes) {
        if (typeName.includes(".")) {
        }
        else {
            return typeName;
        }
        return typeName;
    }
    serviceResponseType(typeName, internalTypes, importedTypes) {
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
    }
}
//# sourceMappingURL=typeReview.js.map