import { blockType, } from "../model";
import { getBlockTypes } from "./typeUtil";
export function typeCheckAndFix(fileBlocks) {
    fileBlocks = internalType(fileBlocks);
    fileBlocks = externalType(fileBlocks);
    return fileBlocks;
}
function internalType(fileBlocks) {
    fileBlocks.forEach((fileBlock) => {
        var _a, _b;
        if (((_a = fileBlock.codeBlock) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            fileBlock.codeBlock = fixType(fileBlock.codeBlock, [], getBlockTypes(fileBlock.codeBlock));
        }
        else if (((_b = fileBlock.nested) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            fileBlock.nested = internalType(fileBlock.nested);
        }
    });
    return fileBlocks;
}
function fixType(codeBlock, typeOfList, alltype) {
    if (codeBlock.length <= 0)
        return [];
    codeBlock.forEach((block) => {
        if (block.blockType === blockType.NAMESPACE) {
            let listOfType = getBlockTypes(block.blocks);
            block.blocks = fixType(block.blocks, listOfType, alltype);
        }
        else if (block.blockType === blockType.TYPE) {
            block.fields.forEach((field) => {
                if (!field.typeValid) {
                    let typeSpl = field.type.split(".");
                    let type = typeSpl[typeSpl.length - 1];
                    if (typeOfList === null || typeOfList === void 0 ? void 0 : typeOfList.includes(field.type)) {
                        field.typeValid = true;
                        field.isoptional = checkOptionalField(field);
                    }
                    else if (typeOfList === null || typeOfList === void 0 ? void 0 : typeOfList.includes(field.type + "." + type)) {
                        field.type = field.type + "." + field.type;
                        field.typeValid = true;
                        field.isoptional = checkOptionalField(field);
                    }
                    else if (alltype.includes(field.type)) {
                        field.typeValid = true;
                        field.isoptional = checkOptionalField(field);
                    }
                    if (alltype.includes(field.type + "." + type)) {
                        field.type = field.type + "." + field.type;
                        field.typeValid = true;
                        field.isoptional = checkOptionalField(field);
                    }
                    if (field.isMap) {
                        if (typeOfList === null || typeOfList === void 0 ? void 0 : typeOfList.includes(field.keyType + "." + type)) {
                            field.keyType = field.keyType + "." + field.keyType;
                        }
                        else if (alltype.includes(field.keyType + "." + type)) {
                            field.type = field.keyType + "." + field.keyType;
                        }
                    }
                }
            });
        }
    });
    return codeBlock;
}
function externalType(fileBlocks) {
    fileBlocks.forEach((fileBlock) => {
        var _a, _b;
        if (((_a = fileBlock.codeBlock) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            for (let importedFile of fileBlock.importedType) {
                let tyleList = getTypeListByTypes(importedFile.types);
                fileBlock.codeBlock = fixExternalType(fileBlock.codeBlock, tyleList);
            }
        }
        else if (((_b = fileBlock.nested) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            fileBlock.nested = externalType(fileBlock.nested);
        }
    });
    return fileBlocks;
}
function getTypeListByTypes(blocks) {
    let types = new Map();
    for (let block of blocks) {
        if (block.isNamespace) {
            let name = block.name;
            let mapBlockTypes = getTypeListByTypes(block.nested);
            mapBlockTypes.forEach((value, key) => {
                types.set(name + "." + key, value);
            });
        }
        else {
            types.set(block.name, block);
        }
    }
    return types;
}
function fixExternalType(codeBlock, typeList) {
    if (codeBlock.length <= 0)
        return [];
    codeBlock.forEach((block) => {
        if (block.blockType === blockType.NAMESPACE) {
            block.blocks = fixExternalType(block.blocks, typeList);
        }
        else if (block.blockType === blockType.TYPE) {
            block.fields.forEach((field) => {
                if (!field.typeValid) {
                    let _type = field.type;
                    let prefix = "";
                    if (field.type.includes(".")) {
                        let typeSpl = field.type.split(".");
                        _type = typeSpl.splice(typeSpl.length - 1, 1)[0];
                        prefix = typeSpl.join(".");
                    }
                    if (typeList === null || typeList === void 0 ? void 0 : typeList.get(_type)) {
                        field.typeValid = true;
                        field.importedFiledType = typeList === null || typeList === void 0 ? void 0 : typeList.get(_type);
                        field.isoptional = checkOptionalField(field);
                    }
                    else if (typeList === null || typeList === void 0 ? void 0 : typeList.get(_type + "." + _type)) {
                        field.type = `${prefix ? prefix + "." : ""}${_type}.${_type}`;
                        field.typeValid = true;
                        field.importedFiledType = typeList === null || typeList === void 0 ? void 0 : typeList.get(_type + "." + _type);
                        field.isoptional = checkOptionalField(field);
                    }
                }
            });
        }
    });
    return codeBlock;
}
function checkOptionalField(field) {
    if (field.isoptional)
        return true;
    if (field.isRepeated)
        return field.isoptional;
    if (!field.isSystemType) {
        return true;
    }
    // if (field.type.includes(".")) {
    //   if (field.importedFiledType?.type == blockType.TYPE) {
    //     return true;
    //   }
    // }
    return field.isoptional;
}
//# sourceMappingURL=validationType.js.map