import _beep from "@rollup/plugin-beep";
import _commonjs from "@rollup/plugin-commonjs";
import _typescript from "@rollup/plugin-typescript";
import cssnano from "cssnano";
import { defaultImport } from "default-import";
import postcssFlexbugsFixes from "postcss-flexbugs-fixes";
import postcssImport from "postcss-import";
import postcssNormalize from "postcss-normalize";
import postcssPresetEnv from "postcss-preset-env";
import type { OutputOptions, RollupOptions } from "rollup";
import _copy from "rollup-plugin-copy";
import _del from "rollup-plugin-delete";
import _externals from "rollup-plugin-node-externals";
import _postcss, { PostCSSPluginConf } from "rollup-plugin-postcss";
import progress from "rollup-plugin-progress";
// import { sizeSnapshot } from "rollup-plugin-size-snapshot";
import { terser } from "rollup-plugin-terser";
import _visualizer from "rollup-plugin-visualizer";
import { rollupInputMap } from "./src/tools/files.js";

const commonjs = defaultImport(_commonjs);
const postcss = defaultImport(_postcss);
const copy = defaultImport(_copy);
const del = defaultImport(_del);
const typescript = defaultImport(_typescript);
const beep = defaultImport(_beep);
const visualizer = defaultImport(_visualizer);
const externals = defaultImport(_externals);

const isDev = Boolean(process.env.ROLLUP_WATCH);
export const commonPlugins = [
  // sizeSnapshot(),
  progress(),
  externals(),
  commonjs(),
];
export const miscPlugins = isDev ? [beep(), visualizer()] : [terser()];
export const tsPlugins = [
  copy({
    targets: [
      { dest: "dist/assets", src: "assets/**/*" },
      { dest: "dist", src: ["package.json", "README.md"] },
    ],
  }),
  del({ runOnce: isDev, targets: "dist/**/*" }),
  typescript({ tsconfig: "tsconfig.rollup.json" }),
];

export const postcssConfig: PostCSSPluginConf = {
  config: false,
  extensions: [".css"],
  extract: "dist.css",
  modules: { localsConvention: "camelCase" },
  plugins: [
    cssnano({ preset: "default" }),
    postcssImport(),
    postcssFlexbugsFixes(),
    postcssPresetEnv({
      autoprefixer: {
        flexbox: "no-2009",
      },
      features: {
        "custom-media-queries": true,
        "custom-properties": true,
        "gap-properties": true,
        "nesting-rules": true,
      },
      stage: 1,
    }),
    // Adds PostCSS Normalize as the reset css with default options,
    // so that it honors browserslist config in package.json
    // which in turn let's users customize the target behavior as per their needs.
    postcssNormalize(),
  ],
  sourceMap: isDev,
};

export const esOutputOptions: OutputOptions = {
  chunkFileNames: "chunks/[name]-[hash].js",
  dir: "./dist",
  entryFileNames: "[name].js",
  format: "es",
  minifyInternalExports: !isDev,
  sourcemap: isDev,
};

export const cjsOutputOptions: OutputOptions = {
  ...esOutputOptions,
  entryFileNames: "[name].cjs",
  exports: "auto",
  format: "cjs",
};

const config: RollupOptions[] = [
  {
    input: rollupInputMap(import.meta.url, "src"),
    output: esOutputOptions,
    perf: isDev,
    plugins: [
      ...commonPlugins,
      postcss(postcssConfig),
      ...tsPlugins,
      ...miscPlugins,
    ],
  },
  {
    input: rollupInputMap(import.meta.url, "src", "*.cjs"),
    output: cjsOutputOptions,
    perf: isDev,
    plugins: [...commonPlugins, ...miscPlugins],
  },
];

export default config;
