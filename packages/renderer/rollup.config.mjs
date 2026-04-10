import { readFileSync } from "node:fs";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

const externalDeps = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

const isExternal = (id) =>
  externalDeps.some((dep) => id === dep || id.startsWith(dep + "/")) ||
  id === "react/jsx-runtime";

export default {
  input: "src/index.tsx",
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
      sourcemap: true,
      interop: "auto",
    },
    {
      file: "dist/index.mjs",
      format: "esm",
      sourcemap: true,
    },
  ],
  external: isExternal,
  plugins: [
    postcss({
      autoModules: false,
      modules: {
        generateScopedName: "metaflux-[name]_[local]__[hash:base64:5]",
      },
      extract: "styles.css",
      use: { less: {} },
      sourceMap: true,
    }),
    resolve({
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    }),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "./dist",
      rootDir: "./src",
      sourceMap: true,
      exclude: ["**/*.less"],
    }),
  ],
};

