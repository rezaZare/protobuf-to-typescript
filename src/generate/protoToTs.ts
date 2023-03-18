import { FileUtil } from "../utils/fileUtil";
import { FileInfoType, ImportedType, ProtoToTsModel } from "./model";
import { typeCheckAndFix } from "./types/validationType";
import { fileToBlock } from "./file/toBlock";
import { GenerateGlobalFiles } from "./global/GenerateGlobalFiles";

export async function protoToTs(model: ProtoToTsModel) {
  let fileBlocks = await fileToBlock(
    model.protobufPath,
    model.generatedTypescriptPath,
    model.outPath,
    model.globalFilePath
  );
  let listfileType = getLisOfType(fileBlocks); //this method get all types in file and set on typeList field
  fileBlocks = getImportedTypes(fileBlocks, listfileType);
  fileBlocks = typeCheckAndFix(fileBlocks);

  debugger;
  if (fileBlocks.length > 0) {
    let fileUtil = new FileUtil();
    fileUtil.writeGlobalFiles(GenerateGlobalFiles(), model.globalFilePath);
    fileUtil.write(fileBlocks);
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
