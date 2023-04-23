import { PackageDefinition, PackageService, ServiceMethod } from "./protobuf";
export declare function getIndentSpaces(level?: number): string;
export declare function createNamedImports(names: string[], from: string): string;
export declare function createSource(statements: string[]): string;
export declare function createGrpcServiceSource(packageDefinition: PackageDefinition, staticObjectsRelativeFilename: string): string;
export declare function createServiceSource(service: PackageService, packageName: string): string;
export declare function createServiceMethodSource(method: ServiceMethod, serviceName: string, packageName: string): string;
