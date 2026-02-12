/// <reference path="index.d.ts"/>

const cssnano = require("cssnano");
const cssnanoPresetAdvanced = require("cssnano-preset-advanced");
const postcssGlobalImport = require("postcss-global-import");
const postcssImport = require("postcss-import");
const postcssPresetEnv = require("postcss-preset-env");
const postcssMixin = require("postcss-mixins");
const globalData = require("@csstools/postcss-global-data");

const cssnanoPreset = () => cssnanoPresetAdvanced({ zindex: false });

const getPresetEnvOptions = ({ preserveMediaQueries } = {}) => ({
  autoprefixer: {
    flexbox: "no-2009",
  },
  features: {
    "cascade-layers": false,
    "custom-media-queries": { preserve: preserveMediaQueries },
    "custom-properties": true,
    "gap-properties": true,
    "nesting-rules": true,
  },
  stage: 1,
});

/** @type {import("@wo-library/postcss-config").getConfig} */
const getConfig = (
  env = "production",
  { globalDataOptions, mixinOptions, presetEnvOptions } = {}
) => {
  const config = {
    plugins: [
      postcssGlobalImport(),
      postcssImport(),
      postcssMixin(mixinOptions),
      postcssPresetEnv({ ...getPresetEnvOptions(presetEnvOptions), env }),
      cssnano({ preset: cssnanoPreset }),
    ],
  };
  if (globalDataOptions) {
    config.plugins.splice(0, 0, globalData(globalDataOptions));
  }
  return config;
};

/** @type {import("@wo-library/postcss-config").getConfig} */
const getStringConfig = (
  env = "production",
  { globalDataOptions, mixinOptions, presetEnvOptions } = {}
) => {
  const config = {
    plugins: [
      "postcss-global-import",
      "postcss-import",
      ["postcss-mixins", mixinOptions || {}],
      ["postcss-preset-env", { ...getPresetEnvOptions(presetEnvOptions), env }],
      ["cssnano", { preset: cssnanoPreset }],
    ],
  };
  if (globalDataOptions) {
    config.plugins.splice(0, 0, [
      "@csstools/postcss-global-data",
      globalDataOptions,
    ]);
  }
  return config;
};

module.exports = { getConfig, getPresetEnvOptions, getStringConfig };
