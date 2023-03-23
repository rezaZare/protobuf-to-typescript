import { FileUtil } from "../utils/fileUtil";
import { FileInfoType, ImportedType, ProtoToTsModel } from "./model";
import { typeCheckAndFix } from "./types/validationType";
import { FileInfo } from "./file/fileInfo";
import { GenerateGlobalFiles } from "./global/GenerateGlobalFiles";
import { reviewServiceType } from "./service/service";

export async function protoToTs(model: ProtoToTsModel) {
  let files = await new FileInfo();
  await files.load(
    model.protobufPath,
    model.generatedTypescriptPath,
    model.outPath,
    model.globalFilePath
  );

  debugger;
  files.files = typeCheckAndFix(files.files);
  files.files = reviewServiceType(files.files);

  if (files.files.length > 0) {
    let fileUtil = new FileUtil();
    fileUtil.writeGlobalFiles(GenerateGlobalFiles(), model.globalFilePath);
    fileUtil.write(files.files);
  }
}
