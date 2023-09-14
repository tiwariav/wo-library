const presetEnvOptions = {
  autoprefixer: {
    flexbox: "no-2009",
  },
  features: {
    "custom-media-queries": true,
    "custom-properties": true,
    "gap-properties": true,
    "nesting-rules": true,
  },
  stage: 1,
};

const config = {
  plugins: [
    "postcss-import",
    "postcss-flexbugs-fixes",
    ["postcss-preset-env", presetEnvOptions],
    "postcss-normalize",
    ["cssnano", { preset: "advanced" }],
  ],
  sourceMap: true,
};

module.exports = { config, presetEnvOptions };
