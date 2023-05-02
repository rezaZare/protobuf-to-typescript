import * as fs from "fs";
import * as path from "path";

// async function main() {
//   await generateIndex("./node/v1");
//   await generateIndex("./node/model");
// }
export async function generateIndex(root) {
  let indexPath = root + "/index.ts";
  let indexTypePath = root + "/index.d.ts";
  const pathParse = path.parse(root);
  if (pathParse.name !== "global") {
    await deleteIfExisted(indexPath);
    await deleteIfExisted(indexTypePath);
    let directorys = await getAllFileAndDirectory(root);

    if (directorys.length > 0) {
      let content = await makeIndexFile(root, directorys);

      await createIndexFile(indexPath, content);
      await createIndexFile(indexTypePath, content);
    }
    for (const file of directorys) {
      if (file.isDirectory) {
        if (file == "global") continue;
        await generateIndex(root + "/" + file.name);
      }
    }
  }
}
async function getAllFileAndDirectory(root) {
  let result = [];
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
async function makeIndexFile(root, files) {
  let content = "";
  for (const file of files) {
    let name = file.name;
    const ext = path.extname(name);

    if (ext) {
      if (ext != ".ts") {
        continue;
      }
      if (await fileNeadToBeExport(root + "/" + file.name)) {
        if (name.endsWith(".d.ts")) {
          name = name.replace(".d.ts", "");
        } else {
          name = name.replace(ext, "");
        }
        content += `export * as ${name} from "./${name}";\n`;
      }
    } else {
      content += `export * as ${name} from "./${name}";\n`;
    }
  }
  return content;
}
async function createIndexFile(path, content) {
  await fs.writeFile(path, content, function (err) {
    if (err) throw err;
    console.log("File is created successfully.");
  });
}
async function deleteIfExisted(path) {
  if (await fs.existsSync(path)) {
    await fs.unlinkSync(path);
  }
}
async function fileNeadToBeExport(filename) {
  const contents = await fs.readFileSync(filename, "utf-8");
  return contents.includes("export");
}
