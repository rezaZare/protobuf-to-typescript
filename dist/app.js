var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { protoToTs } from "./generate/protoToTs";
class App {
    static start() {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
}
App.start();
//# sourceMappingURL=app.js.map