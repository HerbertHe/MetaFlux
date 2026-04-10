import { defineConfig } from "@umijs/max";
import path from "node:path";

import { routes } from "./routes";
import { proxy, type ProxyEnvType } from "./proxy";

const APP_ENV = (process.env.APP_ENV || "dev") as ProxyEnvType;
const repoRoot = path.resolve(__dirname, "../../../..");
const coreSrc = path.resolve(repoRoot, "packages/core/src");
const drawerSrc = path.resolve(repoRoot, "packages/drawer/src");
const drawerDist = path.resolve(repoRoot, "packages/drawer/dist");

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  // initialState: {},
  request: {},
  layout: {
    title: "MetaFlux",
  },
  alias: {
    "@metaflux/core$": path.resolve(coreSrc, "index.ts"),
    "@metaflux/drawer$": path.resolve(drawerSrc, "index.tsx"),
    "@metaflux/drawer/styles": path.resolve(drawerDist, "styles.css"),
  },
  extraBabelIncludes: [coreSrc, drawerSrc],
  routes,
  proxy: proxy[APP_ENV],
  npmClient: "pnpm",
  tailwindcss: {},
});
