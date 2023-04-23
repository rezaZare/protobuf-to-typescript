interface FileInfo {
    nested?: FileInfo[];
    fileName: string;
    path: Path;
    imports: Import[];
}
interface Path {
    inPath: string;
    outPath: string;
}
interface Import {
    fileName: string;
    protoPath: string;
    path?: Path;
}
export declare function protoToTs(protoDir: string, outDir: string, endPoint: string): Promise<void>;
export declare function loadFile(protoDir: string, outDir: string): Promise<FileInfo[]>;
export {};
