import { entry_service_v1, entry_service_v1_grpc } from "../sample/proto";

global.XMLHttpRequest = require("xhr2");
describe("test1", () => {
  test("adds 1 + 2 to equal 3", async () => {
    let reqModel = new entry_service_v1.auth.v1.SigninRequest();

    reqModel.email = "admin@vodteam.com";
    // reqModel.phone = "+989353306943";
    reqModel.password = "Aa12345@";
    reqModel.role = "admin";
    reqModel.rememberMe = false;
    // let response = await Signin(reqModel);
    let response = await entry_service_v1_grpc.Signin(reqModel, {});

    console.log("response: signin: ", response);
    expect(response).not.toBe(undefined);
  });
});
