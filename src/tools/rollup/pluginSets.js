import { babel } from "@rollup/plugin-babel";
import _commonjs from "@rollup/plugin-commonjs";
import _eslint from "@rollup/plugin-eslint";
import _json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import _terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { defaultImport } from "default-import";
import _copy from "rollup-plugin-copy";
import _del from "rollup-plugin-delete";
import _postcss from "rollup-plugin-postcss";
import _progress from "rollup-plugin-progress";

import { autoExternal, skipOutput } from "./plugins.js";
import { getInput } from "./utils.js";

const commonjs = defaultImport(_commonjs);
const postcss = defaultImport(_postcss);
const copy = defaultImport(_copy);
const del = defaultImport(_del);
const terser = defaultImport(_terser);
const eslint = defaultImport(_eslint);
const progress = defaultImport(_progress);
const json = defaultImport(_json);

const DEFAULT_JS_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx"];

export function getCssBundlePlugins(
  directory,
  { extension = "*.css", ...options } = {},
) {
  const config = [];
  const files = getInput(directory, { extension, ...options });
  const extracted = new Set();
  for (const [key, value] of Object.entries(files)) {
    config.push(
      postcss({
        extract: key + ".css",
        include: value,
        onExtract: (getExtracted) => {
          const { codeFileName } = getExtracted();
          const exists = extracted.has(codeFileName);
          if (!exists) {
            extracted.add(codeFileName);
          }
          return exists;
        },
      }),
    );
  }
  return [...config, skipOutput()];
}

export function getJsPlugins({
  buildPlugins = [],
  copyAssets = false,
  enableEslint = false,
  extensions = DEFAULT_JS_EXTENSIONS,
  isDev = false,
} = {}) {
  const response = [
    autoExternal({ copy: copyAssets }),
    nodeResolve({ extensions }),
    commonjs(),
    json(),
    ...buildPlugins,
  ];
  if (isDev && enableEslint) {
    response.push(
      eslint({
        cache: true,
        fix: true,
        include: "src/**/*.{js,jsx,ts,tsx}",
        throwOnError: true,
      }),
    );
  }
  if (isDev) {
    response.push(progress());
  } else {
    response.push(terser());
  }
  return response;
}

export const getBuildPlugins = ({
  extensions = DEFAULT_JS_EXTENSIONS,
  includeTsc = true,
  isDev = false,
  ...options
} = {}) => {
  const plugins = [
    postcss({
      extract: "dist.css",
      modules: { localsConvention: "camelCase" },
      sourceMap: isDev,
    }),
    babel({
      babelHelpers: "bundled",
      extensions,
      include: "src/**/*",
      skipPreflightCheck: true,
    }),
  ];
  if (includeTsc) {
    plugins.push(
      typescript({
        cacheDir: "node_modules/.cache/@rollup-plugin/typescript",
        noForceEmit: true,
        tsconfig: "./tsconfig.build.json",
      }),
    );
  }
  return getJsPlugins({
    buildPlugins: plugins,
    extensions,
    isDev,
    ...options,
  });
};

export const getPublishPlugins = ({
  assetDirectories,
  buildPath = "dist",
  removePostInstall = false,
} = {}) => [
  // not removing the `*.tsbuildinfo` file updating config leads
  // to empty output from typescript plugin
  del({ runOnce: true, targets: [`${buildPath}/**/*`, "*.tsbuildinfo"] }),
  copy({
    copyOnce: true,
    flatten: false,
    hook: "writeBundle",
    targets: [
      {
        dest: buildPath,
        src: ["package.json", "README.md"],
        transform: (contents) =>
          removePostInstall
            ? contents.toString().replace(/\n*\s*"postinstall": "[^"]*",?/, "")
            : contents,
      },
      {
        dest: buildPath,
        src: ["src/**/*.d.ts"],
      },
      ...(assetDirectories
        ? [
            {
              dest: buildPath,
              src: assetDirectories,
            },
          ]
        : []),
    ],
  }),
];
