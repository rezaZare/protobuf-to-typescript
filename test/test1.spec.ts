import { workflowServices } from "../sample/workflow/dist";
import { authServices } from "../sample/auth/dist";

global.XMLHttpRequest = require("xhr2");
describe("test1", () => {
  test("adds 1 + 2 to equal 3", async () => {
    let response = await authServices.entry_service_v1.Signin(
      {
        // phone: "+989044696270",
        // phone: "+989038287702",
        phone: "+989353306943", //admin
        // phone: "+989999999999",
        // phone: "+989396951376", //user
        // phone: "+989103431293", //user
        password: "Aa123456@",
        rememberMe: true,
      },
      {}
    );
    console.log("response:", await response);
    expect(response.status).toBe(true);
  });
  // test("adds 1 + 2 to equal 3", async () => {
  //   let response = await authServices.profile_service_v1.GetProfile(
  //     {
  //       profileId: "",
  //       profilePin: "",
  //     },
  //     {}
  //   );
  //   console.log("response:", response);
  //   expect(response.status).toBe(false);
  // });
});
