/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.auth = (function() {

    /**
     * Namespace auth.
     * @exports auth
     * @namespace
     */
    var auth = {};

    auth.v1 = (function() {

        /**
         * Namespace v1.
         * @memberof auth
         * @namespace
         */
        var v1 = {};

        v1.EntryService = (function() {

            /**
             * Constructs a new EntryService service.
             * @memberof auth.v1
             * @classdesc Represents an EntryService
             * @extends $protobuf.rpc.Service
             * @constructor
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             */
            function EntryService(rpcImpl, requestDelimited, responseDelimited) {
                $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
            }

            (EntryService.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = EntryService;

            /**
             * Callback as used by {@link auth.v1.EntryService#sendVerificationCode}.
             * @memberof auth.v1.EntryService
             * @typedef SendVerificationCodeCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {auth.v1.SendVerificationCodeResponse} [response] SendVerificationCodeResponse
             */

            /**
             * Calls SendVerificationCode.
             * @function sendVerificationCode
             * @memberof auth.v1.EntryService
             * @instance
             * @param {auth.v1.ISendVerificationCodeRequest} request SendVerificationCodeRequest message or plain object
             * @param {auth.v1.EntryService.SendVerificationCodeCallback} callback Node-style callback called with the error, if any, and SendVerificationCodeResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(EntryService.prototype.sendVerificationCode = function sendVerificationCode(request, callback) {
                return this.rpcCall(sendVerificationCode, $root.auth.v1.SendVerificationCodeRequest, $root.auth.v1.SendVerificationCodeResponse, request, callback);
            }, "name", { value: "SendVerificationCode" });

            /**
             * Calls SendVerificationCode.
             * @function sendVerificationCode
             * @memberof auth.v1.EntryService
             * @instance
             * @param {auth.v1.ISendVerificationCodeRequest} request SendVerificationCodeRequest message or plain object
             * @returns {Promise<auth.v1.SendVerificationCodeResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link auth.v1.EntryService#checkVerificationCode}.
             * @memberof auth.v1.EntryService
             * @typedef CheckVerificationCodeCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {auth.v1.CheckVerificationCodeResponse} [response] CheckVerificationCodeResponse
             */

            /**
             * Calls CheckVerificationCode.
             * @function checkVerificationCode
             * @memberof auth.v1.EntryService
             * @instance
             * @param {auth.v1.ICheckVerificationCodeRequest} request CheckVerificationCodeRequest message or plain object
             * @param {auth.v1.EntryService.CheckVerificationCodeCallback} callback Node-style callback called with the error, if any, and CheckVerificationCodeResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(EntryService.prototype.checkVerificationCode = function checkVerificationCode(request, callback) {
                return this.rpcCall(checkVerificationCode, $root.auth.v1.CheckVerificationCodeRequest, $root.auth.v1.CheckVerificationCodeResponse, request, callback);
            }, "name", { value: "CheckVerificationCode" });

            /**
             * Calls CheckVerificationCode.
             * @function checkVerificationCode
             * @memberof auth.v1.EntryService
             * @instance
             * @param {auth.v1.ICheckVerificationCodeRequest} request CheckVerificationCodeRequest message or plain object
             * @returns {Promise<auth.v1.CheckVerificationCodeResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link auth.v1.EntryService#signup}.
             * @memberof auth.v1.EntryService
             * @typedef SignupCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {auth.v1.SignupResponse} [response] SignupResponse
             */

            /**
             * Calls Signup.
             * @function signup
             * @memberof auth.v1.EntryService
             * @instance
             * @param {auth.v1.ISignupRequest} request SignupRequest message or plain object
             * @param {auth.v1.EntryService.SignupCallback} callback Node-style callback called with the error, if any, and SignupResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(EntryService.prototype.signup = function signup(request, callback) {
                return this.rpcCall(signup, $root.auth.v1.SignupRequest, $root.auth.v1.SignupResponse, request, callback);
            }, "name", { value: "Signup" });

            /**
             * Calls Signup.
             * @function signup
             * @memberof auth.v1.EntryService
             * @instance
             * @param {auth.v1.ISignupRequest} request SignupRequest message or plain object
             * @returns {Promise<auth.v1.SignupResponse>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link auth.v1.EntryService#signin}.
             * @memberof auth.v1.EntryService
             * @typedef SigninCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {auth.v1.SigninResponse} [response] SigninResponse
             */

            /**
             * Calls Signin.
             * @function signin
             * @memberof auth.v1.EntryService
             * @instance
             * @param {auth.v1.ISigninRequest} request SigninRequest message or plain object
             * @param {auth.v1.EntryService.SigninCallback} callback Node-style callback called with the error, if any, and SigninResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(EntryService.prototype.signin = function signin(request, callback) {
                return this.rpcCall(signin, $root.auth.v1.SigninRequest, $root.auth.v1.SigninResponse, request, callback);
            }, "name", { value: "Signin" });

            /**
             * Calls Signin.
             * @function signin
             * @memberof auth.v1.EntryService
             * @instance
             * @param {auth.v1.ISigninRequest} request SigninRequest message or plain object
             * @returns {Promise<auth.v1.SigninResponse>} Promise
             * @variation 2
             */

            return EntryService;
        })();

        v1.SendVerificationCodeRequest = (function() {

            /**
             * Properties of a SendVerificationCodeRequest.
             * @memberof auth.v1
             * @interface ISendVerificationCodeRequest
             * @property {string|null} [email] SendVerificationCodeRequest email
             * @property {string|null} [phone] SendVerificationCodeRequest phone
             */

            /**
             * Constructs a new SendVerificationCodeRequest.
             * @memberof auth.v1
             * @classdesc Represents a SendVerificationCodeRequest.
             * @implements ISendVerificationCodeRequest
             * @constructor
             * @param {auth.v1.ISendVerificationCodeRequest=} [properties] Properties to set
             */
            function SendVerificationCodeRequest(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SendVerificationCodeRequest email.
             * @member {string|null|undefined} email
             * @memberof auth.v1.SendVerificationCodeRequest
             * @instance
             */
            SendVerificationCodeRequest.prototype.email = null;

            /**
             * SendVerificationCodeRequest phone.
             * @member {string|null|undefined} phone
             * @memberof auth.v1.SendVerificationCodeRequest
             * @instance
             */
            SendVerificationCodeRequest.prototype.phone = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * SendVerificationCodeRequest credential.
             * @member {"email"|"phone"|undefined} credential
             * @memberof auth.v1.SendVerificationCodeRequest
             * @instance
             */
            Object.defineProperty(SendVerificationCodeRequest.prototype, "credential", {
                get: $util.oneOfGetter($oneOfFields = ["email", "phone"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Encodes the specified SendVerificationCodeRequest message. Does not implicitly {@link auth.v1.SendVerificationCodeRequest.verify|verify} messages.
             * @function encode
             * @memberof auth.v1.SendVerificationCodeRequest
             * @static
             * @param {auth.v1.ISendVerificationCodeRequest} message SendVerificationCodeRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SendVerificationCodeRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.email != null && Object.hasOwnProperty.call(message, "email"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.email);
                if (message.phone != null && Object.hasOwnProperty.call(message, "phone"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.phone);
                return writer;
            };

            /**
             * Decodes a SendVerificationCodeRequest message from the specified reader or buffer.
             * @function decode
             * @memberof auth.v1.SendVerificationCodeRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {auth.v1.SendVerificationCodeRequest} SendVerificationCodeRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SendVerificationCodeRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.auth.v1.SendVerificationCodeRequest();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.email = reader.string();
                            break;
                        }
                    case 2: {
                            message.phone = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Gets the default type url for SendVerificationCodeRequest
             * @function getTypeUrl
             * @memberof auth.v1.SendVerificationCodeRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SendVerificationCodeRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/auth.v1.SendVerificationCodeRequest";
            };

            return SendVerificationCodeRequest;
        })();

        v1.SendVerificationCodeResponse = (function() {

            /**
             * Properties of a SendVerificationCodeResponse.
             * @memberof auth.v1
             * @interface ISendVerificationCodeResponse
             */

            /**
             * Constructs a new SendVerificationCodeResponse.
             * @memberof auth.v1
             * @classdesc Represents a SendVerificationCodeResponse.
             * @implements ISendVerificationCodeResponse
             * @constructor
             * @param {auth.v1.ISendVerificationCodeResponse=} [properties] Properties to set
             */
            function SendVerificationCodeResponse(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Encodes the specified SendVerificationCodeResponse message. Does not implicitly {@link auth.v1.SendVerificationCodeResponse.verify|verify} messages.
             * @function encode
             * @memberof auth.v1.SendVerificationCodeResponse
             * @static
             * @param {auth.v1.ISendVerificationCodeResponse} message SendVerificationCodeResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SendVerificationCodeResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Decodes a SendVerificationCodeResponse message from the specified reader or buffer.
             * @function decode
             * @memberof auth.v1.SendVerificationCodeResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {auth.v1.SendVerificationCodeResponse} SendVerificationCodeResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SendVerificationCodeResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.auth.v1.SendVerificationCodeResponse();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Gets the default type url for SendVerificationCodeResponse
             * @function getTypeUrl
             * @memberof auth.v1.SendVerificationCodeResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SendVerificationCodeResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/auth.v1.SendVerificationCodeResponse";
            };

            return SendVerificationCodeResponse;
        })();

        v1.CheckVerificationCodeRequest = (function() {

            /**
             * Properties of a CheckVerificationCodeRequest.
             * @memberof auth.v1
             * @interface ICheckVerificationCodeRequest
             * @property {string|null} [email] CheckVerificationCodeRequest email
             * @property {string|null} [phone] CheckVerificationCodeRequest phone
             * @property {string|null} [verification_code] CheckVerificationCodeRequest verification_code
             */

            /**
             * Constructs a new CheckVerificationCodeRequest.
             * @memberof auth.v1
             * @classdesc Represents a CheckVerificationCodeRequest.
             * @implements ICheckVerificationCodeRequest
             * @constructor
             * @param {auth.v1.ICheckVerificationCodeRequest=} [properties] Properties to set
             */
            function CheckVerificationCodeRequest(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CheckVerificationCodeRequest email.
             * @member {string|null|undefined} email
             * @memberof auth.v1.CheckVerificationCodeRequest
             * @instance
             */
            CheckVerificationCodeRequest.prototype.email = null;

            /**
             * CheckVerificationCodeRequest phone.
             * @member {string|null|undefined} phone
             * @memberof auth.v1.CheckVerificationCodeRequest
             * @instance
             */
            CheckVerificationCodeRequest.prototype.phone = null;

            /**
             * CheckVerificationCodeRequest verification_code.
             * @member {string} verification_code
             * @memberof auth.v1.CheckVerificationCodeRequest
             * @instance
             */
            CheckVerificationCodeRequest.prototype.verification_code = "";

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * CheckVerificationCodeRequest credential.
             * @member {"email"|"phone"|undefined} credential
             * @memberof auth.v1.CheckVerificationCodeRequest
             * @instance
             */
            Object.defineProperty(CheckVerificationCodeRequest.prototype, "credential", {
                get: $util.oneOfGetter($oneOfFields = ["email", "phone"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Encodes the specified CheckVerificationCodeRequest message. Does not implicitly {@link auth.v1.CheckVerificationCodeRequest.verify|verify} messages.
             * @function encode
             * @memberof auth.v1.CheckVerificationCodeRequest
             * @static
             * @param {auth.v1.ICheckVerificationCodeRequest} message CheckVerificationCodeRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CheckVerificationCodeRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.email != null && Object.hasOwnProperty.call(message, "email"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.email);
                if (message.phone != null && Object.hasOwnProperty.call(message, "phone"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.phone);
                if (message.verification_code != null && Object.hasOwnProperty.call(message, "verification_code"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.verification_code);
                return writer;
            };

            /**
             * Decodes a CheckVerificationCodeRequest message from the specified reader or buffer.
             * @function decode
             * @memberof auth.v1.CheckVerificationCodeRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {auth.v1.CheckVerificationCodeRequest} CheckVerificationCodeRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CheckVerificationCodeRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.auth.v1.CheckVerificationCodeRequest();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.email = reader.string();
                            break;
                        }
                    case 2: {
                            message.phone = reader.string();
                            break;
                        }
                    case 3: {
                            message.verification_code = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Gets the default type url for CheckVerificationCodeRequest
             * @function getTypeUrl
             * @memberof auth.v1.CheckVerificationCodeRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            CheckVerificationCodeRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/auth.v1.CheckVerificationCodeRequest";
            };

            return CheckVerificationCodeRequest;
        })();

        v1.CheckVerificationCodeResponse = (function() {

            /**
             * Properties of a CheckVerificationCodeResponse.
             * @memberof auth.v1
             * @interface ICheckVerificationCodeResponse
             * @property {string|null} [verified_token] CheckVerificationCodeResponse verified_token
             */

            /**
             * Constructs a new CheckVerificationCodeResponse.
             * @memberof auth.v1
             * @classdesc Represents a CheckVerificationCodeResponse.
             * @implements ICheckVerificationCodeResponse
             * @constructor
             * @param {auth.v1.ICheckVerificationCodeResponse=} [properties] Properties to set
             */
            function CheckVerificationCodeResponse(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CheckVerificationCodeResponse verified_token.
             * @member {string} verified_token
             * @memberof auth.v1.CheckVerificationCodeResponse
             * @instance
             */
            CheckVerificationCodeResponse.prototype.verified_token = "";

            /**
             * Encodes the specified CheckVerificationCodeResponse message. Does not implicitly {@link auth.v1.CheckVerificationCodeResponse.verify|verify} messages.
             * @function encode
             * @memberof auth.v1.CheckVerificationCodeResponse
             * @static
             * @param {auth.v1.ICheckVerificationCodeResponse} message CheckVerificationCodeResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CheckVerificationCodeResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.verified_token != null && Object.hasOwnProperty.call(message, "verified_token"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.verified_token);
                return writer;
            };

            /**
             * Decodes a CheckVerificationCodeResponse message from the specified reader or buffer.
             * @function decode
             * @memberof auth.v1.CheckVerificationCodeResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {auth.v1.CheckVerificationCodeResponse} CheckVerificationCodeResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CheckVerificationCodeResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.auth.v1.CheckVerificationCodeResponse();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.verified_token = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Gets the default type url for CheckVerificationCodeResponse
             * @function getTypeUrl
             * @memberof auth.v1.CheckVerificationCodeResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            CheckVerificationCodeResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/auth.v1.CheckVerificationCodeResponse";
            };

            return CheckVerificationCodeResponse;
        })();

        v1.SignupRequest = (function() {

            /**
             * Properties of a SignupRequest.
             * @memberof auth.v1
             * @interface ISignupRequest
             * @property {string|null} [verified_token] SignupRequest verified_token
             * @property {string|null} [password] SignupRequest password
             */

            /**
             * Constructs a new SignupRequest.
             * @memberof auth.v1
             * @classdesc Represents a SignupRequest.
             * @implements ISignupRequest
             * @constructor
             * @param {auth.v1.ISignupRequest=} [properties] Properties to set
             */
            function SignupRequest(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SignupRequest verified_token.
             * @member {string} verified_token
             * @memberof auth.v1.SignupRequest
             * @instance
             */
            SignupRequest.prototype.verified_token = "";

            /**
             * SignupRequest password.
             * @member {string} password
             * @memberof auth.v1.SignupRequest
             * @instance
             */
            SignupRequest.prototype.password = "";

            /**
             * Encodes the specified SignupRequest message. Does not implicitly {@link auth.v1.SignupRequest.verify|verify} messages.
             * @function encode
             * @memberof auth.v1.SignupRequest
             * @static
             * @param {auth.v1.ISignupRequest} message SignupRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SignupRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.verified_token != null && Object.hasOwnProperty.call(message, "verified_token"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.verified_token);
                if (message.password != null && Object.hasOwnProperty.call(message, "password"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.password);
                return writer;
            };

            /**
             * Decodes a SignupRequest message from the specified reader or buffer.
             * @function decode
             * @memberof auth.v1.SignupRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {auth.v1.SignupRequest} SignupRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SignupRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.auth.v1.SignupRequest();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.verified_token = reader.string();
                            break;
                        }
                    case 4: {
                            message.password = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Gets the default type url for SignupRequest
             * @function getTypeUrl
             * @memberof auth.v1.SignupRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SignupRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/auth.v1.SignupRequest";
            };

            return SignupRequest;
        })();

        v1.SignupResponse = (function() {

            /**
             * Properties of a SignupResponse.
             * @memberof auth.v1
             * @interface ISignupResponse
             * @property {string|null} [session_token] SignupResponse session_token
             */

            /**
             * Constructs a new SignupResponse.
             * @memberof auth.v1
             * @classdesc Represents a SignupResponse.
             * @implements ISignupResponse
             * @constructor
             * @param {auth.v1.ISignupResponse=} [properties] Properties to set
             */
            function SignupResponse(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SignupResponse session_token.
             * @member {string} session_token
             * @memberof auth.v1.SignupResponse
             * @instance
             */
            SignupResponse.prototype.session_token = "";

            /**
             * Encodes the specified SignupResponse message. Does not implicitly {@link auth.v1.SignupResponse.verify|verify} messages.
             * @function encode
             * @memberof auth.v1.SignupResponse
             * @static
             * @param {auth.v1.ISignupResponse} message SignupResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SignupResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.session_token != null && Object.hasOwnProperty.call(message, "session_token"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.session_token);
                return writer;
            };

            /**
             * Decodes a SignupResponse message from the specified reader or buffer.
             * @function decode
             * @memberof auth.v1.SignupResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {auth.v1.SignupResponse} SignupResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SignupResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.auth.v1.SignupResponse();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.session_token = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Gets the default type url for SignupResponse
             * @function getTypeUrl
             * @memberof auth.v1.SignupResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SignupResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/auth.v1.SignupResponse";
            };

            return SignupResponse;
        })();

        v1.SigninRequest = (function() {

            /**
             * Properties of a SigninRequest.
             * @memberof auth.v1
             * @interface ISigninRequest
             * @property {string|null} [email] SigninRequest email
             * @property {string|null} [phone] SigninRequest phone
             * @property {string|null} [password] SigninRequest password
             * @property {boolean|null} [remember_me] SigninRequest remember_me
             * @property {string|null} [role] SigninRequest role
             * @property {string|null} [captcha_id] SigninRequest captcha_id
             * @property {string|null} [captcha_response] SigninRequest captcha_response
             */

            /**
             * Constructs a new SigninRequest.
             * @memberof auth.v1
             * @classdesc Represents a SigninRequest.
             * @implements ISigninRequest
             * @constructor
             * @param {auth.v1.ISigninRequest=} [properties] Properties to set
             */
            function SigninRequest(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SigninRequest email.
             * @member {string|null|undefined} email
             * @memberof auth.v1.SigninRequest
             * @instance
             */
            SigninRequest.prototype.email = null;

            /**
             * SigninRequest phone.
             * @member {string|null|undefined} phone
             * @memberof auth.v1.SigninRequest
             * @instance
             */
            SigninRequest.prototype.phone = null;

            /**
             * SigninRequest password.
             * @member {string} password
             * @memberof auth.v1.SigninRequest
             * @instance
             */
            SigninRequest.prototype.password = "";

            /**
             * SigninRequest remember_me.
             * @member {boolean} remember_me
             * @memberof auth.v1.SigninRequest
             * @instance
             */
            SigninRequest.prototype.remember_me = false;

            /**
             * SigninRequest role.
             * @member {string|null|undefined} role
             * @memberof auth.v1.SigninRequest
             * @instance
             */
            SigninRequest.prototype.role = null;

            /**
             * SigninRequest captcha_id.
             * @member {string|null|undefined} captcha_id
             * @memberof auth.v1.SigninRequest
             * @instance
             */
            SigninRequest.prototype.captcha_id = null;

            /**
             * SigninRequest captcha_response.
             * @member {string|null|undefined} captcha_response
             * @memberof auth.v1.SigninRequest
             * @instance
             */
            SigninRequest.prototype.captcha_response = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * SigninRequest credential.
             * @member {"email"|"phone"|undefined} credential
             * @memberof auth.v1.SigninRequest
             * @instance
             */
            Object.defineProperty(SigninRequest.prototype, "credential", {
                get: $util.oneOfGetter($oneOfFields = ["email", "phone"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * SigninRequest _role.
             * @member {"role"|undefined} _role
             * @memberof auth.v1.SigninRequest
             * @instance
             */
            Object.defineProperty(SigninRequest.prototype, "_role", {
                get: $util.oneOfGetter($oneOfFields = ["role"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * SigninRequest _captcha_id.
             * @member {"captcha_id"|undefined} _captcha_id
             * @memberof auth.v1.SigninRequest
             * @instance
             */
            Object.defineProperty(SigninRequest.prototype, "_captcha_id", {
                get: $util.oneOfGetter($oneOfFields = ["captcha_id"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * SigninRequest _captcha_response.
             * @member {"captcha_response"|undefined} _captcha_response
             * @memberof auth.v1.SigninRequest
             * @instance
             */
            Object.defineProperty(SigninRequest.prototype, "_captcha_response", {
                get: $util.oneOfGetter($oneOfFields = ["captcha_response"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Encodes the specified SigninRequest message. Does not implicitly {@link auth.v1.SigninRequest.verify|verify} messages.
             * @function encode
             * @memberof auth.v1.SigninRequest
             * @static
             * @param {auth.v1.ISigninRequest} message SigninRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SigninRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.email != null && Object.hasOwnProperty.call(message, "email"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.email);
                if (message.phone != null && Object.hasOwnProperty.call(message, "phone"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.phone);
                if (message.password != null && Object.hasOwnProperty.call(message, "password"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.password);
                if (message.remember_me != null && Object.hasOwnProperty.call(message, "remember_me"))
                    writer.uint32(/* id 4, wireType 0 =*/32).bool(message.remember_me);
                if (message.role != null && Object.hasOwnProperty.call(message, "role"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.role);
                if (message.captcha_id != null && Object.hasOwnProperty.call(message, "captcha_id"))
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.captcha_id);
                if (message.captcha_response != null && Object.hasOwnProperty.call(message, "captcha_response"))
                    writer.uint32(/* id 7, wireType 2 =*/58).string(message.captcha_response);
                return writer;
            };

            /**
             * Decodes a SigninRequest message from the specified reader or buffer.
             * @function decode
             * @memberof auth.v1.SigninRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {auth.v1.SigninRequest} SigninRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SigninRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.auth.v1.SigninRequest();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.email = reader.string();
                            break;
                        }
                    case 2: {
                            message.phone = reader.string();
                            break;
                        }
                    case 3: {
                            message.password = reader.string();
                            break;
                        }
                    case 4: {
                            message.remember_me = reader.bool();
                            break;
                        }
                    case 5: {
                            message.role = reader.string();
                            break;
                        }
                    case 6: {
                            message.captcha_id = reader.string();
                            break;
                        }
                    case 7: {
                            message.captcha_response = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Gets the default type url for SigninRequest
             * @function getTypeUrl
             * @memberof auth.v1.SigninRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SigninRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/auth.v1.SigninRequest";
            };

            return SigninRequest;
        })();

        v1.SigninResponse = (function() {

            /**
             * Properties of a SigninResponse.
             * @memberof auth.v1
             * @interface ISigninResponse
             * @property {string|null} [session_token] SigninResponse session_token
             */

            /**
             * Constructs a new SigninResponse.
             * @memberof auth.v1
             * @classdesc Represents a SigninResponse.
             * @implements ISigninResponse
             * @constructor
             * @param {auth.v1.ISigninResponse=} [properties] Properties to set
             */
            function SigninResponse(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SigninResponse session_token.
             * @member {string} session_token
             * @memberof auth.v1.SigninResponse
             * @instance
             */
            SigninResponse.prototype.session_token = "";

            /**
             * Encodes the specified SigninResponse message. Does not implicitly {@link auth.v1.SigninResponse.verify|verify} messages.
             * @function encode
             * @memberof auth.v1.SigninResponse
             * @static
             * @param {auth.v1.ISigninResponse} message SigninResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SigninResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.session_token != null && Object.hasOwnProperty.call(message, "session_token"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.session_token);
                return writer;
            };

            /**
             * Decodes a SigninResponse message from the specified reader or buffer.
             * @function decode
             * @memberof auth.v1.SigninResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {auth.v1.SigninResponse} SigninResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SigninResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.auth.v1.SigninResponse();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.session_token = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Gets the default type url for SigninResponse
             * @function getTypeUrl
             * @memberof auth.v1.SigninResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SigninResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/auth.v1.SigninResponse";
            };

            return SigninResponse;
        })();

        return v1;
    })();

    return auth;
})();

module.exports = $root;
