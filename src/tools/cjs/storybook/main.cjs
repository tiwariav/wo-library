const {
  cssModules,
  modulesFullySpecified,
  nodeNextExtensionAlias,
} = require("./webpack.cjs");

module.exports = {
  addons: [
    // "@storybook/addon-a11y",
    "@storybook/addon-essentials",
    // "@storybook/addon-actions",
    // "@storybook/addon-backgrounds",
    // "@storybook/addon-controls",
    // "@storybook/addon-docs",
    // "@storybook/addon-events",
    // "@storybook/addon-jest",
    // "@storybook/addon-links",
    // {
    //   name: "@storybook/addon-postcss",
    //   options: {
    //     postcssLoaderOptions: {
    //       implementation: require("postcss"),
    //     },
    //   },
    // },
    // "@storybook/addon-queryparams",
    // "@storybook/addon-storysource",
    // "@storybook/addon-toolbars",
    // "@storybook/addon-viewport",
  ],
  core: {
    builder: {
      name: "webpack5",
      //   options: {
      //     lazyCompilation: true,
      //     fsCache: true,
      //   },
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
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config = cssModules(config, { configType });
    config = modulesFullySpecified(config);
    config = nodeNextExtensionAlias(config);
    return config;
  },
};
