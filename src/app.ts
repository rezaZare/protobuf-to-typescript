import { generate } from "./generate/generate";

class App {
  public async start() {
    generate("./pb/v1", "./src/service/v1", "./src/dist/v1");
  }
}

new App().start();
