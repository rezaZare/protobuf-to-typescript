// import { protoToTs } from "./generate/protoToTs";

import { protoToTs } from "./generator/index";
class App {
  static async start() {
    // ProtoToTs({
    //   protobufPath: "./sample/account/api/proto/account/v2",
    //   generatedTypescriptPath: "./sample/account/web/account/v2",
    //   outPath: "./sample/account/dist/v2",
    //   globalFilePath: "./sample/account/dist/global",
    //   startPathGenerateIndex: "./sample/account/dist",
    //   apiAddress: "https://espadev.com/api",
    //   tsSuffix: "_grpc_web_pb",
    // });
    // ProtoToTs({
    //   protobufPath: "./sample/auth/api/proto/auth/v1",
    //   generatedTypescriptPath: "./sample/auth/web/auth/v1",
    //   outPath: "./sample/auth/dist/v1",
    //   globalFilePath: "./sample/auth/dist/global",
    //   startPathGenerateIndex: "./sample/auth/dist",
    //   apiAddress: "https://espadev.com/api",
    //   tsSuffix: "_grpc_web_pb",
    // });
    protoToTs(
      "auth",
      "./sample/auth/api/proto/auth",
      "./sample/auth/dist",
      "https://espadev.ir/api",
      "/auth"
    );
  }
}

App.start();
