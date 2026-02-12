const a = require("stylelint");

module.exports = {
  extends: "@tiwariav/stylelint-config",
  rules: {
    "csstools/media-use-custom-media": null,
    "csstools/value-no-unknown-custom-properties": [
      true,
      {
        importFrom: ["src/styles/base.css"],
      },
    ],
  },
};
