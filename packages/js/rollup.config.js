import { babel } from "@rollup/plugin-babel";
import _commonjs from "@rollup/plugin-commonjs";
import _json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import _terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { defaultImport } from "default-import";
import _copy from "rollup-plugin-copy";
import _del from "rollup-plugin-delete";
import _progress from "rollup-plugin-progress";

const commonjs = defaultImport(_commonjs);
const terser = defaultImport(_terser);
const progress = defaultImport(_progress);
const json = defaultImport(_json);
const del = defaultImport(_del);
const copy = defaultImport(_copy);

const isDev = process.env.NODE_ENV === "development";

const config = {
  external: [/node_modules/],
  input: "src/index.ts",
  output: {
    chunkFileNames: "chunks/[name]-[hash].js",
    compact: !isDev,
    dir: "./dist",
    entryFileNames: "[name].js",
    format: "es",
    generatedCode: "es2015",
    minifyInternalExports: !isDev,
    preserveModules: true,
    preserveModulesRoot: "src",
  },
  plugins: [
    del({ runOnce: true, targets: ["dist/**/*", "*.tsbuildinfo"] }),
    nodeResolve({ extensions: [".js", ".ts"] }),
    commonjs(),
    json(),
    babel({
      babelHelpers: "bundled",
      extensions: [".js", ".ts"],
      include: "src/**/*",
      skipPreflightCheck: true,
      presets: [
        ["@babel/preset-env", { modules: false }],
        "@babel/preset-typescript",
      ],
      plugins: ["@babel/plugin-transform-runtime"],
      targets: { esmodules: true },
    }),
    typescript({
      cacheDir: "node_modules/.cache/@rollup-plugin/typescript",
      noForceEmit: true,
    }),
    copy({
      copyOnce: true,
      flatten: false,
      hook: "writeBundle",
      targets: [
        { dest: "dist", src: ["package.json", "README.md"] },
        { dest: "dist", src: ["src/**/*.d.ts"] },
      ],
    }),
    isDev ? progress() : terser({ compress: { directives: false } }),
  ],
  treeshake: !isDev,
  watch: { clearScreen: false },
};

export default config;
