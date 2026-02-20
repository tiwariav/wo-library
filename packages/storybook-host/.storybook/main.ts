import type { StorybookConfig } from "@storybook/react-webpack5";

import path from "node:path";

const isDev = process.env.NODE_ENV === "development";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): string {
  // eslint-disable-next-line unicorn/prefer-module
  return path.dirname(require.resolve(path.join(value, "package.json")));
}

const config: StorybookConfig = {
  stories: [
    "../../../packages/react/src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../../../packages/ui/src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../../../packages/web/src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
  ],
  addons: [
    getAbsolutePath("@storybook/addon-webpack5-compiler-swc"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-backgrounds"),
    getAbsolutePath("@storybook/addon-controls"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-actions"),
    getAbsolutePath("@storybook/addon-interactions"),
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-measure"),
    getAbsolutePath("@storybook/addon-outline"),
    {
      name: getAbsolutePath("@storybook/addon-styling-webpack"),
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
                // eslint-disable-next-line unicorn/prefer-module
                options: { implementation: require.resolve("postcss") },
              },
            ],
          },
        ],
      },
    },
    getAbsolutePath("@storybook/addon-themes"),
    getAbsolutePath("@storybook/addon-toolbars"),
    getAbsolutePath("@storybook/addon-viewport"),
    getAbsolutePath("@chromatic-com/storybook"),
  ],
  core: {
    disableTelemetry: true,
  },
  docs: {
    autodocs: true,
    defaultName: "Documentation",
  },
  features: {
    argTypeTargetsV7: true,
  },
  framework: {
    // @ts-expect-error 2353 because name does exist
    name: getAbsolutePath("@storybook/react-webpack5"),
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
  webpackFinal: async (config) => {
    // Handle fullySpecified modules
    config.module?.rules?.push({
      test: /\.m?js/,
      resolve: {
        fullySpecified: false,
      },
    });

    // Add extension aliases for nodeNext resolution
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
