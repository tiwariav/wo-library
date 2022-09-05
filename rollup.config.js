import beep from "@rollup/plugin-beep";
import commonjs from "@rollup/plugin-commonjs";
import multi from "@rollup/plugin-multi-entry";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import postcssFlexbugsFixes from "postcss-flexbugs-fixes";
import postcssImport from "postcss-import";
import postcssNormalize from "postcss-normalize";
import postcssPresetEnv from "postcss-preset-env";
import autoExternal from "rollup-plugin-auto-external";
import del from "rollup-plugin-delete";
import dts from "rollup-plugin-dts";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import visualizer from "rollup-plugin-visualizer";

const isDev = Boolean(process.env.ROLLUP_WATCH);
const plugins = [
  autoExternal(),
  postcss({
    plugins: [
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
    extensions: [".css"],
  }),
  resolve(),
  commonjs(),
  ...(isDev ? [beep(), visualizer()] : [terser()]),
];

const output = {
  dir: "./lib",
  sourcemap: isDev,
  entryFileNames: "[name].js",
  chunkFileNames: "chunks/[name]-[hash].js",
  format: "es",
  minifyInternalExports: !isDev,
};

export default [
  {
    input: {
      "components/atoms": "src/components/atoms/index.ts",
      "components/molecules": "src/components/molecules/index.ts",
      components: "src/components/index.ts",
      contexts: "src/contexts/index.ts",
      hooks: "src/hooks/index.ts",
      tools: "src/tools/index.ts",
    },
    output,
    plugins: [...plugins, del({ targets: "lib/**/*" }), typescript()],
    perf: isDev,
  },
  {
    input: {
      tools: "src/tools/cjs/index.cjs",
    },
    output: { ...output, dir: "lib/cjs", format: "cjs", exports: "auto" },
    plugins,
    perf: isDev,
  },
  {
    input: "lib/**/*.d.ts",
    output: [{ file: "lib/index.d.ts", format: "esm" }],
    plugins: [multi(), dts(), del({ targets: "lib/@types", hook: "buildEnd" })],
  },
];
