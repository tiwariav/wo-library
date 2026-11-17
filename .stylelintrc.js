module.exports = {
  extends: ["./packages/stylelint-config/lib/index.js"],
  rules: {
    "csstools/value-no-unknown-custom-properties": [
      true,
      {
        importFrom: ["./packages/registry/themes/fresh.css"],
      },
    ],
  },
};
