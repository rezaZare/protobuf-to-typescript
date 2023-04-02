import { ImportedType } from "../model";
export declare class TypeReview {
    serviceRequestType(typeName: string, internalTypes: string[], importedTypes: ImportedType[]): string;
    serviceResponseType(typeName: string, internalTypes: string[], importedTypes: ImportedType[]): string;
}
