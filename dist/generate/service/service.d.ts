import protobuf from "protobufjs";
import { Code } from "ts-poet";
import { FileInfoType, ImportedType, PathInfo } from "../model";
import { Method } from "./method";
export declare class Service {
    methods: Method[];
    filepath: PathInfo;
    service: protobuf.Service;
    constructor(element: any, filepath: PathInfo);
    generate(importedType?: ImportedType[]): Code;
    getService(element: any): protobuf.Service;
    generateCode(apiName: string, pbServiceName: string, pbImport: any, pbServiceImport: any, globalImport: any): Code;
    getAllMethodCode(): string;
    generateClientCode(apiName: string, pbServiceName: string): Code;
    typeReview(internalTypes: string[], importedTypes: ImportedType[]): void;
}
export declare function reviewServiceType(fileBlocks: FileInfoType[]): FileInfoType[];
