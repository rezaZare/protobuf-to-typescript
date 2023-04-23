"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStaticDeclarations = exports.generateStaticObjects = exports.loadPackageDefinition = exports.isStringArray = exports.isBoolean = exports.getObjectKeys = void 0;
var minimal_1 = __importDefault(require("protobufjs/minimal"));
var protobufjs_cli_1 = __importDefault(require("protobufjs-cli"));
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
    return new Promise(function (resolve, reject) {
        minimal_1.default.load(protoFile, function (error, output) {
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
        protobufjs_cli_1.default.pbjs.main(__spreadArray([
            "--target",
            "static-module",
            "--wrap",
            "commonjs",
            "--sparse",
            "--no-create",
            "--no-verify",
            "--no-convert",
            "--no-delimited",
            "--keep-case"
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
        protobufjs_cli_1.default.pbts.main([staticObjectsFile], function (error, output) {
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