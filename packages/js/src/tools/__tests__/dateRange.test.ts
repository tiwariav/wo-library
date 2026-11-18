import {
  addDays,
  formatDateToIso,
  getDatePresetRange,
  getPresetFilenameSuffix,
  getPresetLabel,
  previousMonth,
  rollingDays,
  startOfDay,
  startOfFinancialYear,
  startOfMonth,
} from "../dateRange.js";

describe("dateRange", () => {
  // 17 Nov 2026 local
  const now = new Date(2026, 10, 17);

  test("calendar helpers", () => {
    expect(formatDateToIso(startOfDay(now))).toBe("2026-11-17");
    expect(formatDateToIso(addDays(now, -3))).toBe("2026-11-14");
    expect(formatDateToIso(startOfMonth(now))).toBe("2026-11-01");
    const prev = previousMonth(now);
    expect(formatDateToIso(prev.from)).toBe("2026-10-01");
    expect(formatDateToIso(prev.to)).toBe("2026-10-31");
    expect(formatDateToIso(startOfFinancialYear(now))).toBe("2026-04-01");
    const beforeFy = new Date(2026, 2, 1);
    expect(formatDateToIso(startOfFinancialYear(beforeFy))).toBe("2025-04-01");
  });

  test("rolling and presets", () => {
    const week = rollingDays(now, 7);
    expect(formatDateToIso(week.from)).toBe("2026-11-11");
    expect(formatDateToIso(week.to)).toBe("2026-11-17");
    expect(getDatePresetRange("last7", now)).toEqual({
      from: "2026-11-11",
      to: "2026-11-17",
    });
    expect(getDatePresetRange("thisYear", now).from).toBe("2026-01-01");
    expect(getPresetLabel("last30")).toBe("Last 30 Days");
    expect(getPresetFilenameSuffix("last90")).toBe("last-90-days");
  });
});
