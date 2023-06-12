/**
 * Due to unknown reason ts config file is not working
 */

import _typescript from "@rollup/plugin-typescript";
import { defaultImport } from "default-import";
import _postcss from "rollup-plugin-postcss";

import {
  cjsOutputOptions,
  commonPlugins,
  devPlugins,
  esOutputOptions,
  getBuildPlugins,
  postcssConfig,
  rollupInputMap,
} from "./src/tools/rollup/index.js";

const postcss = defaultImport(_postcss);
const typescript = defaultImport(_typescript);

const isDev = Boolean(process.env.ROLLUP_WATCH);

const config = [
  {
    input: rollupInputMap(import.meta.url, "src"),
    output: esOutputOptions,
    perf: isDev,
    plugins: [
      ...commonPlugins,
      postcss(postcssConfig),
      ...getBuildPlugins(),
      typescript({ tsconfig: "./tsconfig.rollup.json" }),
      ...devPlugins,
    ],
  },
  {
    input: rollupInputMap(import.meta.url, "src", { extension: "*.cjs" }),
    output: cjsOutputOptions,
    perf: isDev,
    plugins: [...commonPlugins, ...devPlugins],
  },
];

export default config;
