"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootToDNamespace = void 0;
// eslint-disable-next-line import/no-import-module-exports
var protobufjs_1 = require("protobufjs");
var util_1 = require("util");
// function messageToDMessage(message: Type): DMessage {
// }
function findMethods(service) {
    var methods = {};
    // eslint-disable-next-line array-callback-return
    service.methodsArray.map(function (method) {
        console.log(method.name, method.type);
        methods[method.name] = {
            name: method.name,
            requestType: method.requestType,
            responseType: method.responseType,
        };
    });
    return methods;
}
function enumToDEnum(theEnum) {
    var _a, _b;
    var dEnum = {
        name: theEnum.name,
        fileName: (_a = theEnum.filename) !== null && _a !== void 0 ? _a : undefined,
        comment: (_b = theEnum.comment) !== null && _b !== void 0 ? _b : undefined,
        values: {},
        comments: {},
    };
    // eslint-disable-next-line array-callback-return
    Object.keys(theEnum.values).map(function (vName) {
        dEnum.values[vName] = theEnum.values[vName];
    });
    // eslint-disable-next-line array-callback-return
    Object.keys(dEnum.values).map(function (vName) {
        dEnum.comments[vName] = theEnum.comments[vName];
    });
    return dEnum;
}
function fieldToDField(theField) {
    var id = theField.id, name = theField.name, comment = theField.comment, type = theField.type /* filename, */, repeated = theField.repeated, optional = theField.optional, map = theField.map, required = theField.required;
    var field = {
        name: name,
        comment: comment !== null && comment !== void 0 ? comment : undefined,
        // fileName: filename ?? undefined,
        map: map,
        id: id,
        type: type,
        optional: optional,
        repeated: repeated,
        required: required,
        keyType: "",
    };
    if (theField instanceof protobufjs_1.MapField) {
        field.keyType = theField.keyType;
    }
    return field;
}
function typeToDType(theType) {
    var _a, _b;
    var message = {
        name: theType.name,
        fileName: (_a = theType.filename) !== null && _a !== void 0 ? _a : undefined,
        comment: (_b = theType.comment) !== null && _b !== void 0 ? _b : undefined,
        fields: {},
        types: {},
        enums: {},
    };
    // eslint-disable-next-line array-callback-return
    theType.fieldsArray.map(function (field) {
        message.fields[field.name] = fieldToDField(field);
    });
    // eslint-disable-next-line array-callback-return
    theType.nestedArray.map(function (rNested) {
        var nestedType = rNested.constructor.name;
        switch (nestedType) {
            case "Enum":
                message.enums[rNested.name] = enumToDEnum(rNested);
                break;
            case "Type":
                message.types[rNested.name] = typeToDType(rNested);
                break;
            default:
                console.log(theType.name
                // inspect(
                // 	{ ...theType, parent: null },
                // 	{
                // 		colors: true,
                // 		depth: 2,
                // 	}
                // )
                );
        }
    });
    return message;
}
function rootToDNamespace(root, knownNamespace) {
    var namespace = knownNamespace !== null && knownNamespace !== void 0 ? knownNamespace : {
        name: root.name,
        namespaces: {},
        services: {},
        methods: {},
        enums: {},
        types: {},
    };
    if (root.nestedArray.length > 0) {
        // eslint-disable-next-line array-callback-return
        root.nestedArray.map(function (rNested) {
            var nested = rNested;
            var nestedType = rNested.constructor.name;
            // if (nested.name.includes('google')) {
            //	return;
            // }
            if (nestedType === "Namespace") {
                namespace.namespaces[nested.name] = {
                    name: nested.name,
                    namespaces: {},
                    methods: {},
                    services: {},
                    enums: {},
                    types: {},
                };
                rootToDNamespace(nested, namespace.namespaces[nested.name]);
            }
            else if (nestedType === "Service") {
                // rootToDNamespace(nested, namespace.namespaces[nested.name]);
                namespace.services[nested.name] = {
                    methods: findMethods(rNested),
                };
            }
            else if (nestedType === "Enum") {
                namespace.enums[nested.name] = enumToDEnum(rNested);
            }
            else if (nestedType === "Type") {
                namespace.types[nested.name] = typeToDType(rNested);
            }
            else {
                console.log(namespace.name, nestedType, nested.name);
                console.log(namespace.name, (0, util_1.inspect)(__assign(__assign({}, nested), { parent: null }), {
                    colors: true,
                    depth: 2,
                }));
            }
        });
    }
    return namespace;
}
exports.rootToDNamespace = rootToDNamespace;
if (process.env.NODE_ENV === "test") {
    exports.enumToDEnum = enumToDEnum;
    exports.findMethods = findMethods;
}
//# sourceMappingURL=dService.js.map