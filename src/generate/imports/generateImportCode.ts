import { imp, Import } from "../../ts-poet";

// import "common/types_common_v1.proto";
// import "enums.proto";
// import "name_api.proto";
// import "google/protobuf/empty.proto";
// 'workflow/common/types_common_v1.proto'
//'google/protobuf/empty.proto'

export function generateImportCode(elements: string[]) {
  const chunks: Import[] = [];

  if (elements.length > 0) {
    for (let path of elements) {
      if (path.startsWith("google")) {
        if (!chunks.find((x) => x.symbol == "google")) {
          let splList = path.split("/");
          let name = splList.join(".");
          chunks.push(imp(`google*.${name}`));
        }
        // protobuff
      } else {
        let splList = path.split("/");
        let file = splList.splice(splList.length - 1, 1);
        if (splList.length > 0) {
          let prePath = "";
          for (let pre of splList) {
            prePath += "../";
          }
          chunks.push(
            imp(
              `${splList.join("_")}*${prePath}${splList.join(
                "/"
              )}/${file[0].replace(".proto", "")} `
            )
          );
        } else {
          chunks.push(
            imp(`${splList.join("_")}*./${file[0].replace(".proto", "")} `)
          );
        }
      }
    }
  }

  return chunks;
}
