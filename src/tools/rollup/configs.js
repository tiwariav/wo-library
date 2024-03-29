import { cssOutput, getCjsOutput, getEsOutput } from "./outputs.js";
import {
  getBuildPlugins,
  getCssBundlePlugins,
  getJsPlugins,
} from "./pluginSets.js";
import { getInput } from "./utils.js";

const getBaseConfig = ({ isDev = false } = {}) => {
  return {
    // enable to find out sideEffects and reduce bundle size
    // experimentalLogSideEffects: true,
    external: [/node_modules/],
    // enable to view time taken by each plugin
    // perf: !isDev,
    treeshake: !isDev,
    watch: {
      clearScreen: false,
    },
  };
};

export const getCjsConfig = ({ isDev = false } = {}) => ({
  ...getBaseConfig({ isDev }),
  input: getInput("src", {
    excludeDirectories: ["stories", "mocks"],
    extension: "*.cjs",
  }),
  output: getCjsOutput({ isDev }),
  plugins: getJsPlugins({ enableEslint: true, isDev }),
});

export const getEsConfig = ({ includeTsc, isDev = false } = {}) => ({
  ...getBaseConfig({ isDev }),
  input: getInput("src", {
    excludeDirectories: ["styles", "assets", "stories", "mocks"],
  }),
  output: getEsOutput({ isDev }),
  plugins: getBuildPlugins({ enableEslint: true, includeTsc, isDev }),
});

export const getCssConfig = ({ isDev = false } = {}) => ({
  ...getBaseConfig({ isDev }),
  input: getInput("src/styles", {
    extension: "!(*.module).css",
  }),
  output: cssOutput,
  plugins: getCssBundlePlugins("src/styles", { isDev }),
});
