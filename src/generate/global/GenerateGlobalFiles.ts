import { GlobalFilesType } from "../model";
import { generateApiPathCode } from "./generateApiPath";
import { generateEnabledDevMode } from "./generateEnabledDevMode";
import { generateToProto } from "./generateToProto";
import { generateMetadata } from "./metadata";
import { generateResponseModel } from "./responseModel";

export function GenerateGlobalFiles(): GlobalFilesType {
  return {
    apiPathCode: generateApiPathCode(),
    enabledDevMode: generateEnabledDevMode(),
    metadata: generateMetadata(),
    responseModel: generateResponseModel(),
    toProto: generateToProto(),
  };
}
