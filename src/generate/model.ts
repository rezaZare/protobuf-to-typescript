import { Code, Import } from "ts-poet";
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
  importedFiledType?: ListOfFileTypes;
};
export class ListOfFileTypes {
  isNamespace: boolean;
  name: string;
  nested?: ListOfFileTypes[];
  fields?: FieldType[];
  type?: blockType;
}
export class CodeBlock {
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
  Service?: Service;
};

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
