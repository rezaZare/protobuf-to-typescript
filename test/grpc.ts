import {
  GrpcWebClientBase,
  GrpcWebClientBaseOptions,
  Metadata,
  MethodType,
  MethodDescriptor,
  UnaryInterceptor,
} from "grpc-web";

export type MethodOptions = {
  ignoreInterceptors?: boolean;
};

export type GrpcServiceOptions = GrpcWebClientBaseOptions & {
  unaryInterceptors?: ArrayLike<UnaryInterceptor<any, any>>;
  fakeMethods?: boolean;
};
export class GrpcService {
  private client: GrpcWebClientBase;
  private metadata: Metadata = {};
  private hostname: string;
  private options: GrpcServiceOptions;
  private interceptingPromise?: Promise<any>;
  public interceptors: { errors: ((e: any) => Promise<any>)[] } = {
    errors: [],
  };
  constructor(hostname: string, options: GrpcServiceOptions = {}) {
    this.options = options;
    this.hostname = hostname;
    this.client = new GrpcWebClientBase(this.options);
  }
  public makeInterceptedUnaryCall = <Result, Params>(
    command: string,
    params: Params,
    methodDescriptor: MethodDescriptor<Params, Result>,
    options: MethodOptions = {}
  ): Promise<Result> => {
    const unaryCallHandler = (): Promise<Result> =>
      this.client.thenableCall(
        this.hostname + command,
        params,
        this.metadata,
        methodDescriptor
      );

    if (options.ignoreInterceptors) {
      return unaryCallHandler();
    }

    if (this.interceptingPromise) {
      return this.interceptingPromise.then(() => {
        this.interceptingPromise = undefined;
        return unaryCallHandler();
      });
    }

    return new Promise((resolve, reject) => {
      unaryCallHandler()
        .then(resolve)
        .catch((e) => {
          this.chainingInterceptors(this.interceptors.errors, e)
            .then(() => {
              this.makeInterceptedUnaryCall<Result, Params>(
                command,
                params,
                methodDescriptor
              )
                .then(resolve)
                .catch(reject);
            })
            .catch(reject);
        });
    });
  };
  private chainingInterceptors = (
    interceptors: ((e: any) => Promise<any>)[],
    value: any
  ) => {
    this.interceptingPromise = interceptors.reduce(
      (chain, nextInterceptor) => chain.then(nextInterceptor),
      Promise.resolve(value)
    );
    return this.interceptingPromise;
  };
  public setMetadata = (metadata: Metadata = {}) => {
    this.metadata = Object.assign({}, this.metadata, metadata);
  };
  public getMetadata = () => {
    return this.metadata;
  };
}
