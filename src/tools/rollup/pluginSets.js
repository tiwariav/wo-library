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
  enableEslint = false,
  extensions = DEFAULT_JS_EXTENSIONS,
  isDev = false,
  transforms = [],
} = {}) {
  const response = [
    autoExternal(),
    progress(),
    nodeResolve({ extensions }),
    commonjs(),
    json(),
    ...transforms,
  ];
  if (isDev && enableEslint) {
    response.push(
      eslint({
        fix: true,
        include: "src/**/*.{ts,tsx}",
        throwOnError: true,
      }),
    );
  }
  if (!isDev) {
    response.push(terser());
  }
  return response;
}

export const getTsPlugins = ({
  extensions = DEFAULT_JS_EXTENSIONS,
  isDev = false,
  ...options
} = {}) =>
  getJsPlugins({
    extensions,
    isDev,
    ...options,
    transforms: [
      postcss({
        extract: "dist.css",
        modules: { localsConvention: "camelCase" },
        sourceMap: isDev,
      }),
      babel({
        babelHelpers: "runtime",
        extensions,
        include: "src/**/*",
        skipPreflightCheck: true,
      }),
      typescript({
        cacheDir: "node_modules/.cache/rollup-plugin-typescript",
        noForceEmit: true,
        tsconfig: "./tsconfig.build.json",
      }),
    ],
  });

export const getPublishPlugins = ({
  buildPath = "dist",
  removePostInstall = false,
} = {}) => [
  del({ runOnce: true, targets: [`${buildPath}/**/*`, "*..tsbuildinfo"] }),
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
    ],
  }),
];
