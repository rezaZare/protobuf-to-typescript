#!/usr/bin/env node

import yargs from "yargs/yargs";
import { generate } from "./generate";
import { protoToTs } from ".";

async function cli() {
  try {
    const argv = await yargs(process.argv.slice(2))
      .options({
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

    protoToTs(argv["proto-dir"], argv["output-dir"], argv["endpoint"]);
  } catch (error) {
    console.error("grpcw-service-generator [error]:", error);
    process.exit(1);
  }
}
//protoFile = argv["proto-file"]
//outputDir = argv["output-dir"]

cli();
