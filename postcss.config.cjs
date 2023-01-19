/* eslint-disable unicorn/prefer-module */
module.exports = {
  plugins: [
    "cssnano",
    "postcss-import",
    "postcss-flexbugs-fixes",
    [
      "postcss-preset-env",
      {
        autoprefixer: {
          flexbox: "no-2009",
        },
        features: {
          "custom-media-queries": true,
          "custom-properties": true,
          "gap-properties": true,
          "nesting-rules": true,
        },
        stage: 1,
      },
    ],
    // Adds PostCSS Normalize as the reset css with default options,
    // so that it honors browserslist config in package.json
    // which in turn let's users customize the target behavior as per their needs.
    "postcss-normalize",
  ],
  sourceMap: true,
};
