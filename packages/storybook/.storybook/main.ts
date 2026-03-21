import type { StorybookConfig } from "@storybook/react-webpack5";
import type { Configuration } from "webpack";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { resolve } from "node:path";

const isDev = process.env.NODE_ENV === "development";
const storybookDir = dirname(fileURLToPath(import.meta.url));

const mediaFile = resolve(process.cwd(), "../ui/src/styles/media.css");

const config: StorybookConfig = {
  stories: [
    resolve(storybookDir, "../../../packages/react/src/**/*.stories.@(js|jsx|ts|tsx|mdx)"),
    resolve(storybookDir, "../../../packages/ui/src/**/*.stories.@(js|jsx|ts|tsx|mdx)"),
    resolve(storybookDir, "../../../packages/web/src/**/*.stories.@(js|jsx|ts|tsx|mdx)"),
    // TypeDoc-generated API reference pages (produced by `yarn docs`)
    resolve(storybookDir, "../src/docs/**/*.mdx"),
  ],
  addons: [
    "@storybook/addon-webpack5-compiler-swc",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-links",
    {
      name: "@storybook/addon-styling-webpack",
      options: {
        rules: [
          // Replaces existing CSS rules to support CSS Modules
          {
            sideEffects: true,
            test: /\.css$/,
            use: [
              "style-loader",
              {
                loader: "css-loader",
                options: {
                  importLoaders: 1,
                  modules: {
                    auto: true,
                    exportLocalsConvention: "camelCase",
                    localIdentName: isDev ? "[name]__[local]" : "[hash:base64]",
                  },
                  sourceMap: isDev,
                },
              },
              {
                loader: "postcss-loader",
                options: {
                  postcssOptions: {
                    plugins: [
                      ["@csstools/postcss-global-data", { files: [mediaFile] }],
                      "postcss-mixins",
                      [
                        "postcss-preset-env",
                        {
                          autoprefixer: { flexbox: "no-2009" },
                          features: {
                            "cascade-layers": false,
                            "custom-media-queries": {},
                            "custom-properties": true,
                            "gap-properties": true,
                            "nesting-rules": true,
                          },
                          stage: 1,
                        },
                      ],
                    ],
                  },
                },
              },
            ],
          },
        ],
      },
    },
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
  webpackFinal: async (config: Configuration) => {
    // Add extension aliases for better TypeScript resolution
    if (config.resolve) {
      config.resolve.extensionAlias = {
        ".js": [".ts", ".tsx", ".js", ".jsx"],
        ".mjs": [".mts", ".mjs"],
        ".cjs": [".cts", ".cjs"],
      };
    }

    return config;
  },
};

export default config;
