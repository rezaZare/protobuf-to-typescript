import { Code, Import } from "../ts-poet";
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
  import?: Import; // use imp ts-pooet
  importStr: string;
  filePath?: PathInfo;
};

export enum BlockType {
  NAMESPACE = 1,
  TYPE = 2,
  ENUM = 3,
  METHOD = 4,
}
export type FieldType = {
  name: string;
  type?: string;
  isMap?: boolean;
  keyType?: string; // key type use for map
  value?: string; //use for enum
  isRepeated?: boolean;
  isoptional?: boolean;
  typeValid: boolean;
  isSystemType?: boolean;
  needImport?: boolean;
  importedFiledType?: ListOfFileTypes;
};
export class ListOfFileTypes {
  isNamespace: boolean;
  name: string;
  nested?: ListOfFileTypes[];
  fields?: FieldType[];
  type?: BlockType;
}
export class CodeBlock {
  name: string;
  blockType: BlockType;
  fields?: FieldType[];
  blocks?: CodeBlock[];
}

export class FileInfoType {
  name: string;
  path: PathInfo;
  isDirectory: boolean;
  nested?: FileInfoType[];
  imports?: Import[];
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
  code?: Code;
}
export interface ServiceType {
  methods: MethodType[];
  code: Code;
}

export type GlobalFilesType = {
  apiPathCode: Code;
  enabledDevMode: Code;
  metadata: Code;
  responseModel: Code;
  toProto: Code;
};
