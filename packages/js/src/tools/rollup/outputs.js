import { addBanner } from "./utils.js";

export const getEsOutput = ({ isDev = false } = {}) => ({
  banner: addBanner,
  chunkFileNames: "chunks/[name]-[hash].js",
  compact: !isDev,
  dir: "./dist",
  entryFileNames: "[name].js",
  format: "es",
  generatedCode: "es2015",
  minifyInternalExports: !isDev,
  preserveModules: true,
  preserveModulesRoot: "src",
});

export const getCjsOutput = ({ isDev = false } = {}) => ({
  ...getEsOutput({ isDev }),
  entryFileNames: "[name].cjs",
  exports: "auto",
  format: "cjs",
});

export const cssOutput = {
  dir: "./dist",
  preserveModules: true,
  preserveModulesRoot: "src",
};
