import { code } from "ts-poet";

export function generateToProto() {
  return code`
    
import * as jspb from 'google-protobuf';

const isEmptyObject = (obj) =>
  typeof obj === 'object' && Object.keys(obj).length === 0 && obj.constructor === Object;

const createProxy = (msg) => {
  if (!msg || typeof msg !== 'object') {
    return msg;
  }
  if (Array.isArray(msg)) {
    return msg.map(createProxy);
  }
  return new Proxy(msg, {
    get: function (target, prop) {
      const fieldUpper = typeof prop == 'string' ? prop.replace(/get/g, '') : '';
      const fieldName = \` $\{fieldUpper[0].toLowerCase()}$\{fieldUpper.substring(1)}\`
      const value = target[fieldName];
      return () => (value === null || isEmptyObject(value) ? null : createProxy(value));
    },
  });
};

// export const protoMsgFromJson = (protoObject, ProtoClass) =>
//   protoMsgFromObject(JSON.parse(protoObject), ProtoClass);

/**
 * Serialize protobuf message fromObject
 *
 * @param {any} protoObject
 * @param {typeof require('google-protobuf').Message} ProtoClass
 * @see https://github.com/sglim/protobuf-js-from-object for inspiration
 * @returns {typeof require('google-protobuf').Message} ProtoClass instance
 */
export const toProto = (ProtoClass, protoObject) => {
  debugger;
  if (jspb === undefined) {
    throw new Error('Please include google-protobuf.js');
  }
  const writer = new jspb.BinaryWriter();
  let x = createProxy(protoObject);

  ProtoClass.serializeBinaryToWriter(x, writer);
  return ProtoClass.deserializeBinary(writer.getResultBuffer());
};

`;
}
