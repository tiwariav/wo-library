import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";

export default {
  external: ["stylelint", "colorjs.io"],
  input: {
    index: "lib/index.js",
    "plugins/colors/index": "lib/plugins/colors/index.js",
  },
  minifyInternalExports: true,
  output: {
    chunkFileNames: "chunks/[name]-[hash].js",
    dir: "./dist",
    entryFileNames: "[name].js",
    format: "es",
    generatedCode: "es2015",
  },
  plugins: [
    commonjs(),
    nodeResolve(),
    json(),
    copy({
      copyOnce: true,
      hook: "writeBundle",
      targets: [
        {
          dest: "dist",
          src: ["package.json", "README.md", "LICENSE"],
        },
      ],
    }),
  ],
  preserveModules: true,
  preserveModulesRoot: "src",
  treeshake: true,
};
