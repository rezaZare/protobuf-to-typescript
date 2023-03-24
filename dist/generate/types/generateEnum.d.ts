import * as protobuf from "protobufjs";
import { Code } from "ts-poet";
import { CodeBlock } from "../model";
export declare function generateEnum(element: protobuf.Enum): CodeBlock;
export declare function generateEnumCode(blocks: CodeBlock): Code[];
