import { protoToTs } from "./generate/protoToTs";

class App {
  static async start() {
    // protoToTs({
    //   protobufPath: "./sample/movie/pb/v1",
    //   generatedTypescriptPath: "./sample/movie/ts/v1",
    //   outPath: "./sample/movie/dist/v1",
    //   globalFilePath: "./sample/movie/dist/global",
    //   apiPath: "https://vodteam.com/api",
    // });

    protoToTs({
      protobufPath: "./sample/espad/pb",
      generatedTypescriptPath: "./sample/espad/ts",
      outPath: "./sample/espad/dist/v1",
      globalFilePath: "./sample/espad/dist/global",
      apiPath: "https://vodteam.com/api",
    });
  }
}

App.start();
