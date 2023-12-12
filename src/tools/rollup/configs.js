import { cssOutput, getCjsOutput, getEsOutput } from "./outputs.js";
import {
  getCssBundlePlugins,
  getJsPlugins,
  getTsPlugins,
} from "./pluginSets.js";
import { getInput } from "./utils.js";

const getBaseConfig = ({ isDev = false } = {}) => {
  return {
    external: [/node_modules/],
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
  plugins: getJsPlugins({ enableEslint: true }),
});

export const getEsConfig = ({ isDev = false } = {}) => ({
  ...getBaseConfig({ isDev }),
  input: getInput("src", {
    excludeDirectories: ["styles", "assets", "stories", "mocks"],
  }),
  output: getEsOutput({ isDev }),
  plugins: [
    ...getJsPlugins({ enableEslint: true, isDev }),
    ...getTsPlugins({ isDev }),
  ],
});

export const getCssConfig = ({ isDev = false } = {}) => ({
  ...getBaseConfig({ isDev }),
  input: getInput("src/styles", {
    extension: "!(*.module).css",
  }),
  output: cssOutput,
  plugins: getCssBundlePlugins("src/styles", { isDev }),
});
