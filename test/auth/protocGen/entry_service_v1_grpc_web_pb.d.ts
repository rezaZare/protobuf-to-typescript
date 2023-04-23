import * as grpcWeb from 'grpc-web';

import * as auth_v1_entry_service_v1_pb from '../../auth/v1/entry_service_v1_pb';


export class EntryServiceClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  sendVerificationCode(
    request: auth_v1_entry_service_v1_pb.SendVerificationCodeRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: auth_v1_entry_service_v1_pb.SendVerificationCodeResponse) => void
  ): grpcWeb.ClientReadableStream<auth_v1_entry_service_v1_pb.SendVerificationCodeResponse>;

  checkVerificationCode(
    request: auth_v1_entry_service_v1_pb.CheckVerificationCodeRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: auth_v1_entry_service_v1_pb.CheckVerificationCodeResponse) => void
  ): grpcWeb.ClientReadableStream<auth_v1_entry_service_v1_pb.CheckVerificationCodeResponse>;

  signup(
    request: auth_v1_entry_service_v1_pb.SignupRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: auth_v1_entry_service_v1_pb.SignupResponse) => void
  ): grpcWeb.ClientReadableStream<auth_v1_entry_service_v1_pb.SignupResponse>;

  signin(
    request: auth_v1_entry_service_v1_pb.SigninRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: auth_v1_entry_service_v1_pb.SigninResponse) => void
  ): grpcWeb.ClientReadableStream<auth_v1_entry_service_v1_pb.SigninResponse>;

}

export class EntryServicePromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  sendVerificationCode(
    request: auth_v1_entry_service_v1_pb.SendVerificationCodeRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<auth_v1_entry_service_v1_pb.SendVerificationCodeResponse>;

  checkVerificationCode(
    request: auth_v1_entry_service_v1_pb.CheckVerificationCodeRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<auth_v1_entry_service_v1_pb.CheckVerificationCodeResponse>;

  signup(
    request: auth_v1_entry_service_v1_pb.SignupRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<auth_v1_entry_service_v1_pb.SignupResponse>;

  signin(
    request: auth_v1_entry_service_v1_pb.SigninRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<auth_v1_entry_service_v1_pb.SigninResponse>;

}

