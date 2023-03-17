import { Import } from "ts-poet";

export type ImportedType = {
  name: string;
  fileName: string;
  types: ListOfFileTypes[];
  fieldType: FieldType[];
  import?: Import; // use imp ts-pooet
};

export enum blockType {
  NAMESPACE = 1,
  TYPE = 2,
  ENUM = 3,
  METHOD = 4,
}
export type FieldType = {
  name: string;
  type?: string;
  isRepeated?: boolean;
  isoptional?: boolean;
  value?: string; //use for enum
  typeValid: boolean;
  isSystemType?: boolean;
  needImport?: boolean;
};
export interface ListOfFileTypes {
  isNamespace: boolean;
  name: string;
  nested?: ListOfFileTypes[];
  fieldType?: FieldType;
}
export interface CodeBlock {
  name: string;
  blockType: blockType;
  fields?: FieldType[];
  blocks?: CodeBlock[];
}

export type FileInfoType = {
  name: string;
  path: PathInfo;
  isDirectory: boolean;
  nested?: FileInfoType[];
  imports?: Import[];
  codeBlock: CodeBlock[];
  typeList: ListOfFileTypes[];
  importedType?: ImportedType[];
};

export type PathInfo = {
  tsName: string;
  pbName: string;
  grpcPb: string;
  grpcServicePb: String;
  outPath: string;
  path: string;
  grpcPath: string;
  pathResolved?: string;
};
