import { Services } from "../dist/v1/qry/dialect_qry_v1";
global.XMLHttpRequest = require("xhr2").XMLHttpRequest;
describe("send request for test", () => {
  test("test1", async () => {
    let service = new Services();
    let response = await service.GetDialect(
      {
        dialectId: 11,
        language: "",
        page: {
          page: 1,
          size: 2,
        },
        title: "",
      },
      {}
    );
    console.log(response);
    expect(response.status).toBe(true);
  });
});
