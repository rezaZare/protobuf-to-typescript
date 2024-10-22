import * as fs from "fs";

import * as path from "path";
import * as protobuf from "protobufjs";
import { promises as fs2 } from "fs";
import * as protobufTest from "./protobuf";

import { generate, generateAllinOneFile, generateIndex } from "./generate";
import { GenerateGlobalFiles } from "./generateGlobal";
// import { generateIndex } from "./generateIndex";
export interface FileInfo {
  nested?: FileInfo[];
  fileName: string;
  name: string;
  path: Path;
  imports: Import[];
  package: string;
}
interface Path {
  inPath: string;
  outPath: string;
}
interface Import {
  fileName: string;
  protoPath: string;
  path?: Path;
  notDetect: boolean;
}

export async function protoToTs(
  name: string,
  protoDir: string,
  outDir: string,
  endPoint: string,
  unauthorizedPath: string
) {
  let files = await loadFile(protoDir, outDir);
  let fielMap = getFileMap(files);
  files = updateImports(files, fielMap);

  await generateAllinOneFile(getAllProtoPath(files), outDir, name);
  // /*
  //    this section generate global files
  // */
  let globalDir = GenerateGlobalFiles(endPoint, outDir, unauthorizedPath);

  if (files.length > 0) {
    for (let file of files) {
      let importedPath: string[];
      let needGoogleImport = false;
      if (file.imports?.length > 0) {
        importedPath = file.imports.map(function (x) {
          if (x.notDetect) {
            needGoogleImport = true;
            return x.protoPath;
          } else return x.path.inPath;
        });
      }
      await generate(
        file.path.inPath,
        file.path.outPath,
        importedPath,
        globalDir,
        needGoogleImport,
        name
      );
    }
  }
  await generateIndex(name, outDir, files);
}

function getAllProtoPath(files: FileInfo[]) {
  let protoPath: string[] = [];
  if (files.length > 0) {
    for (let file of files) {
      if (file.nested?.length > 0) {
        protoPath.push(...getAllProtoPath(file.nested));
      } else {
        protoPath.push(file.path.inPath);
      }
    }
  }
  return protoPath;
}

async function testGen() {
  let files = [
    "./sample/auth/api/proto/auth/v1/admin_service_v1.proto",
    "./sample/auth/api/proto/auth/v1/admin_v1.proto",
    "./sample/auth/api/proto/auth/v1/api_service_v1.proto",
    "./sample/auth/api/proto/auth/v1/common_v1.proto",
    "./sample/auth/api/proto/auth/v1/entry_service_v1.proto",
    "./sample/auth/api/proto/auth/v1/group_service_v1.proto",
    "./sample/auth/api/proto/auth/v1/object_service_v1.proto",
    "./sample/auth/api/proto/auth/v1/profile_service_v1.proto",
    "./sample/auth/api/proto/auth/v1/user_service_v1.proto",
  ];
  const staticObjectsSource = await protobufTest.generateStaticObjects(files);
  const staticObjectsFilename = path.resolve(
    "./sample/auth/dist",
    `indexTest.js`
  );
  await fs2.writeFile(staticObjectsFilename, staticObjectsSource);
  //---------------------------

  const staticDeclarationsSource =
    await protobufTest.generateStaticDeclarations(staticObjectsFilename);
  const staticDeclarationsFilename = path.resolve(
    "./sample/auth/dist",
    `indexTest.d.ts`
  );

  await fs2.writeFile(staticDeclarationsFilename, staticDeclarationsSource);
}

export async function loadFile(protoDir: string, outDir: string) {
  let fileInfoList: FileInfo[] = [];

  let directorys = await fs.readdirSync(protoDir, {
    withFileTypes: true,
  });
  for (let dirent of directorys) {
    const isDirectory = dirent.isDirectory();

    let fileInfo: FileInfo = {
      name: path.parse(dirent.name).name,
      fileName: dirent.name,
      path: {
        inPath: protoDir + "/" + dirent.name,
        outPath: outDir + "/" + dirent.name,
      },
      imports: [],
      package: "",
    };
    if (isDirectory) {
      debugger;
      fileInfo.nested = await loadFile(protoDir, outDir);
    } else {
      if (path.extname(dirent.name) != ".proto") continue;
      let pathResolved = path.resolve(protoDir + "/" + dirent.name);
      let protobufString = await fs.readFileSync(pathResolved, "utf8");

      if (protobufString) {
        let parsed = protobuf.parse(protobufString);
        fileInfo.package = parsed.package;
        if (parsed) {
          if (parsed.imports?.length > 0) {
            for (let impStr of parsed.imports) {
              if (impStr.startsWith("google")) {
                fileInfo.imports.push({
                  fileName: impStr,
                  protoPath: impStr,
                  notDetect: true,
                });
              } else {
                let parsePath = path.parse(impStr);
                fileInfo.imports.push({
                  fileName: parsePath.base,
                  protoPath: impStr,
                  notDetect: false,
                });
              }
            }
          }
        }
      }
    }

    fileInfoList.push(fileInfo);
  }

  return fileInfoList;
}

function getFileMap(files: FileInfo[]) {
  let fileMap = new Map<string, Path>();
  for (let file of files) {
    if (file.nested?.length > 0) {
      let nestedMap = getFileMap(file.nested);
      nestedMap.forEach((value, key) => {
        fileMap.set(key, value);
      });
    } else {
      fileMap.set(file.fileName, file.path);
    }
  }
  return fileMap;
}

function updateImports(files: FileInfo[], blockMaps: Map<string, Path>) {
  for (let file of files) {
    if (file.nested) {
      updateImports(file.nested, blockMaps);
    } else {
      if (file.imports?.length > 0) {
        for (let imp of file.imports) {
          if (!imp.notDetect) {
            imp.path = blockMaps.get(imp.fileName);
          }
        }
      }
    }
  }
  return files;
}
