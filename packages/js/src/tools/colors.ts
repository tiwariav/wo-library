const R_SHIFT = 24;
const G_SHIFT = 16;
const B_SHIFT = 8;
const HEX_BASE = 16;

export function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    ((1 << R_SHIFT) | (r << G_SHIFT) | (g << B_SHIFT) | b)
      .toString(HEX_BASE)
      .slice(1)
  );
}

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
  const number_ = Math.round(RGB_BASE * Math.random());
  const r = number_ >> G_SHIFT;
  const g = (number_ >> B_SHIFT) & MAX_RGB;
  const b = number_ & MAX_RGB;
  return `rgb(${r} ${g} ${b} / ${opacity}%)`;
}

export function randomGradientGenerator(opacity: number) {
  const newColor1 = getRandomRgb(opacity);
  const newColor2 = getRandomRgb(opacity);
  const angle = Math.round(Math.random() * MAX_ANGLE);
  return `linear-gradient(${angle}deg, ${newColor1}, ${newColor2})`;
}
