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

const MAX_THRESHOLD = 100;

function getWhitelistHashKey(pair) {
  return pair.toSorted().join("-");
}

function getProp(decl) {
  const { prop } = decl;
  if (prop.startsWith("--")) {
    return prop;
  }
  const { selector } = decl.parent;
  return `${selector} -> ${prop}`;
}

function parseColor(value) {
  try {
    return new Color(value);
  } catch (error) {
    if (error instanceof TypeError) {
      return null;
    }
    throw error;
  }
}

function reportColorMatch({ colorList, decl, delta, newColorString, result }) {
  for (const { prop } of colorList) {
    report({
      message: messages.rejected(
        colorList[0].value,
        newColorString,
        delta,
        prop,
      ),
      node: decl,
      result,
      ruleName,
      word: newColorString,
    });
  }
}

function isWhitelistedPair(colorString, newColorString, whitelistHash) {
  const hashKey = getWhitelistHashKey([colorString, newColorString]);
  return Boolean(whitelistHash[hashKey]);
}

function findIndistinguishableColors({
  colors,
  decl,
  newColor,
  newColorString,
  result,
  threshold,
  whitelistHash,
}) {
  for (const colorString of Object.keys(colors)) {
    const colorList = colors[colorString];
    if (!colorList || colorList.length === 0) {
      continue;
    }
    if (isWhitelistedPair(colorString, newColorString, whitelistHash)) {
      continue;
    }
    if (colorList[0].color === newColor) {
      continue;
    }

    const delta = colorList[0].color.deltaE(newColor, "2000");
    if (delta < threshold) {
      reportColorMatch({ colorList, decl, delta, newColorString, result });
    }
  }
}

function trackColor(colors, colorValue, colorString, prop) {
  colors[colorString] ||= [];
  colors[colorString].push({ color: colorValue, prop, value: colorString });
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
        actual: secondaryOptions,
        optional: true,
        possible: {
          threshold: (x) => Number.isInteger(x) && x >= 0 && x <= MAX_THRESHOLD,
          whitelist: (x) =>
            Array.isArray(x) &&
            x.every(
              (index) =>
                Object.prototype.toString.call(index) === "[object String]",
            ),
        },
      },
    );
    const { threshold = 3, whitelist = [] } = secondaryOptions;
    const whitelistHash = {};
    for (const pair of whitelist) {
      if (!Array.isArray(pair)) {
        throw new TypeError(
          "The whitelist option takes an array of array pairs. " +
            "You probably sent an array of strings.",
        );
      }
      whitelistHash[getWhitelistHashKey(pair)] = true;
    }
    if (!validOptions) {
      return;
    }
    const colors = {};
    root.walkDecls(COLOR_PROP_REGEX, (decl) => {
      const newColorStrings = decl.value.match(COLOR_VALUE_REGEX);
      if (!newColorStrings) {
        return;
      }

      for (const newColorString of newColorStrings) {
        const newColor = parseColor(newColorString);
        if (!newColor) {
          continue;
        }

        const prop = getProp(decl);
        trackColor(colors, newColor, newColorString, prop);
        findIndistinguishableColors({
          colors,
          decl,
          newColor,
          newColorString,
          result,
          threshold,
          whitelistHash,
        });
      }
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default createPlugin(ruleName, ruleFunction);
