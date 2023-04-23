import { FileInfoType, ImportedType } from "../model";
export declare class FileInfo {
    files: FileInfoType[];
    allType: ImportedType[];
    load(root: any, grpcPath: any, outPath: any, globalpath: any): Promise<void>;
    private loadInfo;
    private loadProtobuf;
    private getFileTypes;
    private getAllType;
    private getImportedTypes;
    getProtoIgnoreList(): Promise<string[]>;
    private isValidFile;
}
