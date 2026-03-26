export const COLOR_PROP_REGEX =
  /(^(--.*)\b|\b(.*color|.*shadow|background.*|border.*|outline.*|list-style.*|fill|stroke)\b)/;
export const COLOR_VALUE_REGEX =
  /#(?:[A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})\b|\b(?:rgb|hsl|oklch)a?\([^)]*\)/gi;
