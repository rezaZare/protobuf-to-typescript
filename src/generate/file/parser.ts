const fs = require("fs");
var path = require("path");

var util = require("util");
var log_file = fs.createWriteStream(__dirname + "/debug.log", { flags: "w" });
var log_stdout = process.stdout;

console.log = function (d) {
  //
  log_file.write(util.format(d) + "\n");
  log_stdout.write(util.format(d) + "\n");
};

class Block {
  constructor(
    _content: string,
    _isNamespace: boolean,
    _isClass: boolean,
    _name: string,
    _blocks: Block[],
    _level: number,
    _ended: boolean
  ) {
    this.content = _content;
    this.isNamespace = _isNamespace;
    this.isClass = _isClass;
    this.name = _name;
    this.blocks = _blocks;
    this.level = _level;
    this.ended = _ended;
  }
  content: string;
  isNamespace: boolean;
  isClass: boolean;
  name: string;
  blocks: Block[];
  level: number;
  ended: boolean;
}
interface ReplaceInfo {
  str: string;
  replaceStr: string;
}

const newLine = "\r\n";
let replaces: ReplaceInfo[] = [];
let replaceBuffer: ReplaceInfo[] = [];
let replaceGlobalFile: ReplaceInfo[] = [];
let imports: string[] = [];

async function main() {
  await generate("./node/v1/cmd/", "./node/model/v1/cmd/");
  await generate("./node/v1/common/", "./node/model/v1/common/");
  await generate("./node/v1/qry/", "./node/model/v1/qry/");
  await generate("./node/v1/qry/admin/", "./node/model/v1/qry/admin/");
}

async function generate(rootpath, savePath) {
  let allFile = await getAllFileAndDirectory(rootpath);

  for (let i = 0; i < allFile.length; i++) {
    let file = allFile[i];
    console.log(i);
    if (file.isDirectory) continue;
    let ext = path.extname(file.name);
    if (
      file.name.includes("grpc_web_pb") ||
      file.name.includes("index") ||
      ext == ".js"
    )
      continue;

    const name = file.name.replace("d.ts", "ts");
    console.log("start parse");
    await grpcToBlock(rootpath, rootpath + file.name, savePath + name, true);
    console.log("end parse");
  }
  console.log("end parser function");
}

async function grpcToBlock(
  rootPath,
  rootFileName,
  saveFilePath,
  generate: boolean
) {
  let fileContent: string = await fs.readFileSync(rootFileName, "utf-8");

  imports = [];
  replaceBuffer = [];
  replaceGlobalFile = [];
  let blocks = getBlocks(fileContent);
  let newFile = await getImports(rootPath);

  blocks.forEach((block) => {
    replaces = [];
    let blockSection = blockToObject(block);

    if (blockSection?.length > 0) {
      let file = generateNewFile(blockSection[0], undefined);
      file = replaceOnBlock(file);
      newFile += file;
    }
  });

  newFile = replaceGlobal(newFile);
  newFile = replaceWithBuffer(newFile);

  // newFile = newFile.replace(/.AsObject/gi, "");

  if (generate) {
    await fs.writeFileSync(saveFilePath, newFile);
  } else {
    return blocks;
  }
}
function getBlocks(block: string) {
  let lines = getLines(block);
  let blocks: string[] = [];
  imports = [];

  if (lines?.length > 0) {
    let startBlock = 0;

    let block = "";
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if (line.trim() == "") continue;

      if (line.includes("import")) {
        imports.push(line);
        continue;
      } else {
        if (line.includes("{")) {
          startBlock += 1;
        }
        if (line.includes("}")) {
          startBlock -= 1;
        }

        if (startBlock != 0) {
          block += line + newLine;
        } else {
          block = block + "}";
          blocks.push(block);

          block = "";
        }
      }
    }
  }
  return blocks;
}
function blockToObject(_block: string): Block[] {
  let lines = getLines(_block);

  let level = -1;
  let result: Block[] = [];
  let stack: Block[] = [];

  lines.forEach((line) => {
    let isBracket = false;
    if (line.includes("{")) {
      level += 1;
      let newBlock = new Block(
        line,
        line.includes("namespace"),
        line.includes("class"),
        getName(line),
        [],
        level,
        false
      );
      if (stack.length > 0) {
        stack[stack.length - 1].blocks.push(newBlock);
      }
      stack.push(newBlock);

      isBracket = true;
    }
    if (line.includes("}")) {
      stack[stack.length - 1].content += line;
      if (stack.length == 1) {
        result = [...result, ...stack];
      }
      stack.splice(stack.length - 1, 1);
      level -= 1;
      isBracket = true;
    }
    if (!isBracket) {
      stack[stack.length - 1].content += line;
    }
  });
  return result;
}
function generateNewFile(block: Block, parent?: Block) {
  let finalContent = "";

  if (block.content.includes("jspb.Message")) return "";

  if (block.blocks.length == 1 && block.isNamespace) {
    block.blocks[0].content = block.blocks[0].content.replace(
      " AsObject",
      " " + block.name
    );
    finalContent += newLine + block.blocks[0].content;
    replaces.push({
      str: block.name + ".AsObject",
      replaceStr: "." + block.name,
    });
    replaceGlobalFile.push({
      str: block?.name + ".AsObject",
      replaceStr: block?.name,
    });
  } else if (block.blocks?.length > 1) {
    if (block.isNamespace) {
      finalContent += newLine + `export namespace ${block.name} {` + newLine;
    }
    for (let i = 0; i < block.blocks.length; i++) {
      if (block.blocks[i].content.includes(" AsObject")) {
        replaceGlobalFile.push({
          str: block?.name + ".AsObject",
          replaceStr: block?.name + "." + block?.name,
        });
      }
      let returned = generateNewFile(block.blocks[i], block);
      finalContent += newLine + returned;
    }
    finalContent += "}";
  } else {
    if (block.content.includes(" AsObject")) {
      block.content = block.content.replace(" AsObject", " " + parent?.name);
      replaces.push({
        str: parent?.name + ".AsObject",
        replaceStr: "." + parent?.name + "." + parent?.name,
      });
    }
    finalContent += newLine + block.content;
  }

  // finalContent = finalContent.replace(/.AsObject/gi, "");
  return finalContent;
}
function getLines(block: string) {
  return block.split(/\r?\n/);
}
function getName(line: string) {
  let words = line.trim().split(" ");

  return words[2];
}
interface FileAndDirectory {
  name: string;
  isDirectory: boolean;
}
async function getAllFileAndDirectory(root): Promise<FileAndDirectory[]> {
  let result: FileAndDirectory[] = [];
  let directorys = await fs
    .readdirSync(root, { withFileTypes: true })
    .map((dirent) => {
      return {
        name: dirent.name,
        isDirectory: dirent.isDirectory(),
      };
    });
  result.push(...directorys);
  return result;
}
function replaceOnBlock(block: string) {
  if (replaces?.length > 0) {
    replaces.forEach((info) => {
      const reg = `\\.${info.str}`;
      let regx = new RegExp(reg, "g");

      block = block.replace(regx, info.replaceStr);
    });
  }
  return block;
}
function addBuffer(str: string, replaceStr) {
  if (replaceBuffer.findIndex((x) => x.str == str) < 0) {
    replaceBuffer.push({
      str: str,
      replaceStr: replaceStr,
    });
  }
}
function replaceWithBuffer(block: string) {
  if (replaceBuffer?.length > 0) {
    replaceBuffer.forEach((info) => {
      const reg = `${info.str}`;

      let regx = new RegExp(reg, "g");

      block = block.replace(regx, info.replaceStr);
    });
  }
  return block;
}

function replaceGlobal(block: string) {
  if (replaceGlobalFile?.length > 0) {
    replaceGlobalFile.forEach((info) => {
      const reg = `${info.str}`;

      let regx = new RegExp(reg, "g");

      block = block.replace(regx, info.replaceStr);
    });
  }
  return block;
}
async function getImports(rootPath: string) {
  let content = "";

  if (imports.length > 0) {
    let needBuf: string[] = [];
    for (let i = 0; i < imports.length; i++) {
      let item = imports[i];
      if (item.includes("jspb")) continue;

      content += item + newLine;
      needBuf.push(item);
    }

    for (let i = 0; i < imports.length; i++) {
      await bufferImportedBlock(rootPath, imports[i]);
    }
    return content;
  }
  return "";
}

async function bufferImportedBlock(rootPath: String, _imported: string) {
  if (rootPath.endsWith("/")) {
    rootPath = rootPath.substring(0, rootPath.length - 1);
  }

  let _path = getPath(_imported, rootPath);

  if (_path) {
    let fileContent: string = await fs.readFileSync(_path.path, "utf-8");
    let blocks = getBlocks(fileContent);

    blocks.forEach((block) => {
      let blockSection = blockToObject(block);
      if (blockSection?.length > 0) {
        if (blockSection[0].isNamespace) {
          if (blockSection[0].blocks.length == 1) {
            addBuffer(
              _path?.name + "." + blockSection[0].name + ".AsObject",
              _path?.name + "." + blockSection[0].name
            );
          } else if (blockSection[0].blocks.length > 1) {
            addBuffer(
              _path?.name + "." + blockSection[0].name + ".AsObject",
              _path?.name +
                "." +
                blockSection[0].name +
                "." +
                blockSection[0].name
            );
          }
        }
      }
    });
  }
}

function getPath(_imported: string, root: String) {
  let spl = _imported.replace(/(?:'|;|")/g, "").split(" ");

  if (spl[5].startsWith(".")) {
    let path = spl[5].split("/");

    let rootpath = root.split("/");
    path.forEach((item, index) => {
      if (item == "..") {
        rootpath.splice(rootpath.length - 1, 1);
        path.splice(index, 1);
      }
    });

    return {
      name: spl[3],
      path: rootpath.join("/") + "/" + path.join("/") + ".d.ts",
    };
  }

  return undefined;
}

main();
