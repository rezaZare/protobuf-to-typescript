#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = require("yargs");
const index_1 = require("./index");
async function cli() {
    try {
        const argv = await (0, yargs_1.default)(process.argv.slice(2))
            .options({
            name: {
                type: "string",
                demandOption: true,
                describe: "Package name",
            },
            "proto-dir": {
                type: "string",
                demandOption: true,
                describe: "Protobuf definition file",
            },
            "output-dir": {
                type: "string",
                demandOption: true,
                describe: "Ouput director for generated code",
            },
            endpoint: {
                type: "string",
                demandOption: true,
                describe: "Endpoint address for call grpc server",
            },
        })
            .version()
            .help()
            .alias("h", "help").argv;
        if (argv["name"] &&
            argv["proto-dir"] &&
            argv["output-dir"] &&
            argv["endpoint"]) {
            console.log("Starting ... ", "packageName: " + argv["name"], "proto-dir: " + argv["proto-dir"], "output-dir: " + argv["output-dir"], "endpoint: " + argv["endpoint"]);
            (0, index_1.protoToTs)(argv["name"], argv["proto-dir"], argv["output-dir"], argv["endpoint"]);
        }
    }
    catch (error) {
        console.error("grpcw-service-generator [error]:", error);
        process.exit(1);
    }
}
//protoFile = argv["proto-file"]
//outputDir = argv["output-dir"]
cli();
//# sourceMappingURL=cli.js.map