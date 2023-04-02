import { FileInfoType, GlobalFilesType } from "../generate/model";
export declare class FileUtil {
    read(path: any): Promise<string>;
    write(files: FileInfoType[]): Promise<void>;
    writeGlobalFiles(model: GlobalFilesType, path: string): Promise<void>;
}
