/// <reference path="index.d.ts"/>

import globalData from "@csstools/postcss-global-data";
import cssnano from "cssnano";
import cssnanoPresetAdvanced from "cssnano-preset-advanced";
import postcssGlobalImport from "postcss-global-import";
import postcssImport from "postcss-import";
import postcssMixin from "postcss-mixins";
import postcssPresetEnv from "postcss-preset-env";

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
  { globalDataOptions, mixinOptions, presetEnvOptions } = {},
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
  { globalDataOptions, mixinOptions, presetEnvOptions } = {},
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

export { getConfig, getPresetEnvOptions, getStringConfig };
