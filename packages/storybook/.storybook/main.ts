import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

const storybookDir = dirname(fileURLToPath(import.meta.url));
const docsDir = resolve(storybookDir, "../src/docs");

const stories = [
  resolve(
    storybookDir,
    "../../../packages/registry/**/*.stories.@(js|jsx|ts|tsx|mdx)",
  ),
  resolve(
    storybookDir,
    "../../../packages/web/src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
  ),
];

if (existsSync(docsDir)) {
  stories.push(resolve(docsDir, "**/*.mdx"));
}

const config: StorybookConfig = {
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-links",
    "@storybook/addon-themes",
    "@chromatic-com/storybook",
  ],
  core: {
    disableTelemetry: true,
  },
  docs: {
    autodocs: "tag",
    defaultName: "Documentation",
  },
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  stories,
  async viteFinal(config) {
    config.plugins = [...(config.plugins ?? []), react(), tailwindcss()];
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        "@wo-library/js": resolve(storybookDir, "../../js/src/index.ts"),
        "@wo-library/web": resolve(storybookDir, "../../web/src/index.ts"),
      },
    };
    return config;
  },
};

export default config;
