import beep from "@rollup/plugin-beep";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import fs from "fs";
import path from "path";
import postcssFlexbugsFixes from "postcss-flexbugs-fixes";
import postcssImport from "postcss-import";
import postcssNormalize from "postcss-normalize";
import postcssPresetEnv from "postcss-preset-env";
import autoExternal from "rollup-plugin-auto-external";
import del from "rollup-plugin-delete";
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

function walk(dir) {
  const response = {};
  const files = fs.readdirSync(dir);
  for (const file of files) {
    var filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (filepath.includes("/cjs") || filepath.includes("__")) {
      continue;
    }
    if (stats.isDirectory()) {
      response[filepath.replace("src/", "")] = filepath + "/index.ts";
    }
  }
  return response;
}

const toolsSubdirs = walk("src/tools");

export default [
  {
    input: {
      components: "src/components/index.ts",
      "components/atoms": "src/components/atoms/index.ts",
      "components/molecules": "src/components/molecules/index.ts",
      "components/templates": "src/components/templates/index.ts",
      contexts: "src/contexts/index.ts",
      hooks: "src/hooks/index.ts",
      tools: "src/tools/index.ts",
      "tools/cjs": "src/tools/cjs/index.cjs",
      ...toolsSubdirs,
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
];
