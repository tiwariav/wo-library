import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";

export default {
  external: ["stylelint", "colorjs.io"],
  treeshake: true,
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
  input: {
    index: "lib/index.js",
    "plugins/colors/index": "lib/plugins/colors/index.js",
  },
  output: {
    format: "cjs",
    generatedCode: "es2015",
    chunkFileNames: "chunks/[name]-[hash].cjs",
    entryFileNames: "[name].cjs",
    dir: "./dist",
  },
  minifyInternalExports: true,
  preserveModules: true,
  preserveModulesRoot: "src",
};
