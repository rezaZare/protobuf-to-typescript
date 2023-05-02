"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateIndex = exports.generateAllinOneFile = exports.generate = void 0;
const path = require("path");
const fs_1 = require("fs");
const protobuf = require("./protobuf");
const $protobuf = require("protobufjs");
const service_1 = require("./service");
async function generate(protoFile, outputDir, importedPath, globalDir, needGoogleImport, finalFileName) {
    try {
        let outParse = path.parse(outputDir);
        const packageDefinition = await $protobuf.loadSync(protoFile);
        const codegenDirectory = path.resolve(outParse.dir);
        await fs_1.promises.mkdir(codegenDirectory, { recursive: true });
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
        const serviceGenerator = new service_1.ServiceGenerator(packageDefinition, outputDir, globalDir, needGoogleImport, finalFileName).getCode();
        const staticGrpcFilename = path.resolve(outParse.dir, `${outParse.name}_grpc.ts`);
        await fs_1.promises.writeFile(staticGrpcFilename, serviceGenerator);
    }
    catch (error) {
        console.error("grpcw-service-generator [error]:", error);
        process.exit(1);
    }
}
exports.generate = generate;
async function generateAllinOneFile(protoFiles, outputDir, name) {
    try {
        let outParse = path.parse(outputDir + "/" + name + ".js");
        const codegenDirectory = path.resolve(outParse.dir);
        await fs_1.promises.mkdir(codegenDirectory, { recursive: true });
        /**
         * this section generate js FIle
         */
        const staticObjectsSource = await protobuf.generateStaticObjects(protoFiles);
        const staticObjectsFilename = path.resolve(outParse.dir, `${outParse.name}.js`);
        await fs_1.promises.writeFile(staticObjectsFilename, staticObjectsSource);
        /**
         * this section generate d.ts FIle
         */
        const staticDeclarationsSource = await protobuf.generateStaticDeclarations(staticObjectsFilename);
        const staticDeclarationsFilename = path.resolve(outParse.dir, `${outParse.name}.d.ts`);
        await fs_1.promises.writeFile(staticDeclarationsFilename, staticDeclarationsSource);
    }
    catch (error) {
        console.error("grpcw-service-generator [error]:", error);
        process.exit(1);
    }
}
exports.generateAllinOneFile = generateAllinOneFile;
async function generateIndex(name, outDir, files) {
    var _a;
    let codes = [];
    let codeExportVariable = [];
    codes.push(`export * from "./${name}";`);
    codes.push(`export * from "./global";`);
    for (let file of files) {
        let importName = "";
        let packageSpl = (_a = file === null || file === void 0 ? void 0 : file.package) === null || _a === void 0 ? void 0 : _a.split(".");
        if ((packageSpl === null || packageSpl === void 0 ? void 0 : packageSpl.length) > 0) {
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
    await fs_1.promises.writeFile(outDir + "/index.ts", sourceCode);
}
exports.generateIndex = generateIndex;
//# sourceMappingURL=generate.js.map