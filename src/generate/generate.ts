import { FileUtil } from "../utils/fileUtil";
import { FileInfoType, ImportedType } from "./model";
import { typeCheckAndFix } from "../generate/types/validationType";
import { fileToBlock } from "./file/toBlock";

export async function generate(pbPath: string, grpcPath: string, outTsPath) {
  let fileBlocks = await fileToBlock(pbPath, grpcPath, outTsPath);
  let listfileType = getLisOfType(fileBlocks); //this method get all types in file and set on typeList field
  fileBlocks = getImportedTypes(fileBlocks, listfileType);

  fileBlocks = typeCheckAndFix(fileBlocks);

  debugger;
  if (fileBlocks.length > 0) {
    new FileUtil().write(fileBlocks);
  }
}

function getImportedTypes(files: FileInfoType[], allTypes: ImportedType[]) {
  files.forEach((file) => {
    if (file.isDirectory) {
      file.nested = getImportedTypes(file.nested, allTypes);
    } else {
      file.importedType = [];
      file.imports.forEach((imp) => {
        let spl = imp.source.split("/");
        let fileName = spl[spl.length - 1];
        let importedTypes = allTypes.filter((x) => x.fileName == fileName);

        if (importedTypes.length > 0) {
          importedTypes.forEach((item) => {
            item.name = imp.symbol;
            item.import = imp;
          });
          file.importedType.push(...importedTypes);
        }
        //'../common/types_common_v1'
      });
    }
  });
  return files;
}

function getLisOfType(files: FileInfoType[]) {
  let typeList: ImportedType[] = [];
  for (let file of files) {
    if (file.isDirectory) {
      typeList.push(...getLisOfType(file.nested));
    } else {
      if (file.typeList?.length > 0) {
        typeList.push({
          fileName: file.name,
          name: "",
          types: file.typeList,
          fieldType: [],
        });
      }
    }
  }
  return typeList;
}
