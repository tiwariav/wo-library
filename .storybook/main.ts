import { StorybookConfig } from "@storybook/react-webpack5";
import main from "../src/tools/storybook/main";
import {
  cssModules,
  modulesFullySpecified,
  nodeNextExtensionAlias,
} from "../src/tools/storybook/webpack";

const config: StorybookConfig = {
  ...main,
  webpackFinal: (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // 'PRODUCTION' is used when building the static version of storybook.
    config = cssModules(config, { configType });
    config = modulesFullySpecified(config);
    config = nodeNextExtensionAlias(config);
    return config;
  },
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx|mdx)"],
};

export default config;
