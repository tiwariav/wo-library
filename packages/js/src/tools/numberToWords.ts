/* eslint-disable @typescript-eslint/no-magic-numbers -- Indian digit-group boundaries */
/* eslint-disable max-statements -- digit-group conversion is inherently branched */

/**
 * Indian numbering system words (crore / lakh / thousand / hundred).
 */

const ONES = [
  "",
  "One ",
  "Two ",
  "Three ",
  "Four ",
  "Five ",
  "Six ",
  "Seven ",
  "Eight ",
  "Nine ",
  "Ten ",
  "Eleven ",
  "Twelve ",
  "Thirteen ",
  "Fourteen ",
  "Fifteen ",
  "Sixteen ",
  "Seventeen ",
  "Eighteen ",
  "Nineteen ",
];

const TENS = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

const TEENS_CUTOFF = 20;
const MAX_DIGITS = 9;

function twoDigits(value: string): string {
  const asNumber = Number(value);
  if (asNumber < TEENS_CUTOFF) {
    return ONES[asNumber] ?? "";
  }
  const tens = TENS[Number(value[0])] ?? "";
  const ones = ONES[Number(value[1])] ?? "";
  return ones ? `${tens} ${ones}` : `${tens} `;
}

export interface NumberToWordsOptions {
  /** Appended when the number is non-zero. Default: `"Only"`. */
  suffix?: string;
  /** Returned for `0`. Default: `"Zero"`. */
  zeroLabel?: string;
}

/**
 * Convert a non-negative integer (up to 9 digits) to Indian-system English words.
 */
export function numberToWords(
  num: number,
  options: NumberToWordsOptions = {},
): string {
  const { suffix = "Only", zeroLabel = "Zero" } = options;
  const floored = Math.floor(num);
  if (floored < 0) {
    return "";
  }
  const numStr = floored.toString();
  if (numStr.length > MAX_DIGITS) {
    return "Overflow";
  }
  const padded = numStr.padStart(MAX_DIGITS, "0");
  const crore = padded.slice(0, 2);
  const lakh = padded.slice(2, 4);
  const thousand = padded.slice(4, 6);
  const hundred = padded.slice(6, 7);
  const rest = padded.slice(7, 9);
  let str = "";
  if (crore !== "00") {
    str += `${twoDigits(crore)}Crore `;
  }
  if (lakh !== "00") {
    str += `${twoDigits(lakh)}Lakh `;
  }
  if (thousand !== "00") {
    str += `${twoDigits(thousand)}Thousand `;
  }
  if (hundred !== "0") {
    str += `${ONES[Number(hundred)]}Hundred `;
  }
  if (rest !== "00") {
    const andPrefix = str === "" ? "" : "and ";
    str += `${andPrefix}${twoDigits(rest)}`;
  }
  if (str === "") {
    return zeroLabel;
  }
  const trimmed = str.trim();
  return suffix ? `${trimmed} ${suffix}` : trimmed;
}
