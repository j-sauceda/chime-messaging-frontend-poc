import { StackContext, StaticSite } from "sst/constructs";

export function Stack({ stack }: StackContext) {

  const web = new StaticSite(stack, "web", {
    path: "packages/web",
    buildOutput: "dist",
    buildCommand: "npm run build",
  });

  stack.addOutputs({
    StaticSite: web.url,
  });
}
