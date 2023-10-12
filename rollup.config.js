/**
 * Due to unknown reason ts config file is not working
 */

import _typescript from "@rollup/plugin-typescript";
import { defaultImport } from "default-import";
import _copy from "rollup-plugin-copy";
import _postcss from "rollup-plugin-postcss";

import {
  addCssImportBanner,
  bundleCss,
  cjsOutputOptions,
  commonPlugins,
  devPlugins,
  esOutputOptions,
  getBuildPlugins,
  getCssOutputOptions,
  postcssConfig,
  rollupInputMap,
} from "./src/tools/rollup/index.js";

const postcss = defaultImport(_postcss);
const typescript = defaultImport(_typescript);
const copy = defaultImport(_copy);

const isDev = Boolean(process.env.ROLLUP_WATCH);
const STYLES_DIR = "src/styles";

const config = [
  {
    input: rollupInputMap(import.meta.url, "src", {
      excludeDirectories: ["styles"],
    }),
    output: {
      ...esOutputOptions,
      banner: addCssImportBanner,
    },
    perf: isDev,
    plugins: [
      ...commonPlugins,
      copy({ targets: [{ dest: "dist", src: "types" }] }),
      postcss(postcssConfig),
      typescript({ tsconfig: "./tsconfig.rollup.json" }),
      ...getBuildPlugins(),
      ...devPlugins,
    ],
  },
  {
    input: rollupInputMap(import.meta.url, "src", { extension: "*.cjs" }),
    output: cjsOutputOptions,
    perf: isDev,
    plugins: [...commonPlugins, ...devPlugins],
  },
  {
    input: rollupInputMap(import.meta.url, STYLES_DIR, { extension: "*.css" }),
    output: getCssOutputOptions("./dist"),
    perf: isDev,
    plugins: [
      ...bundleCss(import.meta.url, STYLES_DIR, { extension: "*.css" }),
      ...devPlugins,
    ],
  },
];

export default config;
