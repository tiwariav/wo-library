import { StorybookConfig } from "@storybook/react-webpack5";
import main, { getAbsolutePath } from "../src/tools/storybook/main";
import {
  modulesFullySpecified,
  nodeNextExtensionAlias,
} from "../src/tools/storybook/webpack";

const config: StorybookConfig = {
  ...main,
  addons: [...(main.addons || []), getAbsolutePath("@storybook/addon-themes")],
  webpackFinal: (config) => {
    config = modulesFullySpecified(config);
    config = nodeNextExtensionAlias(config);
    return config;
  },
  stories: [
    "../src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../../ui/src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../../web/src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
  ],
};

export default config;
