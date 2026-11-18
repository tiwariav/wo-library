/**
 * Calendar arithmetic for date-range pickers. All dates are local midnight.
 */

export interface DateRangeDates {
  from: Date;
  to: Date;
}

export interface DateRangeIso {
  from: string;
  to: string;
}

export type DatePresetId = "last7" | "last30" | "last90" | "thisYear";

/** April (0-indexed). */
const FINANCIAL_YEAR_START_MONTH = 3;
const PRESET_DAYS = { last30: 30, last7: 7, last90: 90 } as const;

/** Local midnight of `value`'s day. */
export function startOfDay(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

/** The day `days` before/after `from` (calendar arithmetic, DST-safe). */
export function addDays(from: Date, days: number): Date {
  return new Date(from.getFullYear(), from.getMonth(), from.getDate() + days);
}

/**
 * The last `count` days including `now`'s day.
 * Example: `count = 7` on the 10th is the 4th through the 10th.
 */
export function rollingDays(now: Date, count: number): DateRangeDates {
  const today = startOfDay(now);
  return { from: addDays(today, -(count - 1)), to: today };
}

export function startOfMonth(now: Date): Date {
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function lastDayOfMonth(now: Date): Date {
  return new Date(now.getFullYear(), now.getMonth() + 1, 0);
}

/** First and last day of the month before `now`'s. */
export function previousMonth(now: Date): DateRangeDates {
  const anchor = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return { from: startOfMonth(anchor), to: lastDayOfMonth(anchor) };
}

/** Start of the Indian financial year (1 April) containing `now`. */
export function startOfFinancialYear(now: Date): Date {
  const year =
    now.getMonth() >= FINANCIAL_YEAR_START_MONTH
      ? now.getFullYear()
      : now.getFullYear() - 1;
  return new Date(year, FINANCIAL_YEAR_START_MONTH, 1);
}

/** Format a local date as `YYYY-MM-DD`. */
export function formatDateToIso(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toIsoRange(range: DateRangeDates): DateRangeIso {
  return { from: formatDateToIso(range.from), to: formatDateToIso(range.to) };
}

/** Preset ISO ranges relative to `now` (defaults to today). */
export function getDatePresetRange(
  preset: DatePresetId,
  now: Date = new Date(),
): DateRangeIso {
  const today = startOfDay(now);
  switch (preset) {
    case "last7": {
      return toIsoRange(rollingDays(today, PRESET_DAYS.last7));
    }
    case "last30": {
      return toIsoRange(rollingDays(today, PRESET_DAYS.last30));
    }
    case "last90": {
      return toIsoRange(rollingDays(today, PRESET_DAYS.last90));
    }
    case "thisYear": {
      return toIsoRange({
        from: new Date(today.getFullYear(), 0, 1),
        to: today,
      });
    }
  }
}

export function getPresetLabel(preset: DatePresetId): string {
  const labels: Record<DatePresetId, string> = {
    last30: "Last 30 Days",
    last7: "Last 7 Days",
    last90: "Last 90 Days",
    thisYear: "This Year",
  };
  return labels[preset];
}

export function getPresetFilenameSuffix(preset: DatePresetId): string {
  const suffixes: Record<DatePresetId, string> = {
    last30: "last-30-days",
    last7: "last-7-days",
    last90: "last-90-days",
    thisYear: "this-year",
  };
  return suffixes[preset];
}
