import { defineConfig } from "tsup";

export default defineConfig({
  format: ["esm"],
  dts: true,
  external: ["react", "antd"],
});
