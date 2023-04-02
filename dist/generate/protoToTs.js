var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { FileUtil } from "../utils/fileUtil";
import { typeCheckAndFix } from "./types/validationType";
import { FileInfo } from "./file/fileInfo";
import { GenerateGlobalFiles } from "./global/GenerateGlobalFiles";
import { reviewServiceType } from "./service/service";
export function protoToTs(model) {
    return __awaiter(this, void 0, void 0, function* () {
        let files = yield new FileInfo();
        yield files.load(model.protobufPath, model.generatedTypescriptPath, model.outPath, model.globalFilePath);
        debugger;
        files.files = typeCheckAndFix(files.files);
        files.files = reviewServiceType(files.files);
        if (files.files.length > 0) {
            let fileUtil = new FileUtil();
            fileUtil.writeGlobalFiles(GenerateGlobalFiles(), model.globalFilePath);
            fileUtil.write(files.files);
        }
    });
}
//# sourceMappingURL=protoToTs.js.map