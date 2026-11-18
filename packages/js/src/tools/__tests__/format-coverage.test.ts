import {
  dateLocaleFor,
  formatClock,
  formatCurrency,
  formatDay,
  formatDayTime,
  formatPlainNumber,
  formatRupees,
  formatWhen,
  intlLocaleFor,
} from "../format.js";
import {
  getDatePresetRange,
  getPresetFilenameSuffix,
  getPresetLabel,
} from "../dateRange.js";
import { numberToWords } from "../numberToWords.js";
import { uniqueName } from "../names.js";
import { inTimeWindow, minutesOfDay } from "../timeWindow.js";
import { nameOverlap, normalizeCode } from "../textMatch.js";

describe("format coverage", () => {
  const now = new Date("2026-11-17T12:00:00.000Z");

  test("locales and empty inputs", () => {
    expect(intlLocaleFor("en")).toBe("en-IN");
    expect(intlLocaleFor("hi-Latn")).toBe("en-IN");
    expect(intlLocaleFor("mr-IN")).toBe("mr-IN");
    expect(dateLocaleFor("hi")).toBe("hi-IN-u-nu-latn");
    expect(dateLocaleFor("mr")).toBe("mr-IN-u-nu-latn");
    expect(dateLocaleFor("en")).toBe("en-IN");
    expect(formatCurrency(null)).toBe("");
    expect(formatRupees(null)).toBe("");
    expect(formatPlainNumber(null)).toBe("");
    expect(formatClock(null)).toBe("");
    expect(formatDay("not-a-date")).toBe("");
    expect(formatDayTime(undefined)).toBe("");
    expect(formatWhen(null)).toBe("");
  });

  test("clock day when variants", () => {
    expect(formatCurrency(99.5)).toMatch(/99/);
    expect(formatRupees(1500)).toMatch(/1,500/);
    expect(formatPlainNumber(1_234_567)).toMatch(/12/);
    const sample = new Date("2026-09-26T07:51:00.000Z");
    expect(formatClock(sample, "en-IN", "UTC")).toMatch(/\d/);
    expect(formatDay(sample, "en-IN", "UTC")).toContain("2026");
    expect(formatDayTime(sample, "en-IN", "UTC")).toContain(",");
    expect(formatWhen(now, { locale: "en", now })).toMatch(/now/i);

    const inTwentyMin = new Date(now.getTime() + 20 * 60_000);
    expect(formatWhen(inTwentyMin, { locale: "en", now })).toMatch(/in/i);

    const twentyMinAgo = new Date(now.getTime() - 20 * 60_000);
    expect(formatWhen(twentyMinAgo, { locale: "en", now })).toMatch(/ago/i);

    const inThreeHours = new Date(now.getTime() + 3 * 3_600_000);
    expect(
      formatWhen(inThreeHours, { locale: "en", now, timeZone: "UTC" }),
    ).toMatch(/today|tomorrow|\d/i);

    const inFiveDays = new Date(now.getTime() + 5 * 86_400_000);
    expect(
      formatWhen(inFiveDays, { locale: "en", now, timeZone: "UTC" }),
    ).toContain("2026");
  });
});

describe("remaining coverage", () => {
  test("presets words names windows", () => {
    const now = new Date(2026, 10, 17);
    expect(getDatePresetRange("last30", now).from).toBe("2026-10-19");
    expect(getDatePresetRange("last90", now).from).toBe("2026-08-20");
    expect(getPresetLabel("thisYear")).toBe("This Year");
    expect(getPresetFilenameSuffix("thisYear")).toBe("this-year");
    expect(numberToWords(-1)).toBe("");
    expect(numberToWords(1e10)).toBe("Overflow");
    expect(numberToWords(0, { zeroLabel: "Nil" })).toBe("Nil");
    expect(numberToWords(101)).toMatch(/Hundred/i);
    expect(numberToWords(10_000_000)).toMatch(/Crore/i);
    expect(numberToWords(1000)).toMatch(/Thousand/i);
    expect(numberToWords(25)).toMatch(/Twenty/i);
    expect(numberToWords(20)).toMatch(/Twenty/i);
    expect(uniqueName("Beta", [])).toBe("Beta");
    expect(uniqueName("  ", [])).toBe("Untitled");
    expect(normalizeCode(undefined)).toBe("");
    expect(nameOverlap("alpha beta", "beta")).toBe(1);
    expect(nameOverlap("a", "")).toBe(0);
    expect(minutesOfDay("7:05")).toBe(425);
    expect(inTimeWindow("bad", { from: "08:00", to: "09:00" })).toBe(false);
    const morning = new Date("2026-11-17T08:30:00");
    expect(inTimeWindow(morning, { from: "08:00", to: "14:00" })).toBe(true);
    const late = new Date("2026-11-17T02:00:00");
    expect(inTimeWindow(late, { from: "20:00", to: "06:00" })).toBe(true);
  });
});
