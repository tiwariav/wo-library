import { StorybookConfig } from "@storybook/react-webpack5";
import main from "../src/tools/storybook/main";
import {
  modulesFullySpecified,
  nodeNextExtensionAlias,
} from "../src/tools/storybook/webpack";

const config: StorybookConfig = {
  ...main,
  webpackFinal: (config) => {
    config = modulesFullySpecified(config);
    config = nodeNextExtensionAlias(config);
    return config;
  },
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx|mdx)"],
};

export default config;
