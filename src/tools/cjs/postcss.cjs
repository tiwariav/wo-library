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

const getFinalConfig = (env) => ({
  plugins: [
    "postcss-import",
    ["postcss-preset-env", { ...presetEnvOptions, env }],
    ["cssnano", { preset: "advanced" }],
  ],
  sourceMap: env === "development",
});

module.exports = { getFinalConfig, presetEnvOptions };
