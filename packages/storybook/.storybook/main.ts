import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

const storybookDir = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.resolve(storybookDir, "../src/docs");

const stories = [
  path.resolve(storybookDir, "../src/Introduction.mdx"),
  path.resolve(
    storybookDir,
    "../../../packages/registry/**/*.stories.@(js|jsx|ts|tsx|mdx)",
  ),
  path.resolve(
    storybookDir,
    "../../../packages/web/src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
  ),
];

if (existsSync(docsDir)) {
  stories.push(path.resolve(docsDir, "**/*.mdx"));
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
  viteFinal(viteConfig) {
    viteConfig.plugins = [
      ...(viteConfig.plugins ?? []),
      react(),
      tailwindcss(),
    ];
    viteConfig.resolve = {
      ...viteConfig.resolve,
      alias: {
        ...viteConfig.resolve?.alias,
        "@wo-library/js": path.resolve(storybookDir, "../../js/src/index.ts"),
        "@wo-library/web": path.resolve(storybookDir, "../../web/src/index.ts"),
      },
    };
    return viteConfig;
  },
};

export default config;
