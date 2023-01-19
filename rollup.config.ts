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
import autoExternal from "rollup-plugin-auto-external";
import _copy from "rollup-plugin-copy";
import _del from "rollup-plugin-delete";
import _postcss from "rollup-plugin-postcss";
import progress from "rollup-plugin-progress";
import { walk, walkIndex } from "./src/tools/files/index.js";
// import { sizeSnapshot } from "rollup-plugin-size-snapshot";
import { terser } from "rollup-plugin-terser";
import _visualizer from "rollup-plugin-visualizer";

const commonjs = defaultImport(_commonjs);
const postcss = defaultImport(_postcss);
const copy = defaultImport(_copy);
const del = defaultImport(_del);
const typescript = defaultImport(_typescript);
const beep = defaultImport(_beep);
const visualizer = defaultImport(_visualizer);

const isDev = Boolean(process.env.ROLLUP_WATCH);
const plugins = [
  // sizeSnapshot(),
  progress(),
  autoExternal(),
  commonjs(),
];

const output: OutputOptions = {
  chunkFileNames: "chunks/[name]-[hash].js",
  dir: "./lib",
  entryFileNames: "[name].js",
  format: "es",
  minifyInternalExports: !isDev,
  sourcemap: isDev,
};

const config: RollupOptions[] = [
  {
    input: {
      components: "src/components/index.ts",
      "components/atoms": "src/components/atoms/index.ts",
      "components/molecules": "src/components/molecules/index.ts",
      // "components/templates": "src/components/templates/index.ts",
      contexts: "src/contexts/index.ts",
      hooks: "src/hooks/index.ts",
      tools: "src/tools/index.ts",
      ...walkIndex("src/tools"),
      ...walk("src/components"),
    },
    output,
    perf: isDev,
    plugins: [
      ...plugins,
      postcss({
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
      }),
      copy({
        targets: [
          { dest: "lib/assets", src: "assets/**/*" },
          { dest: "lib", src: ["package.json", "README.md"] },
        ],
      }),
      del({ runOnce: isDev, targets: "lib/**/*" }),
      typescript({
        tsconfig: "tsconfig.rollup.json",
      }),
      ...(isDev ? [beep(), visualizer()] : [terser()]),
    ],
  },
  {
    input: {
      ...walk("src/tools/cjs", {
        extensions: ["cjs"],
        includeDirectories: true,
      }),
    },

    output: {
      ...output,
      entryFileNames: "[name].cjs",
      exports: "auto",
      format: "cjs",
    },
    perf: isDev,
    plugins: [...plugins, ...(isDev ? [beep(), visualizer()] : [terser()])],
  },
];

export default config;
