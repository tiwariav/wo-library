const R_SHIFT = 24;
const G_SHIFT = 16;
const B_SHIFT = 8;
const HEX_BASE = 16;

/**
 * Converts RGB color values to a hex color string.
 *
 * @param r - Red channel (0-255)
 * @param g - Green channel (0-255)
 * @param b - Blue channel (0-255)
 * @returns Hex color string (e.g., "#ff5733")
 *
 * @example
 * ```typescript
 * rgbToHex(255, 87, 51);  // "#ff5733"
 * rgbToHex(0, 0, 0);      // "#000000"
 * rgbToHex(255, 255, 255); // "#ffffff"
 * ```
 */
export function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    ((1 << R_SHIFT) | (r << G_SHIFT) | (g << B_SHIFT) | b)
      .toString(HEX_BASE)
      .slice(1)
  );
}

/**
 * Converts a hex color string to an RGB object. Supports both shorthand (#fff) and full (#ffffff) formats.
 *
 * @param hex - The hex color string (with or without leading #)
 * @returns An object with `r`, `g`, `b` properties, or `null` if the hex string is invalid
 *
 * @example
 * ```typescript
 * hexToRgb("#ff5733");  // { r: 255, g: 87, b: 51 }
 * hexToRgb("#fff");     // { r: 255, g: 255, b: 255 }
 * hexToRgb("invalid");  // null
 * ```
 */
export function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([\da-f])([\da-f])([\da-f])$/i;
  // eslint-disable-next-line @typescript-eslint/max-params
  hex = hex.replace(shorthandRegex, (_, r: string, g: string, b: string) => {
    return r + r + g + g + b + b;
  });

  const result = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex);
  return result
    ? {
        b: Number.parseInt(result[3], 16),
        g: Number.parseInt(result[2], 16),
        r: Number.parseInt(result[1], 16),
      }
    : null;
}

const RGB_BASE = 0xff_ff_ff;
const MAX_RGB = 255;
const MAX_ANGLE = 360;

function getRandomRgb(opacity = 100) {
  // eslint-disable sonarjs/pseudo-random
  const number_ = Math.round(RGB_BASE * Math.random());
  const r = number_ >> G_SHIFT;
  const g = (number_ >> B_SHIFT) & MAX_RGB;
  const b = number_ & MAX_RGB;
  return `rgb(${r} ${g} ${b} / ${opacity}%)`;
}

/**
 * Generates a random CSS linear-gradient string with two random colors and a random angle.
 *
 * @param opacity - Opacity percentage for both colors (0-100)
 * @returns A CSS `linear-gradient()` string
 *
 * @example
 * ```typescript
 * randomGradientGenerator(80);
 * // "linear-gradient(45deg, rgb(120 55 200 / 80%), rgb(30 180 90 / 80%))"
 * ```
 */
export function randomGradientGenerator(opacity: number) {
  const newColor1 = getRandomRgb(opacity);
  const newColor2 = getRandomRgb(opacity);
  // eslint-disable sonarjs/pseudo-random
  const angle = Math.round(Math.random() * MAX_ANGLE);
  return `linear-gradient(${angle}deg, ${newColor1}, ${newColor2})`;
}
