export declare function getObjectKeys<T>(target: T): (keyof T)[];
export declare function isBoolean<T>(target: T): boolean;
export declare function isStringArray(array: any): array is string[];
export type ServiceMethod = {
    name: string;
    requestType: string;
    responseType: string;
    requestStream?: boolean;
    responseStream?: boolean;
};
export type PackageService = {
    name: string;
    methods: ServiceMethod[];
};
export type Package = {
    name: string;
    services: PackageService[];
};
export type PackageDefinition = {
    files: string[];
    packages: Package[];
};
export declare function loadPackageDefinition(protoFile: string): Promise<PackageDefinition>;
export declare function generateStaticObjects(protoFiles: string[]): Promise<string>;
export declare function generateStaticDeclarations(staticObjectsFile: string): Promise<string>;
