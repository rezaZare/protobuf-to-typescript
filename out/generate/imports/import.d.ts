import { ListOfFileTypes, PathInfo } from "../model";
export type ImportType = {
    name: string;
    fileName?: string;
    types?: ListOfFileTypes[];
    importStr?: string;
    paths?: PathInfo;
    relativePath?: string;
    isGrpcPath?: boolean;
};
export declare class ImportFiles {
    imports: ImportType[];
    constructor(elements: string[], pbPath: PathInfo);
}
