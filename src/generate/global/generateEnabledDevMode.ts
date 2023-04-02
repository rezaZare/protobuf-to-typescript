import { code } from "../../ts-poet";

export function generateEnabledDevMode() {
  return code`
     export function enabledDevMode<T>(client: T): void {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    if (window) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const enableDevTools = window["__GRPCWEB_DEVTOOLS__"] || (() => {});
      enableDevTools([client]);
    }
  }
`;
}
