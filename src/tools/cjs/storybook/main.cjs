const {
  cssModules,
  modulesFullySpecified,
  nodeNextExtensionAlias,
} = require("./webpack.cjs");

module.exports = {
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-actions",
    "@storybook/addon-backgrounds",
    "@storybook/addon-controls",
    "@storybook/addon-docs",
    "@storybook/addon-events",
    "@storybook/addon-interactions",
    "@storybook/addon-jest",
    "@storybook/addon-links",
    "@storybook/addon-measure",
    "@storybook/addon-outline",
    {
      name: "@storybook/addon-postcss",
      options: {
        postcssLoaderOptions: {
          // to use postcss v8
          implementation: require("postcss"),
        },
      },
    },
    "@storybook/addon-queryparams",
    "@storybook/addon-toolbars",
    "@storybook/addon-viewport",
  ],
  core: {
    builder: {
      name: "webpack5",
      options: {
        fsCache: true,
        lazyCompilation: true,
      },
    },
    disableTelemetry: true, // 👈 Disables telemetry
  },
  features: {
    previewMdx2: true,
    // babelModeV7: true,
  },
  framework: "@storybook/react",
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // 'PRODUCTION' is used when building the static version of storybook.

    config = cssModules(config, { configType });
    config = modulesFullySpecified(config);
    config = nodeNextExtensionAlias(config);
    return config;
  },
};
