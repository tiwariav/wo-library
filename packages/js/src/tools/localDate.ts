/**
 * Calendar-day / month labels for a `Date` in the process local timezone
 * or a fixed wall-clock offset such as IST.
 */

/* eslint-disable @typescript-eslint/no-magic-numbers -- calendar / offset maths */

const pad = (n: number): string => String(n).padStart(2, "0");

/** `YYYY-MM-DD` for the local calendar day `d` falls in. */
export function toLocalDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** `YYYY-MM` for the local calendar month `d` falls in. */
export function toLocalMonthKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

/** Minutes east of UTC for India Standard Time. */
export const IST_OFFSET_MIN = 330;

const MS_PER_MINUTE = 60_000;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Instant as a wall clock at a fixed UTC offset (default IST), independent of
 * process `TZ`.
 */
export function wallClockOf(
  d: Date,
  offsetMin = IST_OFFSET_MIN,
): { dateKey: string; hour: number; minute: number } {
  const shifted = new Date(d.getTime() + offsetMin * MS_PER_MINUTE);
  return {
    dateKey: shifted.toISOString().slice(0, 10),
    hour: shifted.getUTCHours(),
    minute: shifted.getUTCMinutes(),
  };
}

/**
 * Calendar day `dateKey` (`YYYY-MM-DD`) as a `[gte, lt)` UTC instant range at
 * the given wall-clock offset (default IST).
 */
export function dayRangeUtc(
  dateKey: string,
  offsetMin = IST_OFFSET_MIN,
): { gte: Date; lt: Date } {
  const midnightUtc =
    new Date(`${dateKey}T00:00:00.000Z`).getTime() - offsetMin * MS_PER_MINUTE;
  return { gte: new Date(midnightUtc), lt: new Date(midnightUtc + MS_PER_DAY) };
}

/** Alias for IST-specific call sites. */
export function istDayRangeUtc(dateKey: string): { gte: Date; lt: Date } {
  return dayRangeUtc(dateKey, IST_OFFSET_MIN);
}
