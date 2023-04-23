"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateGlobalFiles = void 0;
var generateApiPath_1 = require("./generateApiPath");
var generateEnabledDevMode_1 = require("./generateEnabledDevMode");
var generateToProto_1 = require("./generateToProto");
var metadata_1 = require("./metadata");
var responseModel_1 = require("./responseModel");
function GenerateGlobalFiles(model) {
    return {
        apiPathCode: (0, generateApiPath_1.generateApiPathCode)(model.apiAddress),
        enabledDevMode: (0, generateEnabledDevMode_1.generateEnabledDevMode)(),
        metadata: (0, metadata_1.generateMetadata)(),
        responseModel: (0, responseModel_1.generateResponseModel)(),
        toProto: (0, generateToProto_1.generateToProto)(),
    };
}
exports.GenerateGlobalFiles = GenerateGlobalFiles;
//# sourceMappingURL=GenerateGlobalFiles.js.map