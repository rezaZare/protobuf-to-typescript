import * as jspb from 'google-protobuf'



export class SendVerificationCodeRequest extends jspb.Message {
  getEmail(): string;
  setEmail(value: string): SendVerificationCodeRequest;

  getPhone(): string;
  setPhone(value: string): SendVerificationCodeRequest;

  getCredentialCase(): SendVerificationCodeRequest.CredentialCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SendVerificationCodeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SendVerificationCodeRequest): SendVerificationCodeRequest.AsObject;
  static serializeBinaryToWriter(message: SendVerificationCodeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SendVerificationCodeRequest;
  static deserializeBinaryFromReader(message: SendVerificationCodeRequest, reader: jspb.BinaryReader): SendVerificationCodeRequest;
}

export namespace SendVerificationCodeRequest {
  export type AsObject = {
    email: string,
    phone: string,
  }

  export enum CredentialCase { 
    CREDENTIAL_NOT_SET = 0,
    EMAIL = 1,
    PHONE = 2,
  }
}

export class SendVerificationCodeResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SendVerificationCodeResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SendVerificationCodeResponse): SendVerificationCodeResponse.AsObject;
  static serializeBinaryToWriter(message: SendVerificationCodeResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SendVerificationCodeResponse;
  static deserializeBinaryFromReader(message: SendVerificationCodeResponse, reader: jspb.BinaryReader): SendVerificationCodeResponse;
}

export namespace SendVerificationCodeResponse {
  export type AsObject = {
  }
}

export class CheckVerificationCodeRequest extends jspb.Message {
  getEmail(): string;
  setEmail(value: string): CheckVerificationCodeRequest;

  getPhone(): string;
  setPhone(value: string): CheckVerificationCodeRequest;

  getVerificationCode(): string;
  setVerificationCode(value: string): CheckVerificationCodeRequest;

  getCredentialCase(): CheckVerificationCodeRequest.CredentialCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckVerificationCodeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CheckVerificationCodeRequest): CheckVerificationCodeRequest.AsObject;
  static serializeBinaryToWriter(message: CheckVerificationCodeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckVerificationCodeRequest;
  static deserializeBinaryFromReader(message: CheckVerificationCodeRequest, reader: jspb.BinaryReader): CheckVerificationCodeRequest;
}

export namespace CheckVerificationCodeRequest {
  export type AsObject = {
    email: string,
    phone: string,
    verificationCode: string,
  }

  export enum CredentialCase { 
    CREDENTIAL_NOT_SET = 0,
    EMAIL = 1,
    PHONE = 2,
  }
}

export class CheckVerificationCodeResponse extends jspb.Message {
  getVerifiedToken(): string;
  setVerifiedToken(value: string): CheckVerificationCodeResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckVerificationCodeResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CheckVerificationCodeResponse): CheckVerificationCodeResponse.AsObject;
  static serializeBinaryToWriter(message: CheckVerificationCodeResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckVerificationCodeResponse;
  static deserializeBinaryFromReader(message: CheckVerificationCodeResponse, reader: jspb.BinaryReader): CheckVerificationCodeResponse;
}

export namespace CheckVerificationCodeResponse {
  export type AsObject = {
    verifiedToken: string,
  }
}

export class SignupRequest extends jspb.Message {
  getVerifiedToken(): string;
  setVerifiedToken(value: string): SignupRequest;

  getPassword(): string;
  setPassword(value: string): SignupRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SignupRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SignupRequest): SignupRequest.AsObject;
  static serializeBinaryToWriter(message: SignupRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SignupRequest;
  static deserializeBinaryFromReader(message: SignupRequest, reader: jspb.BinaryReader): SignupRequest;
}

export namespace SignupRequest {
  export type AsObject = {
    verifiedToken: string,
    password: string,
  }
}

export class SignupResponse extends jspb.Message {
  getSessionToken(): string;
  setSessionToken(value: string): SignupResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SignupResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SignupResponse): SignupResponse.AsObject;
  static serializeBinaryToWriter(message: SignupResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SignupResponse;
  static deserializeBinaryFromReader(message: SignupResponse, reader: jspb.BinaryReader): SignupResponse;
}

export namespace SignupResponse {
  export type AsObject = {
    sessionToken: string,
  }
}

export class SigninRequest extends jspb.Message {
  getEmail(): string;
  setEmail(value: string): SigninRequest;

  getPhone(): string;
  setPhone(value: string): SigninRequest;

  getPassword(): string;
  setPassword(value: string): SigninRequest;

  getRememberMe(): boolean;
  setRememberMe(value: boolean): SigninRequest;

  getRole(): string;
  setRole(value: string): SigninRequest;
  hasRole(): boolean;
  clearRole(): SigninRequest;

  getCaptchaId(): string;
  setCaptchaId(value: string): SigninRequest;
  hasCaptchaId(): boolean;
  clearCaptchaId(): SigninRequest;

  getCaptchaResponse(): string;
  setCaptchaResponse(value: string): SigninRequest;
  hasCaptchaResponse(): boolean;
  clearCaptchaResponse(): SigninRequest;

  getCredentialCase(): SigninRequest.CredentialCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SigninRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SigninRequest): SigninRequest.AsObject;
  static serializeBinaryToWriter(message: SigninRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SigninRequest;
  static deserializeBinaryFromReader(message: SigninRequest, reader: jspb.BinaryReader): SigninRequest;
}

export namespace SigninRequest {
  export type AsObject = {
    email: string,
    phone: string,
    password: string,
    rememberMe: boolean,
    role?: string,
    captchaId?: string,
    captchaResponse?: string,
  }

  export enum CredentialCase { 
    CREDENTIAL_NOT_SET = 0,
    EMAIL = 1,
    PHONE = 2,
  }

  export enum RoleCase { 
    _ROLE_NOT_SET = 0,
    ROLE = 5,
  }

  export enum CaptchaIdCase { 
    _CAPTCHA_ID_NOT_SET = 0,
    CAPTCHA_ID = 6,
  }

  export enum CaptchaResponseCase { 
    _CAPTCHA_RESPONSE_NOT_SET = 0,
    CAPTCHA_RESPONSE = 7,
  }
}

export class SigninResponse extends jspb.Message {
  getSessionToken(): string;
  setSessionToken(value: string): SigninResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SigninResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SigninResponse): SigninResponse.AsObject;
  static serializeBinaryToWriter(message: SigninResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SigninResponse;
  static deserializeBinaryFromReader(message: SigninResponse, reader: jspb.BinaryReader): SigninResponse;
}

export namespace SigninResponse {
  export type AsObject = {
    sessionToken: string,
  }
}

