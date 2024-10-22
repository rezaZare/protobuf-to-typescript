#!/usr/bin/env node

import yargs from "yargs";
import { protoToTs } from "./index";

async function cli() {
  try {
    const argv = await yargs(process.argv.slice(2))
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
        "unauthorized-path": {
          type: "string",
          demandOption: true,
          describe: "unauthorized redirect path",
        },
      })
      .version()
      .help()
      .alias("h", "help").argv;
    if (
      argv["name"] &&
      argv["proto-dir"] &&
      argv["output-dir"] &&
      argv["endpoint"] &&
      argv["unauthorized-path"]
    ) {
      console.log(
        "Starting ... ",
        "packageName: " + argv["name"],
        "proto-dir: " + argv["proto-dir"],
        "output-dir: " + argv["output-dir"],
        "endpoint: " + argv["endpoint"],
        "unauthorized-path: " + argv["unauthorized-path"]
      );
      protoToTs(
        argv["name"],
        argv["proto-dir"],
        argv["output-dir"],
        argv["endpoint"],
        argv["unauthorized-path"]
      );
    }
  } catch (error) {
    console.error("grpcw-service-generator [error]:", error);
    process.exit(1);
  }
}
//protoFile = argv["proto-file"]
//outputDir = argv["output-dir"]

cli();
