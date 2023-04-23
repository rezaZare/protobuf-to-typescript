import * as protobuf from "protobufjs";
export declare class ServiceMethod {
    name: string;
    requestType: string;
    responseType: string;
    requestStream?: boolean;
    responseStream?: boolean;
    serviceName: string;
    packageName: string;
    constructor(name: string, requestType: string, responseType: string, serviceName: string, packageName: string);
    getCode(): string;
}
export declare class ServiceGenerator {
    methods: ServiceMethod[];
    globalPath: string;
    fileName: string;
    nameSpace: string[];
    constructor(root: protobuf.Root, outDir: string, globalDir: string);
    getCode(): string;
    getService(element: any, nameSpace?: string[]): ServiceInfo;
}
interface ServiceInfo {
    service: protobuf.Service;
    nameSpace: string[];
}
export declare function getIndentSpaces(level?: number): string;
export {};
