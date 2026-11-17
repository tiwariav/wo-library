/* eslint-disable @typescript-eslint/no-magic-numbers -- calendar unit sizes */

const MS_PER_SECOND = 1000;
const SECOND = 1;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;
const MS_PER_MINUTE = MINUTE * MS_PER_SECOND;
const MINUTES_PER_HOUR = HOUR / MINUTE;
const HOURS_PER_DAY = DAY / HOUR;

type Instant = Date | number | string;

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", YEAR],
  ["month", MONTH],
  ["week", WEEK],
  ["day", DAY],
  ["hour", HOUR],
  ["minute", MINUTE],
];

/**
 * Locale-aware relative time via `Intl.RelativeTimeFormat`
 * (e.g. "5 minutes ago", "in 2 hours"). Under a minute uses "just now" semantics
 * via `numeric: "auto"` with a zero second offset.
 */
export function formatRelativeTime(
  when: Instant,
  now: Date | number = Date.now(),
  locale?: string,
): string {
  const whenMs = new Date(when).getTime();
  const nowMs = new Date(now).getTime();
  const seconds = Math.round((whenMs - nowMs) / MS_PER_SECOND);
  if (Number.isNaN(seconds)) {
    return "";
  }
  if (Math.abs(seconds) < MINUTE) {
    return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
      0,
      "second",
    );
  }
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) {
      return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
        Math.round(seconds / size),
        unit,
      );
    }
  }
  /* v8 ignore next 4 -- minute unit always matches when abs(seconds) >= 60 */
  return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
    Math.round(seconds / MINUTE),
    "minute",
  );
}

/**
 * Exact localised timestamp for tooltips next to relative labels.
 * Defaults to `Asia/Kolkata` so Indian projects get IST without extra config.
 */
export function formatExactTime(
  when: Instant,
  options: { locale?: string; timeZone?: string } = {},
): string {
  const { locale = "en-IN", timeZone = "Asia/Kolkata" } = options;
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    timeZone,
    year: "numeric",
  }).format(new Date(when));
}

/**
 * Short English age for compact badges: "just now", "12 min ago", "2 h ago",
 * "3 d ago". Requires an injected `now` so callers stay testable.
 * Future timestamps read as "just now".
 */
export function formatShortAge(at: Instant, now: Date | number): string {
  const then = new Date(at).getTime();
  const elapsed = new Date(now).getTime() - then;
  const ms = Math.max(0, elapsed);
  const minutes = Math.round(ms / MS_PER_MINUTE);
  if (minutes < 1) {
    return "just now";
  }
  if (minutes < MINUTES_PER_HOUR) {
    return `${minutes} min ago`;
  }
  const hours = Math.round(minutes / MINUTES_PER_HOUR);
  if (hours < HOURS_PER_DAY) {
    return `${hours} h ago`;
  }
  return `${Math.round(hours / HOURS_PER_DAY)} d ago`;
}
