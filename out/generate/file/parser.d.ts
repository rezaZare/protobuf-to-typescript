/// <reference types="node" />
declare const fs: any;
declare var path: any;
declare var util: any;
declare var log_file: any;
declare var log_stdout: NodeJS.WriteStream & {
    fd: 1;
};
declare class Block {
    constructor(_content: string, _isNamespace: boolean, _isClass: boolean, _name: string, _blocks: Block[], _level: number, _ended: boolean);
    content: string;
    isNamespace: boolean;
    isClass: boolean;
    name: string;
    blocks: Block[];
    level: number;
    ended: boolean;
}
interface ReplaceInfo {
    str: string;
    replaceStr: string;
}
declare const newLine = "\r\n";
declare let replaces: ReplaceInfo[];
declare let replaceBuffer: ReplaceInfo[];
declare let replaceGlobalFile: ReplaceInfo[];
declare let imports: string[];
declare function main(): Promise<void>;
declare function generate(rootpath: any, savePath: any): Promise<void>;
declare function grpcToBlock(rootPath: any, rootFileName: any, saveFilePath: any, generate: boolean): Promise<string[]>;
declare function getBlocks(block: string): string[];
declare function blockToObject(_block: string): Block[];
declare function generateNewFile(block: Block, parent?: Block): string;
declare function getLines(block: string): string[];
declare function getName(line: string): string;
interface FileAndDirectory {
    name: string;
    isDirectory: boolean;
}
declare function getAllFileAndDirectory(root: any): Promise<FileAndDirectory[]>;
declare function replaceOnBlock(block: string): string;
declare function addBuffer(str: string, replaceStr: any): void;
declare function replaceWithBuffer(block: string): string;
declare function replaceGlobal(block: string): string;
declare function getImports(rootPath: string): Promise<string>;
declare function bufferImportedBlock(rootPath: String, _imported: string): Promise<void>;
declare function getPath(_imported: string, root: String): {
    name: string;
    path: string;
};
