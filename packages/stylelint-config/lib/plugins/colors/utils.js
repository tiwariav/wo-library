const COLOR_RELATED_PROP_PARTS = [
  "color",
  "shadow",
  "background",
  "border",
  "outline",
  "list-style",
];
const COLOR_RELATED_PROPS_PATTERN = COLOR_RELATED_PROP_PARTS.join("|");

const HEX_COLOR_REGEX = /#[\dA-F]{3}(?:[\dA-F]{3}|[\dA-F]{5})?\b/i;
const FUNCTION_COLOR_REGEX = /\b(?:rgb|hsl|oklch)a?\([^)]*\)/i;

export const COLOR_PROP_REGEX = new RegExp(
  `^(--.+|.*(?:${COLOR_RELATED_PROPS_PATTERN}).*|fill|stroke)$`,
);
export const COLOR_VALUE_REGEX = new RegExp(
  `${HEX_COLOR_REGEX.source}|${FUNCTION_COLOR_REGEX.source}`,
  "gi",
);
