import { isFinite, isNil, isNumber, isString } from "lodash-es";

export function stringToNumber(value: number | string, nanValue?: NumberLike) {
  if (isNumber(value)) {
    return value;
  }
  const number = Number.parseFloat(
    isString(value) ? value.replaceAll(",", "") : value,
  );
  if (Number.isNaN(number)) {
    return nanValue;
  }
  return number;
}

export interface FormatNumberOptions extends Intl.NumberFormatOptions {
  fractionDigits?: number;
  nullValue?: string;
}

export function formatNumber(
  value: number | string,
  {
    fractionDigits = 2,
    maximumFractionDigits,
    minimumFractionDigits,
    nullValue = "",
    ...options
  }: FormatNumberOptions = {},
) {
  const number = stringToNumber(value, nullValue);
  if (!isFinite(number) || isNil(number)) {
    return nullValue;
  }
  const adjustedMinFractionDigits = Math.max(
    minimumFractionDigits ?? maximumFractionDigits ?? fractionDigits,
    isString(value) && value.endsWith(".") ? 1 : 0,
  );
  return number.toLocaleString("en-IN", {
    maximumFractionDigits: Math.max(
      maximumFractionDigits ?? fractionDigits,
      adjustedMinFractionDigits,
    ),
    minimumFractionDigits: adjustedMinFractionDigits,
    ...options,
  });
}

export interface FormatNumberSuffixOptions extends FormatNumberOptions {
  suffix?: string;
}

const CRORE = 10_000_000;
const LAKH = 100_000;
const THOUSAND = 1000;

function getSuffixString(suffix: string, parsedNumber: number) {
  let suffixString = suffix;
  let finalNumber = parsedNumber;
  if ((!suffix && Math.abs(finalNumber) >= CRORE) || suffix === "Cr") {
    finalNumber /= CRORE;
    suffixString = " Cr";
  } else if ((!suffix && Math.abs(finalNumber) >= LAKH) || suffix === "L") {
    finalNumber /= LAKH;
    suffixString = " L";
  } else if ((!suffix && Math.abs(finalNumber) >= THOUSAND) || suffix === "K") {
    finalNumber /= THOUSAND;
    suffixString = " K";
  }
  return { finalNumber, suffixString };
}

export function formatNumberWithSuffix(
  value: number | string,
  { nullValue = "", suffix = "", ...options }: FormatNumberSuffixOptions = {},
) {
  const parsedNumber = isNumber(value) ? value : Number.parseFloat(value);
  if (Number.isNaN(parsedNumber)) {
    return nullValue;
  }
  const { finalNumber, suffixString } = getSuffixString(suffix, parsedNumber);
  const formattedNumber = formatNumber(finalNumber, options);
  return `${formattedNumber}${suffixString}`;
}

export type NumberLike = null | number | string | undefined;

const CARDINAL_MAP: Record<number, string> = {
  1: "1st",
  2: "2nd",
  3: "3rd",
};

export function ordinalNumber(value: number) {
  if (!isNumber(value)) {
    return value;
  }
  if (value in CARDINAL_MAP) {
    return CARDINAL_MAP[value];
  }
  return `${value}th`;
}
