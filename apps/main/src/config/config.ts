import { defineConfig } from "@umijs/max";

import { routes } from "./routes";
import { proxy, ProxyEnvType } from "./proxy";

const APP_ENV = (process.env.APP_ENV || "dev") as ProxyEnvType;

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  // initialState: {},
  request: {},
  layout: {
    title: "MetaFlux",
  },
  routes,
  proxy: proxy[APP_ENV],
  npmClient: "pnpm",
});
