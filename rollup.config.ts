import { defaultImport } from "default-import";
import type { RollupOptions } from "rollup";
import _postcss from "rollup-plugin-postcss";
// import { sizeSnapshot } from "rollup-plugin-size-snapshot";
import {
  cjsOutputOptions,
  commonPlugins,
  devPlugins,
  esOutputOptions,
  postcssConfig,
  rollupInputMap,
  tsPlugins,
} from "./src/tools/rollup/index.js";

const postcss = defaultImport(_postcss);

const isDev = Boolean(process.env.ROLLUP_WATCH);

const config: RollupOptions[] = [
  {
    input: rollupInputMap(import.meta.url, "src"),
    output: esOutputOptions,
    perf: isDev,
    plugins: [
      ...commonPlugins,
      postcss(postcssConfig),
      ...tsPlugins,
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
