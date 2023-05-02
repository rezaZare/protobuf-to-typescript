import * as path from "path";
import { promises as fs } from "fs";
import * as protobuf from "./protobuf";
import * as $protobuf from "protobufjs";
import { ServiceGenerator } from "./service";
import { FileInfo } from "./index";

export async function generate(
  protoFile: string,
  outputDir: string,
  importedPath?: string[],
  globalDir?: string,
  needGoogleImport?: boolean,
  finalFileName?: string
) {
  try {
    let outParse = path.parse(outputDir);
    const packageDefinition = await $protobuf.loadSync(protoFile);
    const codegenDirectory = path.resolve(outParse.dir);
    await fs.mkdir(codegenDirectory, { recursive: true });

    /**
     * this section generate js FIle
     */
    // let files = [protoFile];
    // if (importedPath) files.push(...importedPath);
    // const staticObjectsSource = await protobuf.generateStaticObjects(files);
    // const staticObjectsFilename = path.resolve(
    //   outParse.dir,
    //   `${outParse.name}.js`
    // );

    // await fs.writeFile(staticObjectsFilename, staticObjectsSource);

    /**
     * this section generate d.ts FIle
     */
    // const staticDeclarationsSource = await protobuf.generateStaticDeclarations(
    //   staticObjectsFilename
    // );
    // const staticDeclarationsFilename = path.resolve(
    //   outParse.dir,
    //   `${outParse.name}.d.ts`
    // );

    // await fs.writeFile(staticDeclarationsFilename, staticDeclarationsSource);

    /**
     * this section generate grpc FIle
     */
    const serviceGenerator = new ServiceGenerator(
      packageDefinition,
      outputDir,
      globalDir,
      needGoogleImport,
      finalFileName
    ).getCode();
    const staticGrpcFilename = path.resolve(
      outParse.dir,
      `${outParse.name}_grpc.ts`
    );

    await fs.writeFile(staticGrpcFilename, serviceGenerator);
  } catch (error) {
    console.error("grpcw-service-generator [error]:", error);
    process.exit(1);
  }
}

export async function generateAllinOneFile(
  protoFiles: string[],
  outputDir: string,
  name: string
) {
  try {
    let outParse = path.parse(outputDir + "/" + name + ".js");
    const codegenDirectory = path.resolve(outParse.dir);
    await fs.mkdir(codegenDirectory, { recursive: true });

    /**
     * this section generate js FIle
     */

    const staticObjectsSource = await protobuf.generateStaticObjects(
      protoFiles
    );
    const staticObjectsFilename = path.resolve(
      outParse.dir,
      `${outParse.name}.js`
    );

    await fs.writeFile(staticObjectsFilename, staticObjectsSource);

    /**
     * this section generate d.ts FIle
     */
    const staticDeclarationsSource = await protobuf.generateStaticDeclarations(
      staticObjectsFilename
    );
    const staticDeclarationsFilename = path.resolve(
      outParse.dir,
      `${outParse.name}.d.ts`
    );

    await fs.writeFile(staticDeclarationsFilename, staticDeclarationsSource);
  } catch (error) {
    console.error("grpcw-service-generator [error]:", error);
    process.exit(1);
  }
}

export async function generateIndex(name: string, outDir, files: FileInfo[]) {
  let codes: string[] = [];
  let codeExportVariable: string[] = [];
  codes.push(`export * from "./${name}";`);
  codes.push(`export * from "./global";`);
  for (let file of files) {
    let importName: string = "";
    let packageSpl = file?.package?.split(".");
    if (packageSpl?.length > 0) {
      importName = packageSpl[0];
    }
    codes.push(`import * as ${file.name}_grpc from "./${file.name}_grpc";`);

    codeExportVariable.push(`${file.name}:${file.name}_grpc ,`);
  }
  let exportCode = `
  export const ${name}Services = {
      ${codeExportVariable.join(`\n`)}
  }
  `;
  let sourceCode = codes.join(`\n`) + "\n" + exportCode;

  await fs.writeFile(outDir + "/index.ts", sourceCode);
}
