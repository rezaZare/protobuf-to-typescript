import * as fs from "fs";
import * as path from "path";
import * as protobuf from "protobufjs";
import { generate } from "./generate";
import { GenerateGlobalFiles } from "./generateGlobal";
import { generateIndex } from "./generateIndex";
interface FileInfo {
  nested?: FileInfo[];
  fileName: string;
  path: Path;
  imports: Import[];
}
interface Path {
  inPath: string;
  outPath: string;
}
interface Import {
  fileName: string;
  protoPath: string;
  path?: Path;
}

export async function protoToTs(
  protoDir: string,
  outDir: string,
  endPoint: string
) {
  let files = await loadFile(protoDir, outDir);
  let fielMap = getFileMap(files);
  files = updateImports(files, fielMap);

  /*
     this section generate global files
  */
  let globalDir = GenerateGlobalFiles(endPoint, outDir);

  if (files.length > 0) {
    for (let file of files) {
      let importedPath: string[];
      if (file.imports?.length > 0) {
        importedPath = file.imports.map((x) => x.path.inPath);
      }
      await generate(
        file.path.inPath,
        file.path.outPath,
        importedPath,
        globalDir
      );
    }
  }
  await generateIndex(outDir);

  debugger;
}

export async function loadFile(protoDir: string, outDir: string) {
  let fileInfoList: FileInfo[] = [];
  let directorys = await fs.readdirSync(protoDir, {
    withFileTypes: true,
  });
  for (let dirent of directorys) {
    const isDirectory = dirent.isDirectory();
    let fileInfo: FileInfo = {
      fileName: dirent.name,
      path: {
        inPath: protoDir + "/" + dirent.name,
        outPath: outDir + "/" + dirent.name,
      },
      imports: [],
    };
    if (isDirectory) {
      debugger;
      fileInfo.nested = await loadFile(protoDir, outDir);
    } else {
      let pathResolved = path.resolve(protoDir + "/" + dirent.name);
      let protobufString = await fs.readFileSync(pathResolved, "utf8");

      if (protobufString) {
        let parsed = protobuf.parse(protobufString);
        if (parsed) {
          if (parsed.imports?.length > 0) {
            for (let impStr of parsed.imports) {
              if (impStr.startsWith("google")) continue;
              let parsePath = path.parse(impStr);
              fileInfo.imports.push({
                fileName: parsePath.base,
                protoPath: impStr,
              });
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
          imp.path = blockMaps.get(imp.fileName);
        }
      }
    }
  }
  return files;
}
