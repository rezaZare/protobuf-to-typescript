"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceGenerator = void 0;
var protobuf = __importStar(require("protobufjs"));
var ServiceGenerator = /** @class */ (function () {
    //outDir:./sample/proto/admin_service_v1.proto
    function ServiceGenerator(root, outDir) {
        this.load(root.nested);
    }
    ServiceGenerator.prototype.load = function (element) {
        var name = element.name;
        if (typeof element == "object") {
            for (var _i = 0, _a = Object.entries(element); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                if (value instanceof protobuf.Service) {
                    debugger;
                }
                else if (value instanceof protobuf.Namespace) {
                    if (value.nested) {
                        this.load(value.nested);
                    }
                }
            }
        }
    };
    return ServiceGenerator;
}());
exports.ServiceGenerator = ServiceGenerator;
//# sourceMappingURL=serviceGenerat.js.map