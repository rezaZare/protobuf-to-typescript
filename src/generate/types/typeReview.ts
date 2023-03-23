import { ImportedType, ListOfFileTypes } from "../model";

import { getTypeListByTypes } from "./typeUtil";

export class TypeReview {
  serviceRequestType(
    typeName: string,
    internalTypes: string[],
    importedTypes: ImportedType[]
  ) {
    if (typeName.includes(".")) {
    } else {
      return typeName;
    }
    return typeName;
  }
  serviceResponseType(
    typeName: string,
    internalTypes: string[],
    importedTypes: ImportedType[]
  ) {
    if (!typeName.includes(".")) {
      if (internalTypes.includes(typeName)) {
        return typeName;
      } else if (internalTypes.includes(typeName + "." + typeName)) {
        return typeName + "." + typeName;
      }
    } else {
      if (typeName == "google.protobuf.Empty") {
        return "google.protobuf.Empty";
      } else {
      }
    }

    return typeName;
  }
}
