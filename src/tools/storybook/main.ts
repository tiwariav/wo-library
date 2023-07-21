import { StorybookConfig } from "@storybook/react-webpack5";
import postcss from "postcss";

const config: Omit<StorybookConfig, "stories"> = {
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-actions",
    "@storybook/addon-backgrounds",
    "@storybook/addon-controls",
    "@storybook/addon-coverage",
    "@storybook/addon-docs",
    "@storybook/addon-interactions",
    "@storybook/addon-links",
    "@storybook/addon-measure",
    "@storybook/addon-outline",
    {
      name: "@storybook/addon-postcss",
      options: {
        postcssLoaderOptions: {
          // to use postcss v8
          implementation: postcss,
        },
      },
    },
    "@storybook/addon-toolbars",
    "@storybook/addon-viewport",
  ],
  core: {
    disableTelemetry: true, // 👈 Disables telemetry
  },
  docs: {
    autodocs: true,
    defaultName: "Documentation",
  },
  features: {
    argTypeTargetsV7: true,
    buildStoriesJson: true,
    storyStoreV7: !global.navigator?.userAgent?.match?.("jsdom"),
  },
  framework: {
    name: "@storybook/react-webpack5",
    options: {
      builder: {
        fsCache: true,
        lazyCompilation: true,
      },
    },
  },
};

export default config;
