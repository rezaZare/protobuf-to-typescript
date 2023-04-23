import * as path from "path";
import { promises as fs } from "fs";
import * as protobuf from "./protobuf";
import * as $protobuf from "protobufjs";
import { ServiceGenerator } from "./service";
export async function generate(protoFile, outputDir, importedPath, globalDir) {
    try {
        let outParse = path.parse(outputDir);
        const packageDefinition = await $protobuf.loadSync(protoFile);
        const codegenDirectory = path.resolve(outParse.dir);
        await fs.mkdir(codegenDirectory, { recursive: true });
        /**
         * this section generate js FIle
         */
        let files = [protoFile];
        if (importedPath)
            files.push(...importedPath);
        const staticObjectsSource = await protobuf.generateStaticObjects(files);
        const staticObjectsFilename = path.resolve(outParse.dir, `${outParse.name}.js`);
        await fs.writeFile(staticObjectsFilename, staticObjectsSource);
        /**
         * this section generate d.ts FIle
         */
        const staticDeclarationsSource = await protobuf.generateStaticDeclarations(staticObjectsFilename);
        const staticDeclarationsFilename = path.resolve(outParse.dir, `${outParse.name}.d.ts`);
        await fs.writeFile(staticDeclarationsFilename, staticDeclarationsSource);
        /**
         * this section generate grpc FIle
         */
        const serviceGenerator = new ServiceGenerator(packageDefinition, outputDir, globalDir).getCode();
        const staticGrpcFilename = path.resolve(outParse.dir, `${outParse.name}_grpc.ts`);
        await fs.writeFile(staticGrpcFilename, serviceGenerator);
    }
    catch (error) {
        console.error("grpcw-service-generator [error]:", error);
        process.exit(1);
    }
}
//# sourceMappingURL=generate.js.map