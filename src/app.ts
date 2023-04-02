import { protoToTs } from "./generate/protoToTs";

class App {
  static async start() {
    // protoToTs({
    //   protobufPath: "./sample/account/pb/v1",
    //   generatedTypescriptPath: "./sample/account/ts/v1",
    //   outPath: "./sample/account/dist/v1",
    //   globalFilePath: "./sample/account/dist/global",
    //   apiPath: "https://vodteam.com/api",
    // });
    // protoToTs({
    //   protobufPath: "./sample/auth/pb/v1",
    //   generatedTypescriptPath: "./sample/auth/ts/v1",
    //   outPath: "./sample/auth/dist/v1",
    //   globalFilePath: "./sample/auth/dist/global",
    //   apiPath: "https://vodteam.com/api",
    // });
    protoToTs({
      protobufPath: "./sample/espad/pb",
      generatedTypescriptPath: "./sample/espad/ts",
      outPath: "./sample/espad/dist",
      globalFilePath: "./sample/espad/dist/global",
      apiPath: "https://vodteam.com/api",
    });
  }
}

App.start();
