import { StorybookConfig } from "@storybook/react-webpack5";
import { dirname, join } from "node:path";

const isDev = process.env.NODE_ENV === "development";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
export function getAbsolutePath(value: string): string {
  // eslint-disable-next-line unicorn/prefer-module
  return dirname(require.resolve(join(value, "package.json")));
}

const config: Omit<StorybookConfig, "stories"> = {
  addons: [
    getAbsolutePath("@storybook/addon-webpack5-compiler-swc"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-backgrounds"),
    getAbsolutePath("@storybook/addon-controls"),
    // enable when compatible with v8
    // getAbsolutePath("@storybook/addon-coverage"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-actions"),
    getAbsolutePath("@storybook/addon-interactions"),
    getAbsolutePath("@storybook/addon-jest"),
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
    getAbsolutePath("@storybook/addon-toolbars"),
    getAbsolutePath("@storybook/addon-viewport"),
    getAbsolutePath("@chromatic-com/storybook"),
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
    // @ts-expect-error 2353
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
};

export default config;
