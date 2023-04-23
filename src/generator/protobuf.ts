import protobufjs, { ReflectionObject, IService } from "protobufjs/minimal";

import protobufjsCli from "protobufjs-cli";

export function getObjectKeys<T>(target: T) {
  return Object.keys(target) as (keyof T)[];
}

export function isBoolean<T>(target: T) {
  return typeof target === "boolean";
}

export function isStringArray(array: any): array is string[] {
  return (
    Array.isArray(array) && array.every((item) => typeof item === "string")
  );
}

export type ServiceMethod = {
  name: string;
  requestType: string;
  responseType: string;
  requestStream?: boolean;
  responseStream?: boolean;
};

export type PackageService = {
  name: string;
  methods: ServiceMethod[];
};

export type Package = {
  name: string;
  services: PackageService[];
};

export type PackageDefinition = {
  files: string[];
  packages: Package[];
};

function hasNested(
  target: ReflectionObject
): target is ReflectionObject & { nested: Record<string, IService> } {
  return !!Object.keys(target).find((key) => key === "nested");
}

function mapPackageServices(packageServices: Record<string, IService>) {
  return getObjectKeys(packageServices)
    .reduce((services, key) => {
      if (packageServices[key].methods) {
        services.push({
          name: String(key),
          methods: mapServiceMethods(packageServices[key].methods),
        });
      }

      return services;
    }, [] as PackageService[])
    .sort((a, b) => strcmp(a.name, b.name));
}

function mapServiceMethods(methods: IService["methods"]) {
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

export async function loadPackageDefinition(
  protoFile: string
): Promise<PackageDefinition> {
  return new Promise((resolve, reject) => {
    let output = protobufjs.loadSync(protoFile);
    if (output) {
      debugger;
      const packageDefinition: PackageDefinition = {
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

function strcmp(a: string, b: string): number {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else {
    return 0;
  }
}

export function generateStaticObjects(protoFiles: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    protobufjsCli.pbjs.main(
      [
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
      ],
      (error, output) => {
        if (error || !output) {
          reject(error || new Error("Empty output"));
          return;
        }
        resolve(output);
      }
    );
  });
}

export function generateStaticDeclarations(
  staticObjectsFile: string
): Promise<string> {
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
