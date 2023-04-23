import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace auth. */
export namespace auth {

    /** Namespace v1. */
    namespace v1 {

        /** Represents an EntryService */
        class EntryService extends $protobuf.rpc.Service {

            /**
             * Constructs a new EntryService service.
             * @param rpcImpl RPC implementation
             * @param [requestDelimited=false] Whether requests are length-delimited
             * @param [responseDelimited=false] Whether responses are length-delimited
             */
            constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

            /**
             * Calls SendVerificationCode.
             * @param request SendVerificationCodeRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and SendVerificationCodeResponse
             */
            public sendVerificationCode(request: auth.v1.ISendVerificationCodeRequest, callback: auth.v1.EntryService.SendVerificationCodeCallback): void;

            /**
             * Calls SendVerificationCode.
             * @param request SendVerificationCodeRequest message or plain object
             * @returns Promise
             */
            public sendVerificationCode(request: auth.v1.ISendVerificationCodeRequest): Promise<auth.v1.SendVerificationCodeResponse>;

            /**
             * Calls CheckVerificationCode.
             * @param request CheckVerificationCodeRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and CheckVerificationCodeResponse
             */
            public checkVerificationCode(request: auth.v1.ICheckVerificationCodeRequest, callback: auth.v1.EntryService.CheckVerificationCodeCallback): void;

            /**
             * Calls CheckVerificationCode.
             * @param request CheckVerificationCodeRequest message or plain object
             * @returns Promise
             */
            public checkVerificationCode(request: auth.v1.ICheckVerificationCodeRequest): Promise<auth.v1.CheckVerificationCodeResponse>;

            /**
             * Calls Signup.
             * @param request SignupRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and SignupResponse
             */
            public signup(request: auth.v1.ISignupRequest, callback: auth.v1.EntryService.SignupCallback): void;

            /**
             * Calls Signup.
             * @param request SignupRequest message or plain object
             * @returns Promise
             */
            public signup(request: auth.v1.ISignupRequest): Promise<auth.v1.SignupResponse>;

            /**
             * Calls Signin.
             * @param request SigninRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and SigninResponse
             */
            public signin(request: auth.v1.ISigninRequest, callback: auth.v1.EntryService.SigninCallback): void;

            /**
             * Calls Signin.
             * @param request SigninRequest message or plain object
             * @returns Promise
             */
            public signin(request: auth.v1.ISigninRequest): Promise<auth.v1.SigninResponse>;
        }

        namespace EntryService {

            /**
             * Callback as used by {@link auth.v1.EntryService#sendVerificationCode}.
             * @param error Error, if any
             * @param [response] SendVerificationCodeResponse
             */
            type SendVerificationCodeCallback = (error: (Error|null), response?: auth.v1.SendVerificationCodeResponse) => void;

            /**
             * Callback as used by {@link auth.v1.EntryService#checkVerificationCode}.
             * @param error Error, if any
             * @param [response] CheckVerificationCodeResponse
             */
            type CheckVerificationCodeCallback = (error: (Error|null), response?: auth.v1.CheckVerificationCodeResponse) => void;

            /**
             * Callback as used by {@link auth.v1.EntryService#signup}.
             * @param error Error, if any
             * @param [response] SignupResponse
             */
            type SignupCallback = (error: (Error|null), response?: auth.v1.SignupResponse) => void;

            /**
             * Callback as used by {@link auth.v1.EntryService#signin}.
             * @param error Error, if any
             * @param [response] SigninResponse
             */
            type SigninCallback = (error: (Error|null), response?: auth.v1.SigninResponse) => void;
        }

        /** Properties of a SendVerificationCodeRequest. */
        interface ISendVerificationCodeRequest {

            /** SendVerificationCodeRequest email */
            email?: (string|null);

            /** SendVerificationCodeRequest phone */
            phone?: (string|null);
        }

        /** Represents a SendVerificationCodeRequest. */
        class SendVerificationCodeRequest implements ISendVerificationCodeRequest {

            /**
             * Constructs a new SendVerificationCodeRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: auth.v1.ISendVerificationCodeRequest);

            /** SendVerificationCodeRequest email. */
            public email?: (string|null);

            /** SendVerificationCodeRequest phone. */
            public phone?: (string|null);

            /** SendVerificationCodeRequest credential. */
            public credential?: ("email"|"phone");

            /**
             * Encodes the specified SendVerificationCodeRequest message. Does not implicitly {@link auth.v1.SendVerificationCodeRequest.verify|verify} messages.
             * @param message SendVerificationCodeRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: auth.v1.ISendVerificationCodeRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SendVerificationCodeRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SendVerificationCodeRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): auth.v1.SendVerificationCodeRequest;

            /**
             * Gets the default type url for SendVerificationCodeRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a SendVerificationCodeResponse. */
        interface ISendVerificationCodeResponse {
        }

        /** Represents a SendVerificationCodeResponse. */
        class SendVerificationCodeResponse implements ISendVerificationCodeResponse {

            /**
             * Constructs a new SendVerificationCodeResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: auth.v1.ISendVerificationCodeResponse);

            /**
             * Encodes the specified SendVerificationCodeResponse message. Does not implicitly {@link auth.v1.SendVerificationCodeResponse.verify|verify} messages.
             * @param message SendVerificationCodeResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: auth.v1.ISendVerificationCodeResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SendVerificationCodeResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SendVerificationCodeResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): auth.v1.SendVerificationCodeResponse;

            /**
             * Gets the default type url for SendVerificationCodeResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CheckVerificationCodeRequest. */
        interface ICheckVerificationCodeRequest {

            /** CheckVerificationCodeRequest email */
            email?: (string|null);

            /** CheckVerificationCodeRequest phone */
            phone?: (string|null);

            /** CheckVerificationCodeRequest verification_code */
            verification_code?: (string|null);
        }

        /** Represents a CheckVerificationCodeRequest. */
        class CheckVerificationCodeRequest implements ICheckVerificationCodeRequest {

            /**
             * Constructs a new CheckVerificationCodeRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: auth.v1.ICheckVerificationCodeRequest);

            /** CheckVerificationCodeRequest email. */
            public email?: (string|null);

            /** CheckVerificationCodeRequest phone. */
            public phone?: (string|null);

            /** CheckVerificationCodeRequest verification_code. */
            public verification_code: string;

            /** CheckVerificationCodeRequest credential. */
            public credential?: ("email"|"phone");

            /**
             * Encodes the specified CheckVerificationCodeRequest message. Does not implicitly {@link auth.v1.CheckVerificationCodeRequest.verify|verify} messages.
             * @param message CheckVerificationCodeRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: auth.v1.ICheckVerificationCodeRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CheckVerificationCodeRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CheckVerificationCodeRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): auth.v1.CheckVerificationCodeRequest;

            /**
             * Gets the default type url for CheckVerificationCodeRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CheckVerificationCodeResponse. */
        interface ICheckVerificationCodeResponse {

            /** CheckVerificationCodeResponse verified_token */
            verified_token?: (string|null);
        }

        /** Represents a CheckVerificationCodeResponse. */
        class CheckVerificationCodeResponse implements ICheckVerificationCodeResponse {

            /**
             * Constructs a new CheckVerificationCodeResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: auth.v1.ICheckVerificationCodeResponse);

            /** CheckVerificationCodeResponse verified_token. */
            public verified_token: string;

            /**
             * Encodes the specified CheckVerificationCodeResponse message. Does not implicitly {@link auth.v1.CheckVerificationCodeResponse.verify|verify} messages.
             * @param message CheckVerificationCodeResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: auth.v1.ICheckVerificationCodeResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CheckVerificationCodeResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CheckVerificationCodeResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): auth.v1.CheckVerificationCodeResponse;

            /**
             * Gets the default type url for CheckVerificationCodeResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a SignupRequest. */
        interface ISignupRequest {

            /** SignupRequest verified_token */
            verified_token?: (string|null);

            /** SignupRequest password */
            password?: (string|null);
        }

        /** Represents a SignupRequest. */
        class SignupRequest implements ISignupRequest {

            /**
             * Constructs a new SignupRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: auth.v1.ISignupRequest);

            /** SignupRequest verified_token. */
            public verified_token: string;

            /** SignupRequest password. */
            public password: string;

            /**
             * Encodes the specified SignupRequest message. Does not implicitly {@link auth.v1.SignupRequest.verify|verify} messages.
             * @param message SignupRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: auth.v1.ISignupRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SignupRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SignupRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): auth.v1.SignupRequest;

            /**
             * Gets the default type url for SignupRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a SignupResponse. */
        interface ISignupResponse {

            /** SignupResponse session_token */
            session_token?: (string|null);
        }

        /** Represents a SignupResponse. */
        class SignupResponse implements ISignupResponse {

            /**
             * Constructs a new SignupResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: auth.v1.ISignupResponse);

            /** SignupResponse session_token. */
            public session_token: string;

            /**
             * Encodes the specified SignupResponse message. Does not implicitly {@link auth.v1.SignupResponse.verify|verify} messages.
             * @param message SignupResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: auth.v1.ISignupResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SignupResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SignupResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): auth.v1.SignupResponse;

            /**
             * Gets the default type url for SignupResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a SigninRequest. */
        interface ISigninRequest {

            /** SigninRequest email */
            email?: (string|null);

            /** SigninRequest phone */
            phone?: (string|null);

            /** SigninRequest password */
            password?: (string|null);

            /** SigninRequest remember_me */
            remember_me?: (boolean|null);

            /** SigninRequest role */
            role?: (string|null);

            /** SigninRequest captcha_id */
            captcha_id?: (string|null);

            /** SigninRequest captcha_response */
            captcha_response?: (string|null);
        }

        /** Represents a SigninRequest. */
        class SigninRequest implements ISigninRequest {

            /**
             * Constructs a new SigninRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: auth.v1.ISigninRequest);

            /** SigninRequest email. */
            public email?: (string|null);

            /** SigninRequest phone. */
            public phone?: (string|null);

            /** SigninRequest password. */
            public password: string;

            /** SigninRequest remember_me. */
            public remember_me: boolean;

            /** SigninRequest role. */
            public role?: (string|null);

            /** SigninRequest captcha_id. */
            public captcha_id?: (string|null);

            /** SigninRequest captcha_response. */
            public captcha_response?: (string|null);

            /** SigninRequest credential. */
            public credential?: ("email"|"phone");

            /** SigninRequest _role. */
            public _role?: "role";

            /** SigninRequest _captcha_id. */
            public _captcha_id?: "captcha_id";

            /** SigninRequest _captcha_response. */
            public _captcha_response?: "captcha_response";

            /**
             * Encodes the specified SigninRequest message. Does not implicitly {@link auth.v1.SigninRequest.verify|verify} messages.
             * @param message SigninRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: auth.v1.ISigninRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SigninRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SigninRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): auth.v1.SigninRequest;

            /**
             * Gets the default type url for SigninRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a SigninResponse. */
        interface ISigninResponse {

            /** SigninResponse session_token */
            session_token?: (string|null);
        }

        /** Represents a SigninResponse. */
        class SigninResponse implements ISigninResponse {

            /**
             * Constructs a new SigninResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: auth.v1.ISigninResponse);

            /** SigninResponse session_token. */
            public session_token: string;

            /**
             * Encodes the specified SigninResponse message. Does not implicitly {@link auth.v1.SigninResponse.verify|verify} messages.
             * @param message SigninResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: auth.v1.ISigninResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SigninResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SigninResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): auth.v1.SigninResponse;

            /**
             * Gets the default type url for SigninResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }
}
