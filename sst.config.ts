import { SSTConfig } from "sst";
import { Stack } from "./stacks/MyStack";

export default {
  config(_input) {
    return {
      name: "chime-messaging-client-poc",
      region: "us-east-1",
      stage: "dev",
    };
  },
  stacks(app) {
    app.stack(Stack);
  }
} satisfies SSTConfig;
