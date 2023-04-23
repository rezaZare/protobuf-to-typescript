#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var fs_1 = require("fs");
var protobuf = __importStar(require("./protobuf"));
// import * as jsgen from "./jsgen";
var yargs_1 = __importDefault(require("yargs/yargs"));
function cli() {
    return __awaiter(this, void 0, void 0, function () {
        var argv, rootProtoShortname, codegenToken, packageDefinition, codegenDirectory, staticObjectsSource, staticObjectsFilename, staticDeclarationsSource, staticDeclarationsFilename, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, (0, yargs_1.default)(process.argv.slice(2))
                            .options({
                            "proto-file": {
                                type: "string",
                                demandOption: true,
                                describe: "Protobuf definition file",
                            },
                            "output-dir": {
                                type: "string",
                                demandOption: true,
                                describe: "Ouput director for generated code",
                            },
                            "skip-grpc-service": {
                                type: "boolean",
                                default: false,
                                describe: "Disable generation of GrpcService (special for server-side)",
                            },
                        })
                            .version()
                            .help()
                            .alias("h", "help").argv];
                case 1:
                    argv = _a.sent();
                    rootProtoShortname = path.parse(argv["proto-file"]).name;
                    codegenToken = "codegen";
                    return [4 /*yield*/, protobuf.loadPackageDefinition(argv["proto-file"])];
                case 2:
                    packageDefinition = _a.sent();
                    codegenDirectory = path.resolve(argv["output-dir"], codegenToken);
                    return [4 /*yield*/, fs_1.promises.mkdir(codegenDirectory, { recursive: true })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, protobuf.generateStaticObjects(packageDefinition.files)];
                case 4:
                    staticObjectsSource = _a.sent();
                    staticObjectsFilename = path.resolve(codegenDirectory, "".concat(rootProtoShortname, "_pb.js"));
                    return [4 /*yield*/, fs_1.promises.writeFile(staticObjectsFilename, staticObjectsSource)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, protobuf.generateStaticDeclarations(staticObjectsFilename)];
                case 6:
                    staticDeclarationsSource = _a.sent();
                    staticDeclarationsFilename = path.resolve(codegenDirectory, "".concat(rootProtoShortname, "_pb.d.ts"));
                    return [4 /*yield*/, fs_1.promises.writeFile(staticDeclarationsFilename, staticDeclarationsSource)];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 8:
                    error_1 = _a.sent();
                    console.error("grpcw-service-generator [error]:", error_1);
                    process.exit(1);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
cli();
//# sourceMappingURL=index.js.map