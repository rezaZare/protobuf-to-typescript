import { code } from "ts-poet";

export function generateMetadata() {
  return code`
    export type MetaData = { [key: string]: string } | {};
// /**
//  * Merge global metaData with the EUD(End user developer) ones
//  */

export function mergeMetaData(metaData: MetaData): MetaData {
  const authorization = localStorage.getItem("token");
  if (authorization?.length > 0) {
    console.log("token", { ...metaData, authorization });
    return { ...metaData, authorization };
  }
  return metaData;
}
    `;
}
