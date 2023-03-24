import protobuf from "protobufjs";
interface TypeInfo {
    type: string;
    keyType?: string;
    isSystemType: boolean;
    needImport?: boolean;
    isOptinal: boolean;
    isMap?: boolean;
}
export declare function getFieldType(field: protobuf.Field | protobuf.MapField): TypeInfo;
export {};
