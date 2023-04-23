"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMetadata = void 0;
function generateMetadata() {
    return "\n    export type MetaData = { [key: string]: string } | {};\n// /**\n//  * Merge global metaData with the EUD(End user developer) ones\n//  */\n\nexport function mergeMetaData(metaData: MetaData): MetaData {\n  const authorization = localStorage.getItem(\"token\");\n  if (authorization && authorization?.length > 0) {\n    console.log(\"token\", { ...metaData, authorization });\n    return { ...metaData, authorization };\n  }\n  return metaData;\n}\n    ";
}
exports.generateMetadata = generateMetadata;
//# sourceMappingURL=metadata.js.map