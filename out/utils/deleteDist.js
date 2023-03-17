"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDistFolder = void 0;
function deleteDistFolder() {
    var fs = require("fs");
    // directory path
    var dir = "../dist";
    // delete directory recursively
    try {
        fs.rmdirSync(dir, { recursive: true });
        console.log(dir + " is deleted!");
    }
    catch (err) {
        console.error("Error while deleting " + dir + ".");
    }
}
exports.deleteDistFolder = deleteDistFolder;
//# sourceMappingURL=deleteDist.js.map