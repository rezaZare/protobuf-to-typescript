import { FieldType, ListOfFileTypes, PathInfo } from "../model";
import path from "path";

// import "common/types_common_v1.proto";
// import "enums.proto";
// import "name_api.proto";
// import "google/protobuf/empty.proto";
// 'workflow/common/types_common_v1.proto'
//'google/protobuf/empty.proto'
export type ImportType = {
  name: string;
  fileName?: string;
  types?: ListOfFileTypes[];
  importStr?: string;
  paths?: PathInfo;
  relativePath?: string;
  isGrpcPath?: boolean;
};

export class ImportFiles {
  imports: ImportType[];
  constructor(elements: string[], pbPath: PathInfo) {
    this.imports = [];
    if (elements.length > 0) {
      for (let pathStr of elements) {
        pathStr = pathStr.replace(".proto", "");
        if (pathStr.startsWith("google")) {
          if (!this.imports.find((x) => x.name == "google")) {
            this.imports.push({
              name: "google",
              fileName: undefined,
              importStr: `import * as google from 'google-protobuf';`,
            });
          }
        } else {
          if (pathStr.includes("timestamp")) {
            debugger;
          }

          let importInfo = getFileNameFromRelativePath(pathStr);
          let fullPath = extendPath(pbPath.path, importInfo.path);
          let grpcPath = extendPath(pbPath.grpcPath, importInfo.path);
          let rp1 = getRelativePath(pbPath.path, fullPath);
          let grpcRp = getRelativePath(pbPath.path, grpcPath);

          this.imports.push({
            name: importInfo.fileName,
            fileName: importInfo.fileName + ".proto",
            relativePath: rp1,
            importStr: `import * as ${importInfo.fileName} from '${rp1}/${importInfo.fileName}';`,
          });

          this.imports.push({
            name: importInfo.fileName + "_pb",
            fileName: importInfo.fileName + "_pb.proto",
            relativePath: grpcRp,
            importStr: `import * as ${importInfo.fileName}_pb from '${grpcRp}/${importInfo.fileName}_pb';`,
            isGrpcPath: true,
          });
        }
      }
    }
  }
}

function getRelativePath(currentPath, importedPath) {
  let relativePath = path.relative(currentPath, importedPath);
  if (relativePath == "") return ".";
  return relativePath;
}

function extendPath(currentPath, relativePath: string) {
  if (relativePath == "") {
    return currentPath;
  }
  let relativePathSpl = relativePath.split("/");
  let importedPathSpl = currentPath.split("/");
  let currentSectionCount = importedPathSpl.length - 1;
  for (let pathSection of relativePathSpl) {
    importedPathSpl[currentSectionCount] = pathSection;
    currentSectionCount--;
  }
  return importedPathSpl.join("/");
}
function getFileNameFromRelativePath(relativePath: string) {
  let splPath = relativePath.split("/");
  let importedName = splPath.splice(splPath.length - 1, 1);
  return {
    fileName: importedName[0],
    path: splPath.join("/"),
  };
}
