import * as protobuf from "protobufjs";
import { CodeBlock } from "../model";
export declare function generateEnum(element: protobuf.Enum): CodeBlock;
export declare function generateEnumCode(blocks: CodeBlock): string[];
