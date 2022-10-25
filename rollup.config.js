import beep from "@rollup/plugin-beep";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import cssnano from "cssnano";
import fs from "node:fs";
import path from "node:path";
import postcssFlexbugsFixes from "postcss-flexbugs-fixes";
import postcssImport from "postcss-import";
import postcssNormalize from "postcss-normalize";
import postcssPresetEnv from "postcss-preset-env";
import autoExternal from "rollup-plugin-auto-external";
import copy from "rollup-plugin-copy";
import del from "rollup-plugin-delete";
import postcss from "rollup-plugin-postcss";
import progress from "rollup-plugin-progress";
import { sizeSnapshot } from "rollup-plugin-size-snapshot";
import { terser } from "rollup-plugin-terser";
import visualizer from "rollup-plugin-visualizer";

const isDev = Boolean(process.env.ROLLUP_WATCH);
const plugins = [sizeSnapshot(), progress(), autoExternal(), commonjs()];

const output = {
  chunkFileNames: "chunks/[name]-[hash].js",
  dir: "./lib",
  entryFileNames: "[name].js",
  format: "es",
  minifyInternalExports: !isDev,
  sourcemap: isDev,
};

function walkIndex(directory) {
  const response = {};
  const files = fs.readdirSync(directory);
  for (const file of files) {
    var filepath = path.join(directory, file);
    const stats = fs.statSync(filepath);
    if (filepath.includes("/cjs") || filepath.includes("__")) {
      continue;
    }
    const indexFile = filepath + "/index.ts";
    if (stats.isDirectory() && fs.existsSync(indexFile)) {
      response[filepath.replace("src/", "")] = indexFile;
    }
  }
  return response;
}

function walk(directory, options) {
  const { includeDirs, ext } = { ext: "ts", includeDirs: false, ...options };
  const response = {};
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const filePath = path.join(directory, file);
    let destinationPath = filePath;
    const stats = fs.statSync(filePath);
    const indexFile = `/index.${ext}`;
    if (includeDirs && stats.isDirectory()) {
      destinationPath += indexFile;
    } else if (!filePath.endsWith(ext) || filePath.endsWith(indexFile)) {
      continue;
    }
    response[filePath.replace("src/", "").replace(`.${ext}`, "")] =
      destinationPath;
  }
  return response;
}

const config = [
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
      typescript(),
      ...(isDev ? [beep(), visualizer()] : [terser()]),
    ],
  },
  {
    input: {
      ...walk("src/tools/cjs", { ext: "cjs", includeDirs: true }),
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
