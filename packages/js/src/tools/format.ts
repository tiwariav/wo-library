/**
 * Locale-aware date/currency formatting via `Intl` (no i18n framework coupling).
 */

import { isDate } from "lodash-es";

const DEFAULT_TIME_ZONE = "Asia/Kolkata";
const MS_MINUTE = 60_000;
const MS_DAY = 86_400_000;
const MINUTES_PER_HOUR = 60;

export type DateInput = Date | null | number | string | undefined;

/** Map short language codes to Intl locales. */
export function intlLocaleFor(locale: string): string {
  if (locale.startsWith("hi") && locale !== "hi-Latn") {
    return "hi-IN";
  }
  if (locale.startsWith("mr")) {
    return "mr-IN";
  }
  return "en-IN";
}

/**
 * Locale for dates/times when digits should stay Latin.
 * Language codes: `en`, `hi`, `mr`, `hi-Latn`.
 */
export function dateLocaleFor(language: string | undefined): string {
  if (language === "hi") {
    return "hi-IN-u-nu-latn";
  }
  if (language === "mr") {
    return "mr-IN-u-nu-latn";
  }
  return "en-IN";
}

function toDate(value: DateInput): Date | null {
  if (value == null || value === "") {
    return null;
  }
  const date = isDate(value) ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatCurrency(
  amount: null | number | undefined,
  currency = "INR",
): string {
  if (amount == null) {
    return "";
  }
  return new Intl.NumberFormat("en-IN", {
    currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency",
  }).format(amount);
}

/** Currency without forced `.00` padding. */
export function formatRupees(amount: null | number | undefined): string {
  if (amount == null) {
    return "";
  }
  return new Intl.NumberFormat("en-IN", {
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    style: "currency",
  }).format(amount);
}

export function formatPlainNumber(value: null | number | undefined): string {
  if (value == null) {
    return "";
  }
  return new Intl.NumberFormat("en-IN").format(value);
}

export function formatClock(
  value: DateInput,
  locale = "en-IN",
  timeZone = DEFAULT_TIME_ZONE,
): string {
  const date = toDate(value);
  if (!date) {
    return "";
  }
  return new Intl.DateTimeFormat(intlLocaleFor(locale), {
    hour: "numeric",
    hour12: true,
    minute: "2-digit",
    timeZone,
  })
    .format(date)
    .replace(
      /\s?([AP]M)$/i,
      (_, meridiem: string) => ` ${meridiem.toLowerCase()}`,
    );
}

export function formatDay(
  value: DateInput,
  locale = "en-IN",
  timeZone = DEFAULT_TIME_ZONE,
): string {
  const date = toDate(value);
  if (!date) {
    return "";
  }
  return new Intl.DateTimeFormat(intlLocaleFor(locale), {
    day: "numeric",
    month: "short",
    timeZone,
    year: "numeric",
  })
    .format(date)
    .replaceAll(/\bSept\b/g, "Sep");
}

export function formatDayTime(
  value: DateInput,
  locale = "en-IN",
  timeZone = DEFAULT_TIME_ZONE,
): string {
  const date = toDate(value);
  if (!date) {
    return "";
  }
  return `${formatDay(date, locale, timeZone)}, ${formatClock(date, locale, timeZone)}`;
}

function dayOffsetInZone(date: Date, now: Date, timeZone: string): number {
  const dayStart = (instant: Date) => {
    const part = new Intl.DateTimeFormat("en-CA", { timeZone }).format(instant);
    return Date.parse(`${part}T00:00:00Z`);
  };
  return Math.round((dayStart(date) - dayStart(now)) / MS_DAY);
}

export interface FormatWhenOptions {
  locale?: string;
  now?: Date;
  timeZone?: string;
}

/**
 * Compact "when" label: relative within an hour, today/yesterday/tomorrow + clock
 * within one day, otherwise full day+time.
 */
export function formatWhen(
  value: DateInput,
  options: FormatWhenOptions = {},
): string {
  const {
    locale = "en-IN",
    now = new Date(),
    timeZone = DEFAULT_TIME_ZONE,
  } = options;
  const date = toDate(value);
  if (!date) {
    return "";
  }
  const loc = intlLocaleFor(locale);
  const minutes = Math.round((date.getTime() - now.getTime()) / MS_MINUTE);
  if (Math.abs(minutes) < MINUTES_PER_HOUR) {
    if (minutes === 0) {
      return new Intl.RelativeTimeFormat(loc, { numeric: "auto" }).format(
        0,
        "second",
      );
    }
    return new Intl.RelativeTimeFormat(loc, {
      numeric: "always",
      style: "short",
    }).format(minutes, "minute");
  }
  const offset = dayOffsetInZone(date, now, timeZone);
  if (Math.abs(offset) <= 1) {
    const word = new Intl.RelativeTimeFormat(loc, { numeric: "auto" }).format(
      offset,
      "day",
    );
    return `${word} ${formatClock(date, locale, timeZone)}`;
  }
  return formatDayTime(date, locale, timeZone);
}
