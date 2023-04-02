import { code } from "../../ts-poet";
export function generateApiPathCode() {
    return code `
    const developModel = location.hostname === "localhost";
    export function srvPath(): string {
        const hostName = !developModel
            ? location.origin + "/api"
            : "https://vodteam.com/api";
        return hostName;
    }
    `;
}
//# sourceMappingURL=generateApiPath.js.map