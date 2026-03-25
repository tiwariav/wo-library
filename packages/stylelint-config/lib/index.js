import pluginA11y from "@double-great/stylelint-a11y";
import configCleanOrder from "stylelint-config-clean-order";
import pluginCustomMedia from "stylelint-media-use-custom-media";
import pluginDefensiveCss from "stylelint-plugin-defensive-css";
import pluginUseNesting from "stylelint-use-nesting";
import pluginNoUnknownProperties from "stylelint-value-no-unknown-custom-properties";
import pluginColors from "./plugins/colors/index.js";

export default {
  extends: ["stylelint-config-standard", configCleanOrder],
  plugins: [
    "stylelint-declaration-block-no-ignored-properties",
    "stylelint-declaration-strict-value",
    pluginA11y,
    pluginColors,
    pluginCustomMedia,
    pluginDefensiveCss,
    pluginUseNesting,
    pluginNoUnknownProperties,
  ],
  rules: {
    "alpha-value-notation": "number",
    "at-rule-no-unknown": null,
    "declaration-property-value-no-unknown": true,
    "font-weight-notation": "numeric",
    "function-no-unknown": null,
    "max-nesting-depth": 4,
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["global"],
      },
    ],
    "@wo-library/stylelint-config/only-predefined-colors": true,
    "@wo-library/stylelint-config/no-indistinguishable-colors": [
      true,
      {
        threshold: 3,
      },
    ],
    "a11y/media-prefers-reduced-motion": true,
    "a11y/no-obsolete-attribute": true,
    "a11y/no-obsolete-element": true,
    "a11y/no-outline-none": true,
    "csstools/media-use-custom-media": "always",
    "csstools/use-nesting": "always",
    "csstools/value-no-unknown-custom-properties": true,
    "plugin/declaration-block-no-ignored-properties": true,
    "plugin/use-defensive-css": [
      true,
      {
        "accidental-hover": true,
        "background-repeat": true,
        "scroll-chaining": true,
        "scrollbar-gutter": true,
      },
    ],
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
  },
};
