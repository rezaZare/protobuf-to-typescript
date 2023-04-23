export declare class Method {
    name: string;
    requestType: string;
    responseType: string;
    pbRequestType: string;
    code?: string;
    pbName: string;
    constructor(service: protobuf.Method, pbName: any);
    generateCode(): void;
    private generateMethodCode;
}
