import configCleanOrder from "stylelint-config-clean-order";
import pluginColors from "./plugins/colors/index.js";

export default {
  extends: ["stylelint-config-standard", configCleanOrder],
  plugins: [
    "@double-great/stylelint-a11y",
    "stylelint-media-use-custom-media",
    "stylelint-use-nesting",
    "stylelint-value-no-unknown-custom-properties",
    "stylelint-declaration-block-no-ignored-properties",
    "stylelint-declaration-strict-value",
    pluginColors,
  ],
  rules: {
    "@wo-library/stylelint-config/no-indistinguishable-colors": [
      true,
      {
        threshold: 3,
      },
    ],
    "@wo-library/stylelint-config/only-predefined-colors": true,
    "a11y/media-prefers-reduced-motion": true,
    "a11y/no-obsolete-attribute": true,
    "a11y/no-obsolete-element": true,
    "a11y/no-outline-none": true,
    "alpha-value-notation": "number",
    "at-rule-no-unknown": null,
    "csstools/media-use-custom-media": "always",
    "csstools/use-nesting": "always",
    "csstools/value-no-unknown-custom-properties": true,
    "declaration-property-value-no-unknown": true,
    "font-weight-notation": "numeric",
    "function-no-unknown": null,
    "max-nesting-depth": 4,
    "plugin/declaration-block-no-ignored-properties": true,
    "scale-unlimited/declaration-strict-value": [
      [
        "/color$/",
        "background",
        "border-radius",
        "box-shadow",
        "font-size",
        "z-index",
        "/margin/",
        "/padding/",
        "/gap/",
      ],
      {
        disableFix: true,
        ignoreValues: [
          "auto",
          "currentColor",
          "inherit",
          "none",
          "transparent",
          0,
        ],
      },
    ],
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["global"],
      },
    ],
  },
};
