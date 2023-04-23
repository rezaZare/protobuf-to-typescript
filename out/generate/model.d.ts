import { ImportFiles } from "./imports/import";
import { Service } from "./service/service";
export type ProtoToTsModel = {
    protobufPath: string;
    generatedTypescriptPath: string;
    outPath: string;
    globalFilePath: string;
    apiPath: string;
};
export type ImportedType = {
    name: string;
    fileName: string;
    types: ListOfFileTypes[];
    fieldType: FieldType[];
    importStr: string;
    filePath?: PathInfo;
};
export declare enum BlockType {
    NAMESPACE = 1,
    TYPE = 2,
    ENUM = 3,
    METHOD = 4
}
export type FieldType = {
    name: string;
    type?: string;
    isMap?: boolean;
    keyType?: string;
    value?: string;
    isRepeated?: boolean;
    isoptional?: boolean;
    typeValid: boolean;
    isSystemType?: boolean;
    needImport?: boolean;
    importedFiledType?: ListOfFileTypes;
};
export declare class ListOfFileTypes {
    isNamespace: boolean;
    name: string;
    nested?: ListOfFileTypes[];
    fields?: FieldType[];
    type?: BlockType;
}
export declare class CodeBlock {
    name: string;
    blockType: BlockType;
    fields?: FieldType[];
    blocks?: CodeBlock[];
}
export declare class FileInfoType {
    name: string;
    path: PathInfo;
    isDirectory: boolean;
    nested?: FileInfoType[];
    codeBlock: CodeBlock[];
    typeList: ListOfFileTypes[];
    importedType?: ImportedType[];
    importFiles: ImportFiles;
    Service?: Service;
}
export type PathInfo = {
    fileName: string;
    tsName: string;
    pbName: string;
    grpcPb: string;
    grpcServicePb: string;
    outPath: string;
    path: string;
    grpcPath: string;
    pathResolved?: string;
    globalpath: string;
};
export interface MethodType {
    name: string;
    requestType: string;
    responseType: string;
    code?: string;
}
export interface ServiceType {
    methods: MethodType[];
    code: string;
}
export type GlobalFilesType = {
    apiPathCode: string;
    enabledDevMode: string;
    metadata: string;
    responseModel: string;
    toProto: string;
};
