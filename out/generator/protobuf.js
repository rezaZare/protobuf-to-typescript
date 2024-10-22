"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStaticDeclarations = exports.generateStaticObjects = exports.loadPackageDefinition = exports.isStringArray = exports.isBoolean = exports.getObjectKeys = void 0;
const protobufjs = require("protobufjs/minimal");
const protobufjsCli = require("protobufjs-cli");
function getObjectKeys(target) {
    return Object.keys(target);
}
exports.getObjectKeys = getObjectKeys;
function isBoolean(target) {
    return typeof target === "boolean";
}
exports.isBoolean = isBoolean;
function isStringArray(array) {
    return (Array.isArray(array) && array.every((item) => typeof item === "string"));
}
exports.isStringArray = isStringArray;
function hasNested(target) {
    return !!Object.keys(target).find((key) => key === "nested");
}
function mapPackageServices(packageServices) {
    return getObjectKeys(packageServices)
        .reduce((services, key) => {
        if (packageServices[key].methods) {
            services.push({
                name: String(key),
                methods: mapServiceMethods(packageServices[key].methods),
            });
        }
        return services;
    }, [])
        .sort((a, b) => strcmp(a.name, b.name));
}
function mapServiceMethods(methods) {
    return getObjectKeys(methods)
        .map((method) => ({
        name: String(method),
        requestType: methods[method].requestType,
        responseType: methods[method].responseType,
        requestStream: methods[method].requestStream,
        responseStream: methods[method].responseStream,
    }))
        .sort((a, b) => strcmp(a.name, b.name));
}
function loadPackageDefinition(protoFile) {
    debugger;
    return new Promise((resolve, reject) => {
        protobufjs.load(protoFile, (error, output) => {
            debugger;
            if (output && !error) {
                const packageDefinition = {
                    files: output.files,
                    packages: output.nestedArray.map((reflectionObject) => {
                        const packageNested = hasNested(reflectionObject)
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
    return new Promise((resolve, reject) => {
        protobufjsCli.pbjs.main([
            "--target",
            "static-module",
            "--wrap",
            "commonjs",
            "--sparse",
            "--no-create",
            "--no-verify",
            "--no-convert",
            "--no-service",
            ...protoFiles,
        ], (error, output) => {
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
    return new Promise((resolve, reject) => {
        protobufjsCli.pbts.main([staticObjectsFile], (error, output) => {
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