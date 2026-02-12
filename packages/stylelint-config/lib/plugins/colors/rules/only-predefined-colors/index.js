import Color from "colorjs.io";
import stylelint from "stylelint";
import { COLOR_PROP_REGEX, COLOR_VALUE_REGEX } from "../../utils.js";

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = "@wo-library/stylelint-config/only-predefined-colors";

const messages = ruleMessages(ruleName, {
  rejected: (value, lightness) =>
    `Invalid value ${value}. Use values from one of ${lightness.join(", ")}`,
});

const meta = {
  url: "https://github.com/tiwariav/stylelint-config/rules/only-predefined-colors/README.md",
};

/** @type {import('stylelint').Rule} */
const ruleFunction = (primary, secondaryOptions = {}) => {
  return (root, result) => {
    const validOptions = validateOptions(
      result,
      ruleName,
      {
        actual: primary,
        possible: [true],
      },
      {
        optional: true,
        actual: secondaryOptions,
        possible: {
          lightness: (x) => typeof x === "number",
        },
      }
    );
    const {
      lightness = [
        // default values based on tailwind
        97.78, 93.56, 88.11, 82.67, 74.22, 64.78, 57.33, 46.89, 39.44, 32,
        23.78,
      ],
    } = secondaryOptions;
    if (!validOptions) return;
    root.walkDecls(COLOR_PROP_REGEX, (decl) => {
      const newColorStrings = decl.value.match(COLOR_VALUE_REGEX);
      if (!newColorStrings) {
        return;
      }

      for (const newColorString of newColorStrings) {
        let newColor;
        try {
          newColor = new Color(newColorString);
        } catch (error) {
          if (error instanceof TypeError) {
            continue;
          }
        }
        if (
          newColor.space === Color.spaces.oklch &&
          newColor.oklch[0] &&
          !lightness.includes(newColor.oklch[0] * 100)
        ) {
          report({
            result,
            ruleName,
            message: messages.rejected(newColor.oklch[0] * 100, lightness),
            node: decl,
            word: newColorString,
          });
        }
      }
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default createPlugin(ruleName, ruleFunction);
