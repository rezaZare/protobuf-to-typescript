import * as protobuf from "protobufjs";
import { FileInfoType, ImportedType, PathInfo } from "../model";
import { Method } from "./method";
export declare class Service {
    methods: Method[];
    filepath: PathInfo;
    service: protobuf.Service;
    constructor(element: any, filepath: PathInfo);
    generate(importedType?: ImportedType[]): string;
    getService(element: any): protobuf.Service;
    generateCode(apiName: string, pbServiceName: string, pbClientImport: any, pbServiceImport: any, globalImport: any): string;
    getAllMethodCode(): string;
    generateClientCode(apiName: string, pbServiceName: string): string;
    typeReview(internalTypes: string[], importedTypes: ImportedType[]): void;
}
export declare function reviewServiceType(fileBlocks: FileInfoType[]): FileInfoType[];
