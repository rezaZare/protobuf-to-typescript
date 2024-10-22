export interface FileInfo {
    nested?: FileInfo[];
    fileName: string;
    name: string;
    path: Path;
    imports: Import[];
    package: string;
}
interface Path {
    inPath: string;
    outPath: string;
}
interface Import {
    fileName: string;
    protoPath: string;
    path?: Path;
    notDetect: boolean;
}
export declare function protoToTs(name: string, protoDir: string, outDir: string, endPoint: string, unauthorizedPath: string): Promise<void>;
export declare function loadFile(protoDir: string, outDir: string): Promise<FileInfo[]>;
export {};
