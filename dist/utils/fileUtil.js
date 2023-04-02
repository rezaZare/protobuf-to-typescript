var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { code, joinCode } from "../ts-poet";
import * as fs from "fs";
import * as writeUtil from "write";
import { blockType, } from "../generate/model";
import { generateEnumCode } from "../generate/types/generateEnum";
export class FileUtil {
    read(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield fs.readFileSync(path, "utf8");
            return data;
        });
    }
    write(files) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if ((files === null || files === void 0 ? void 0 : files.length) > 0) {
                for (let file of files) {
                    if (file.isDirectory) {
                        this.write(file.nested);
                    }
                    else {
                        let _codes = [];
                        if (((_a = file.importedType) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                            const imported = generateImport(file.importedType);
                            _codes.push(...imported);
                        }
                        _codes = getCode(file.codeBlock, file);
                        if (file === null || file === void 0 ? void 0 : file.Service) {
                            let serviceTypeCode = file.Service.generate(file.importedType);
                            if (serviceTypeCode) {
                                _codes.push(serviceTypeCode);
                            }
                        }
                        let codes = joinCode(_codes, { on: "\n" }).toString();
                        if (((_b = file.importedType) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                            for (let importedFile of file.importedType) {
                                if (((_c = importedFile.importStr) === null || _c === void 0 ? void 0 : _c.length) > 0) {
                                    codes = importedFile.importStr + "\n" + codes;
                                }
                                else {
                                    let iii = `import * as ${importedFile.name} from '${importedFile.import.source}'`;
                                    codes = iii + "\n" + codes;
                                }
                            }
                        }
                        if (codes) {
                            yield writeUtil.sync(file.path.outPath + "/" + file.path.tsName, codes, {
                                newline: true,
                                overwrite: true,
                            });
                        }
                    }
                }
            }
        });
    }
    writeGlobalFiles(model, path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (model.apiPathCode) {
                yield writeUtil.sync(path + "/" + "apiPath.ts", model.apiPathCode.toString(), {
                    newline: true,
                    overwrite: true,
                });
            }
            if (model.responseModel) {
                yield writeUtil.sync(path + "/" + "responseModel.ts", model.responseModel.toString(), {
                    newline: true,
                    overwrite: true,
                });
            }
            if (model.enabledDevMode) {
                yield writeUtil.sync(path + "/" + "enableDevMode.ts", model.enabledDevMode.toString(), {
                    newline: true,
                    overwrite: true,
                });
            }
            if (model.metadata) {
                yield writeUtil.sync(path + "/" + "metadata.ts", model.metadata.toString(), {
                    newline: true,
                    overwrite: true,
                });
            }
            if (model.toProto) {
                yield writeUtil.sync(path + "/" + "toProto.ts", model.toProto.toString(), {
                    newline: true,
                    overwrite: true,
                });
            }
            yield writeUtil.sync(path + "/" + "index.ts", `
    export { srvPath } from "./apiPath";
    export { enabledDevMode } from "./enableDevMode";
    export { mergeMetaData } from "./metadata";
    export type { MetaData } from "./metadata";
    export { toProto } from "./toProto";
    export { default as ResponseModel } from "./responseModel";
    `, {
                newline: true,
                overwrite: true,
            });
        });
    }
}
function getCode(blocks, fileInfo) {
    let codes = [];
    if (blocks.length > 0) {
        blocks.forEach((block) => {
            var _a;
            if (block.blockType == blockType.NAMESPACE) {
                codes.push(code `export namespace ${block.name} {`);
                codes.push(...getCode(block.blocks, fileInfo));
                codes.push(code `}`);
            }
            else if (block.blockType == blockType.TYPE) {
                codes.push(...gernerateTypeCode(block, fileInfo));
                if (((_a = block.blocks) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                    debugger;
                    codes.push(...getCode(block.blocks, fileInfo));
                }
            }
            else if (block.blockType == blockType.ENUM) {
                codes.push(...generateEnumCode(block));
            }
        });
    }
    return codes;
}
function gernerateTypeCode(block, fileInfo) {
    let codes = [];
    codes.push(code `export type ${block.name} = {`);
    for (let field of block.fields) {
        let _type = "";
        if (field.typeValid) {
            _type = field.type;
        }
        else {
            _type = field.type; //getType(field, fileInfo); TODO:
        }
        if (field.isMap) {
            codes.push(code `${field.name}${field.isoptional ? "?" : ""}: Array<[${field.keyType},${field.type}]>;`);
        }
        else {
            codes.push(code `${field.name}${field.isRepeated ? "List" : ""}${field.isoptional ? "?" : ""}: ${field.isRepeated ? "Array<" + _type + ">" : _type};`);
        }
    }
    codes.push(code `}`);
    return codes;
}
function getType(field, fileInfo) {
    var _a;
    if (!field)
        return "";
    if (field.isSystemType)
        return field.type;
    if (((_a = fileInfo.importedType) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        //TODO:
    }
    else {
        return findType(field.type, fileInfo.typeList);
        // if (field.type.includes(".")) {
        //   // این تایپ هایی هست که دات داره و توی خود فایل هست
        //   let splType = field.type.split(".");
        //   findType(field.type, fileInfo.typeList);
        //   return splType[splType.length - 1];
        // } else {
        //   //TODO: این تایپ توی خود فایل هست ولی باید ببینیم که نیم اسپیس هست یا نه
        // }
    }
    return field.type;
}
function findType(name, listOfTypes) {
    if (name.includes(".")) {
        return name;
        // let splType = name.split(".");
        // let _type = splType.splice(0, 1);
        // let _findType = listOfTypes.find((x) => x.name == _type[0]);
        // if (_findType) {
        //   // let p = findType(splType.join("."), _findType.nested);
        // } else {
        // }
    }
    else {
        let findedType = listOfTypes.find((x) => x.name == name);
        if (findedType) {
            let _type = findedType.name;
            if (findedType.isNamespace) {
                let nestedType = findType(name, findedType.nested);
                return _type + `${nestedType ? "." + nestedType : ""}`;
            }
            else {
                return _type;
            }
        }
        else {
            return undefined;
        }
    }
    return undefined;
}
function generateImport(importedType) {
    let codes = [];
    for (let _import of importedType) {
        codes.push(code `${_import.import}`);
    }
    return codes;
}
//# sourceMappingURL=fileUtil.js.map