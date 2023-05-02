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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStaticDeclarations = exports.generateStaticObjects = exports.loadPackageDefinition = exports.isStringArray = exports.isBoolean = exports.getObjectKeys = void 0;
var protobufjs = __importStar(require("protobufjs/minimal"));
var protobufjsCli = __importStar(require("protobufjs-cli"));
function getObjectKeys(target) {
    return Object.keys(target);
}
exports.getObjectKeys = getObjectKeys;
function isBoolean(target) {
    return typeof target === "boolean";
}
exports.isBoolean = isBoolean;
function isStringArray(array) {
    return (Array.isArray(array) && array.every(function (item) { return typeof item === "string"; }));
}
exports.isStringArray = isStringArray;
function hasNested(target) {
    return !!Object.keys(target).find(function (key) { return key === "nested"; });
}
function mapPackageServices(packageServices) {
    return getObjectKeys(packageServices)
        .reduce(function (services, key) {
        if (packageServices[key].methods) {
            services.push({
                name: String(key),
                methods: mapServiceMethods(packageServices[key].methods),
            });
        }
        return services;
    }, [])
        .sort(function (a, b) { return strcmp(a.name, b.name); });
}
function mapServiceMethods(methods) {
    return getObjectKeys(methods)
        .map(function (method) { return ({
        name: String(method),
        requestType: methods[method].requestType,
        responseType: methods[method].responseType,
        requestStream: methods[method].requestStream,
        responseStream: methods[method].responseStream,
    }); })
        .sort(function (a, b) { return strcmp(a.name, b.name); });
}
function loadPackageDefinition(protoFile) {
    debugger;
    return new Promise(function (resolve, reject) {
        protobufjs.load(protoFile, function (error, output) {
            debugger;
            if (output && !error) {
                var packageDefinition = {
                    files: output.files,
                    packages: output.nestedArray.map(function (reflectionObject) {
                        var packageNested = hasNested(reflectionObject)
                            ? reflectionObject.nested
                            : {};
                        return {
                            name: reflectionObject.name,
                            services: mapPackageServices(packageNested),
                        };
                    }),
                };
                resolve(packageDefinition);
            }
            reject(error);
        });
    });
}
exports.loadPackageDefinition = loadPackageDefinition;
// export async function loadPackageDefinition(
//   protoFile: string
// ): Promise<PackageDefinition> {
//   return new Promise((resolve, reject) => {
//     let output = protobufjs.load(protoFile);
//     if (output) {
//       debugger;
//       const packageDefinition: PackageDefinition = {
//         files: output.files,
//         packages: output.nestedArray.map((reflectionObject) => {
//           const packageNested = hasNested(reflectionObject)
//             ? reflectionObject.nested
//             : {};
//           return {
//             name: reflectionObject.name,
//             services: mapPackageServices(packageNested),
//           };
//         }),
//       };
//       resolve(packageDefinition);
//     }
//     // reject(error);
//   });
// }
function strcmp(a, b) {
    if (a < b) {
        return -1;
    }
    else if (a > b) {
        return 1;
    }
    else {
        return 0;
    }
}
function generateStaticObjects(protoFiles) {
    return new Promise(function (resolve, reject) {
        protobufjsCli.pbjs.main(__spreadArray([
            "--target",
            "static-module",
            "--wrap",
            "commonjs",
            "--sparse",
            "--no-create",
            "--no-verify",
            "--no-convert",
            "--no-service"
        ], protoFiles, true), function (error, output) {
            if (error || !output) {
                reject(error || new Error("Empty output"));
                return;
            }
            resolve(output);
        });
    });
}
exports.generateStaticObjects = generateStaticObjects;
function generateStaticDeclarations(staticObjectsFile) {
    return new Promise(function (resolve, reject) {
        protobufjsCli.pbts.main([staticObjectsFile], function (error, output) {
            if (error || !output) {
                reject(error || new Error("Empty output"));
                return;
            }
            resolve(output);
        });
    });
}
exports.generateStaticDeclarations = generateStaticDeclarations;
//# sourceMappingURL=protobuf.js.map