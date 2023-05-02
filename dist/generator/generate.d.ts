import { FileInfo } from "./index";
export declare function generate(protoFile: string, outputDir: string, importedPath?: string[], globalDir?: string, needGoogleImport?: boolean, finalFileName?: string): Promise<void>;
export declare function generateAllinOneFile(protoFiles: string[], outputDir: string, name: string): Promise<void>;
export declare function generateIndex(name: string, outDir: any, files: FileInfo[]): Promise<void>;
