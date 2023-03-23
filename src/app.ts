import { protoToTs } from "./generate/protoToTs";

class App {
  static async start() {
    protoToTs({
      protobufPath: "./sample/pb/v1",
      generatedTypescriptPath: "./sample/ts/v1",
      outPath: "./sample/dist/v1",
      globalFilePath: "./sample/dist/global",
      apiPath: "https://vodteam.com/api",
    });
  }
}

App.start();
