"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMetadata = void 0;
var ts_poet_1 = require("ts-poet");
function generateMetadata() {
    return (0, ts_poet_1.code)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    export type MetaData = { [key: string]: string } | {};\n// /**\n//  * Merge global metaData with the EUD(End user developer) ones\n//  */\n\nexport function mergeMetaData(metaData: MetaData): MetaData {\n  const authorization = localStorage.getItem(\"token\");\n  if (authorization && authorization?.length > 0) {\n    console.log(\"token\", { ...metaData, authorization });\n    return { ...metaData, authorization };\n  }\n  return metaData;\n}\n    "], ["\n    export type MetaData = { [key: string]: string } | {};\n// /**\n//  * Merge global metaData with the EUD(End user developer) ones\n//  */\n\nexport function mergeMetaData(metaData: MetaData): MetaData {\n  const authorization = localStorage.getItem(\"token\");\n  if (authorization && authorization?.length > 0) {\n    console.log(\"token\", { ...metaData, authorization });\n    return { ...metaData, authorization };\n  }\n  return metaData;\n}\n    "])));
}
exports.generateMetadata = generateMetadata;
var templateObject_1;
//# sourceMappingURL=metadata.js.map