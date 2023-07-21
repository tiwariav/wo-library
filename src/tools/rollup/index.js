import _beep from "@rollup/plugin-beep";
import _commonjs from "@rollup/plugin-commonjs";
import _eslint from "@rollup/plugin-eslint";
import _json from "@rollup/plugin-json";
import _terser from "@rollup/plugin-terser";
import cssnano from "cssnano";
import { defaultImport } from "default-import";
import { globSync } from "glob";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postcssFlexbugsFixes from "postcss-flexbugs-fixes";
import postcssImport from "postcss-import";
import postcssNormalize from "postcss-normalize";
import _postcssPresetEnv from "postcss-preset-env";
import _copy from "rollup-plugin-copy";
import _del from "rollup-plugin-delete";
import _externals from "rollup-plugin-node-externals";
import _postcss from "rollup-plugin-postcss";
import progress from "rollup-plugin-progress";
import _visualizer from "rollup-plugin-visualizer";

const commonjs = defaultImport(_commonjs);
const postcss = defaultImport(_postcss);
const copy = defaultImport(_copy);
const del = defaultImport(_del);
const beep = defaultImport(_beep);
const visualizer = defaultImport(_visualizer);
const externals = defaultImport(_externals);
const terser = defaultImport(_terser);
const postcssPresetEnv = defaultImport(_postcssPresetEnv);
const eslint = defaultImport(_eslint);
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const json = defaultImport(_json);

const isDev = Boolean(process.env.ROLLUP_WATCH);

export function rollupInputMap(
  root,
  directory,
  {
    excludeDirectories = [],
    extension = "!(*.d|*.test|*.stories).{js,jsx,ts,tsx}",
  } = {},
) {
  const pattern = `${directory}/**/${extension}`;
  const response = [];
  for (const file of globSync(pattern)) {
    if (
      file.includes("__") ||
      excludeDirectories.some((item) => file.includes(item))
    ) {
      continue;
    }
    response.push([
      // This remove `src/` as well as the file extension from each
      // file, so e.g. src/nested/foo.js becomes nested/foo
      path.relative(
        directory,
        file.slice(0, file.length - path.extname(file).length),
      ),
      // This expands the relative paths to absolute paths, so e.g.
      // src/nested/foo becomes /project/src/nested/foo.js
      fileURLToPath(new URL(file, root)),
    ]);
  }
  return Object.fromEntries(response);
}

export function bundleCss(root, directory, options) {
  const config = [];
  const files = rollupInputMap(root, directory, options);
  for (const [key, value] of Object.entries(files)) {
    config.push(
      postcss({
        ...postcssConfig,
        extract: key + ".css",
        include: value,
      }),
    );
  }
  return config;
}

export const commonPlugins = [
  // sizeSnapshot(),
  externals({
    include: [/^style-inject\/dist.*/, "tslib"],
  }),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  progress(),
  commonjs(),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  json(),
  eslint({ fix: true, include: "src/**/*.{ts,tsx}", throwOnError: true }),
  // use svgr when import svg as react component
  // svgr({ icon: true }),
];
export const devPlugins = isDev ? [beep(), visualizer()] : [terser()];

export function getBuildPlugins(buildPath = "dist") {
  return [
    del({ runOnce: isDev, targets: "dist/**/*" }),
    del({ targets: "dist/chunks/*" }),
    copy({
      hook: "writeBundle",
      targets: [{ dest: buildPath, src: ["package.json", "README.md"] }],
    }),
  ];
}

export const postcssConfig = {
  config: false,
  extensions: [".css"],
  extract: "dist.css",
  modules: { localsConvention: "camelCase" },
  plugins: [
    /* eslint-disable @typescript-eslint/no-unsafe-call */
    postcssImport(),
    postcssFlexbugsFixes(),
    postcssPresetEnv({
      autoprefixer: {
        flexbox: "no-2009",
      },
      features: {
        "custom-media-queries": { preserve: true },
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
    /* eslint-enable @typescript-eslint/no-unsafe-call */
    cssnano({ preset: "default" }),
  ],
  sourceMap: isDev,
};

export const esOutputOptions = {
  chunkFileNames: "chunks/[name]-[hash].js",
  dir: "./dist",
  entryFileNames: "[name].js",
  format: "es",
  minifyInternalExports: !isDev,
  preserveModules: true,
  preserveModulesRoot: "src",
  sourcemap: isDev,
};

export const cjsOutputOptions = {
  ...esOutputOptions,
  entryFileNames: "[name].cjs",
  exports: "auto",
  format: "cjs",
};

export function getCssOutputOptions(directory = "./dist") {
  return {
    dir: directory,
    entryFileNames: "[name].css",
    format: "es",
    preserveModules: true,
    preserveModulesRoot: "src",
  };
}

export function addScriptBanner(chunk, directory = "scripts/") {
  if (chunk.fileName.startsWith(directory)) {
    return "#!/usr/bin/env node";
  }
}
