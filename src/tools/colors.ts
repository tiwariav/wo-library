export function rgbToHex(r: number, g: number, b: number) {
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

export function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([\da-f])([\da-f])([\da-f])$/i;
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

function getRandomRgb(opacity: number = 100) {
  const number_ = Math.round(0xff_ff_ff * Math.random());
  const r = number_ >> 16;
  const g = (number_ >> 8) & 255;
  const b = number_ & 255;
  return `rgb(${r} ${g} ${b} / ${opacity}%)`;
}

export function randomGradientGenerator(opacity: number) {
  const newColor1 = getRandomRgb(opacity);
  const newColor2 = getRandomRgb(opacity);
  const angle = Math.round(Math.random() * 360);
  return `linear-gradient(${angle}deg, ${newColor1}, ${newColor2})`;
}
