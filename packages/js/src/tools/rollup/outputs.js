import { addBanner } from "./utilities.js";

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

export const cssOutput = {
  dir: "./dist",
  preserveModules: true,
  preserveModulesRoot: "src",
};
