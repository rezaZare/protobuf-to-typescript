import { generateApiPathCode } from "./generateApiPath";
import { generateEnabledDevMode } from "./generateEnabledDevMode";
import { generateToProto } from "./generateToProto";
import { generateMetadata } from "./metadata";
import { generateResponseModel } from "./responseModel";
export function GenerateGlobalFiles() {
    return {
        apiPathCode: generateApiPathCode(),
        enabledDevMode: generateEnabledDevMode(),
        metadata: generateMetadata(),
        responseModel: generateResponseModel(),
        toProto: generateToProto(),
    };
}
//# sourceMappingURL=GenerateGlobalFiles.js.map