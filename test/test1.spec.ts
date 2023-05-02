import { authServices } from "../sample/auth/dist";
// import { Signin } from "../sample/auth/dist/entry_service_v1_grpc";

global.XMLHttpRequest = require("xhr2");
describe("test1", () => {
  test("adds 1 + 2 to equal 3", async () => {
    let response = await authServices.entry_service_v1.Signin(
      {
        phone: "+989353306943",
        password: "Aa123456@",
        rememberMe: true,
      },
      {}
    );
    console.log("response:", await response);
    expect(response.status).toBe(true);
  });

  test("adds 1 + 2 to equal 3", async () => {
    let response = await authServices.profile_service_v1.GetProfile(
      {
        profileId: "",
        profilePin: "",
      },
      {}
    );
    console.log("response:", response);
    expect(response.status).toBe(false);
  });
});
