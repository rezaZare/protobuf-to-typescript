/**
 * @fileoverview gRPC-Web generated client stub for auth.v1
 * @enhanceable
 * @public
 */

// Code generated by protoc-gen-grpc-web. DO NOT EDIT.
// versions:
// 	protoc-gen-grpc-web v1.4.1
// 	protoc              v0.0.0
// source: auth/v1/entry_service_v1.proto


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.auth = {};
proto.auth.v1 = require('./entry_service_v1_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.auth.v1.EntryServiceClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options.format = 'binary';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname.replace(/\/+$/, '');

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.auth.v1.EntryServicePromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options.format = 'binary';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname.replace(/\/+$/, '');

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.auth.v1.SendVerificationCodeRequest,
 *   !proto.auth.v1.SendVerificationCodeResponse>}
 */
const methodDescriptor_EntryService_SendVerificationCode = new grpc.web.MethodDescriptor(
  '/auth.v1.EntryService/SendVerificationCode',
  grpc.web.MethodType.UNARY,
  proto.auth.v1.SendVerificationCodeRequest,
  proto.auth.v1.SendVerificationCodeResponse,
  /**
   * @param {!proto.auth.v1.SendVerificationCodeRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.auth.v1.SendVerificationCodeResponse.deserializeBinary
);


/**
 * @param {!proto.auth.v1.SendVerificationCodeRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.auth.v1.SendVerificationCodeResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.auth.v1.SendVerificationCodeResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.auth.v1.EntryServiceClient.prototype.sendVerificationCode =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/auth.v1.EntryService/SendVerificationCode',
      request,
      metadata || {},
      methodDescriptor_EntryService_SendVerificationCode,
      callback);
};


/**
 * @param {!proto.auth.v1.SendVerificationCodeRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.auth.v1.SendVerificationCodeResponse>}
 *     Promise that resolves to the response
 */
proto.auth.v1.EntryServicePromiseClient.prototype.sendVerificationCode =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/auth.v1.EntryService/SendVerificationCode',
      request,
      metadata || {},
      methodDescriptor_EntryService_SendVerificationCode);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.auth.v1.CheckVerificationCodeRequest,
 *   !proto.auth.v1.CheckVerificationCodeResponse>}
 */
const methodDescriptor_EntryService_CheckVerificationCode = new grpc.web.MethodDescriptor(
  '/auth.v1.EntryService/CheckVerificationCode',
  grpc.web.MethodType.UNARY,
  proto.auth.v1.CheckVerificationCodeRequest,
  proto.auth.v1.CheckVerificationCodeResponse,
  /**
   * @param {!proto.auth.v1.CheckVerificationCodeRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.auth.v1.CheckVerificationCodeResponse.deserializeBinary
);


/**
 * @param {!proto.auth.v1.CheckVerificationCodeRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.auth.v1.CheckVerificationCodeResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.auth.v1.CheckVerificationCodeResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.auth.v1.EntryServiceClient.prototype.checkVerificationCode =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/auth.v1.EntryService/CheckVerificationCode',
      request,
      metadata || {},
      methodDescriptor_EntryService_CheckVerificationCode,
      callback);
};


/**
 * @param {!proto.auth.v1.CheckVerificationCodeRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.auth.v1.CheckVerificationCodeResponse>}
 *     Promise that resolves to the response
 */
proto.auth.v1.EntryServicePromiseClient.prototype.checkVerificationCode =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/auth.v1.EntryService/CheckVerificationCode',
      request,
      metadata || {},
      methodDescriptor_EntryService_CheckVerificationCode);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.auth.v1.SignupRequest,
 *   !proto.auth.v1.SignupResponse>}
 */
const methodDescriptor_EntryService_Signup = new grpc.web.MethodDescriptor(
  '/auth.v1.EntryService/Signup',
  grpc.web.MethodType.UNARY,
  proto.auth.v1.SignupRequest,
  proto.auth.v1.SignupResponse,
  /**
   * @param {!proto.auth.v1.SignupRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.auth.v1.SignupResponse.deserializeBinary
);


/**
 * @param {!proto.auth.v1.SignupRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.auth.v1.SignupResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.auth.v1.SignupResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.auth.v1.EntryServiceClient.prototype.signup =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/auth.v1.EntryService/Signup',
      request,
      metadata || {},
      methodDescriptor_EntryService_Signup,
      callback);
};


/**
 * @param {!proto.auth.v1.SignupRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.auth.v1.SignupResponse>}
 *     Promise that resolves to the response
 */
proto.auth.v1.EntryServicePromiseClient.prototype.signup =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/auth.v1.EntryService/Signup',
      request,
      metadata || {},
      methodDescriptor_EntryService_Signup);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.auth.v1.SigninRequest,
 *   !proto.auth.v1.SigninResponse>}
 */
const methodDescriptor_EntryService_Signin = new grpc.web.MethodDescriptor(
  '/auth.v1.EntryService/Signin',
  grpc.web.MethodType.UNARY,
  proto.auth.v1.SigninRequest,
  proto.auth.v1.SigninResponse,
  /**
   * @param {!proto.auth.v1.SigninRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.auth.v1.SigninResponse.deserializeBinary
);


/**
 * @param {!proto.auth.v1.SigninRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.auth.v1.SigninResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.auth.v1.SigninResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.auth.v1.EntryServiceClient.prototype.signin =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/auth.v1.EntryService/Signin',
      request,
      metadata || {},
      methodDescriptor_EntryService_Signin,
      callback);
};


/**
 * @param {!proto.auth.v1.SigninRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.auth.v1.SigninResponse>}
 *     Promise that resolves to the response
 */
proto.auth.v1.EntryServicePromiseClient.prototype.signin =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/auth.v1.EntryService/Signin',
      request,
      metadata || {},
      methodDescriptor_EntryService_Signin);
};


module.exports = proto.auth.v1;

