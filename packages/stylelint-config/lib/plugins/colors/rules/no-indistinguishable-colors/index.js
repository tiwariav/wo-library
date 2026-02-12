import Color from "colorjs.io";
import stylelint from "stylelint";
import { COLOR_PROP_REGEX, COLOR_VALUE_REGEX } from "../../utils.js";

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = "@wo-library/stylelint-config/no-indistinguishable-colors";

const messages = ruleMessages(ruleName, {
  rejected: (color1, color2, delta, prop1, prop2) =>
    `Unexpected indistinguishable color "${color2}" from "${color1}" for "${prop1}", with a delta of ${delta}`,
});

const meta = {
  url: "https://github.com/tiwariav/stylelint-config/rules/no-indistinguishable-colors/README.md",
};

function getWhitelistHashKey(pair) {
  pair = pair.sort();
  return pair[0] + "-" + pair[1];
}

function getProp(decl) {
  const prop = decl.prop;
  if (prop.startsWith("--")) {
    return prop;
  }
  return `${decl.parent.selector} -> ${decl.prop}`;
}

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
          whitelist: (x) =>
            Array.isArray(x) && x.every((i) => typeof i === "string"),
          threshold: (x) => Number.isInteger(x) && x >= 0 && x <= 100,
        },
      }
    );
    const { threshold = 3, whitelist = [] } = secondaryOptions;
    const whitelistHash = {};
    for (const pair of whitelist) {
      if (!Array.isArray(pair)) {
        throw new Error(
          "The whitelist option takes an array of array pairs. " +
            "You probably sent an array of strings."
        );
      }
      whitelistHash[getWhitelistHashKey(pair)] = true;
    }
    if (!validOptions) return;
    const colors = {};
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

        if (!(newColorString in colors)) {
          colors[newColorString] = colors[newColorString] || [];
          colors[newColorString].push({ color: newColor, prop: getProp(decl) });
        }

        for (const colorString of Object.keys(colors)) {
          /** @type {{color:Color; prop: string}[]} */
          const colorList = colors[colorString];
          if (colorList[0].color === newColor) {
            return;
          }
          const delta = colorList[0].color.deltaE(newColor, "2000");
          if (delta < threshold) {
            for (const { color, prop } of colorList) {
              report({
                result,
                ruleName,
                message: messages.rejected(
                  colorString,
                  newColorString,
                  delta,
                  prop
                ),
                node: decl,
                word: newColorString,
              });
            }
          }
        }
      }
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default createPlugin(ruleName, ruleFunction);
