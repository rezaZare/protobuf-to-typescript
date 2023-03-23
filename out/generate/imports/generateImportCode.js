"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateImportCode = void 0;
var ts_poet_1 = require("ts-poet");
function generateImportCode(elements) {
    var chunks = [];
    if (elements.length > 0) {
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var path_1 = elements_1[_i];
            if (path_1.startsWith("google")) {
                // protobuff
            }
            else {
                var splList = path_1.split("/");
                var file = splList.splice(splList.length - 1, 1);
                if (splList.length > 0) {
                    var prePath = "";
                    for (var _a = 0, splList_1 = splList; _a < splList_1.length; _a++) {
                        var pre = splList_1[_a];
                        prePath += "../";
                    }
                    chunks.push((0, ts_poet_1.imp)("".concat(splList.join("_"), "*").concat(prePath).concat(splList.join("/"), "/").concat(file[0].replace(".proto", ""), " ")));
                }
                else {
                    chunks.push((0, ts_poet_1.imp)("".concat(splList.join("_"), "*./").concat(file[0].replace(".proto", ""), " ")));
                }
            }
        }
    }
    //'workflow/common/types_common_v1.proto'
    //common/types_common_v1.proto
    //types_common_v1.proto
    //'google/protobuf/empty.proto'
    //   chunks.push(code`export enum ${element.name} {`);
    //   for (const [key, value] of Object.entries(element.values)) {
    //     chunks.push(code`${key}= ${value},`);
    //   }
    //   chunks.push(code`}`);
    return chunks;
}
exports.generateImportCode = generateImportCode;
//# sourceMappingURL=generateImportCode.js.map