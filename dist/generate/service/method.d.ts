import { Code } from "ts-poet";
export declare class Method {
    name: string;
    requestType: string;
    responseType: string;
    pbRequestType: string;
    code?: Code;
    pbName: string;
    constructor(service: protobuf.Method, pbName: any);
    generateCode(): void;
    private generateMethodCode;
}
