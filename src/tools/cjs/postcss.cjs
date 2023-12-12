const cssnano = require("cssnano");
const postcssGlobalImport = require("postcss-global-import");
const postcssImport = require("postcss-import");
const postcssPresetEnv = require("postcss-preset-env");

const presetEnvOptions = {
  autoprefixer: {
    flexbox: "no-2009",
  },
  features: {
    "cascade-layers": false,
    "custom-media-queries": { preserve: true },
    "custom-properties": true,
    "gap-properties": true,
    "nesting-rules": true,
  },
  stage: 1,
};

const getConfig = (env = "production") => ({
  plugins: [
    postcssGlobalImport(),
    postcssImport(),
    postcssPresetEnv({ ...presetEnvOptions, env }),
    cssnano({ preset: "advanced" }),
  ],
  sourceMap: env === "development",
});

module.exports = { getConfig, presetEnvOptions };
