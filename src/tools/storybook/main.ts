import { StorybookConfig } from "@storybook/react-webpack5";
import postcss from "postcss";

const config: Omit<StorybookConfig, "stories"> = {
  addons: [
    "@storybook/addon-webpack5-compiler-swc",
    "@storybook/addon-a11y",
    "@storybook/addon-backgrounds",
    "@storybook/addon-controls",
    "@storybook/addon-coverage",
    "@storybook/addon-docs",
    "@storybook/addon-actions",
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
    "@chromatic-com/storybook",
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
  },
  framework: {
    name: "@storybook/react-webpack5",
    options: {
      builder: {
        useSWC: true,
      },
    },
  },
  swc: () => ({
    jsc: {
      transform: {
        react: {
          runtime: "automatic",
        },
      },
    },
  }),
};

export default config;
