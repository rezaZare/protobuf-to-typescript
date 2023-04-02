import { code } from "../../ts-poet";
import { blockType } from "../model";
export function generateEnum(element) {
    let enumBlock = {
        blockType: blockType.ENUM,
        name: element.name,
        fields: [],
    };
    for (const [key, value] of Object.entries(element.values)) {
        enumBlock.fields.push({
            name: key.toUpperCase(),
            value: value.toString(),
            typeValid: true,
        });
    }
    return enumBlock;
}
export function generateEnumCode(blocks) {
    const codes = [];
    codes.push(code `export enum ${blocks.name} {`);
    for (let field of blocks.fields) {
        codes.push(code `${field.name}= ${field.value},`);
    }
    codes.push(code `}`);
    return codes;
}
//# sourceMappingURL=generateEnum.js.map