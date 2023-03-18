import { protoToTs } from "./generate/protoToTs";

class App {
  static async start() {
    protoToTs({
      protobufPath: "./pb/v1",
      generatedTypescriptPath: "./src/service/v1",
      outPath: "./src/dist/v1",
      globalFilePath: "./src/dist/global",
      apiPath: "https://vodteam.com/api",
    });
  }
}

App.start();
