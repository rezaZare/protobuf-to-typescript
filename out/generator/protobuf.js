import protobufjs from "protobufjs/minimal";
import protobufjsCli from "protobufjs-cli";
export function getObjectKeys(target) {
    return Object.keys(target);
}
export function isBoolean(target) {
    return typeof target === "boolean";
}
export function isStringArray(array) {
    return (Array.isArray(array) && array.every((item) => typeof item === "string"));
}
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
export async function loadPackageDefinition(protoFile) {
    return new Promise((resolve, reject) => {
        let output = protobufjs.loadSync(protoFile);
        if (output) {
            debugger;
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
        // reject(error);
    });
}
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
export function generateStaticObjects(protoFiles) {
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
            "--no-delimited",
            // "--keep-case",
            "-no-service",
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
export function generateStaticDeclarations(staticObjectsFile) {
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
//# sourceMappingURL=protobuf.js.map