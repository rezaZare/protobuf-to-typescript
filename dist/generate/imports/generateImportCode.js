import { imp } from "../../ts-poet";
export function generateImportCode(elements) {
    const chunks = [];
    if (elements.length > 0) {
        for (let path of elements) {
            if (path.startsWith("google")) {
                if (!chunks.find((x) => x.symbol == "google")) {
                    let splList = path.split("/");
                    let name = splList.join(".");
                    chunks.push(imp(`google*.${name}`));
                }
                // protobuff
            }
            else {
                let splList = path.split("/");
                let file = splList.splice(splList.length - 1, 1);
                if (splList.length > 0) {
                    let prePath = "";
                    for (let pre of splList) {
                        prePath += "../";
                    }
                    chunks.push(imp(`${splList.join("_")}*${prePath}${splList.join("/")}/${file[0].replace(".proto", "")} `));
                }
                else {
                    chunks.push(imp(`${splList.join("_")}*./${file[0].replace(".proto", "")} `));
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
//# sourceMappingURL=generateImportCode.js.map