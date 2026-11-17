import {
  formatCount,
  formatFractionPercent,
  formatPercent,
  formatWithUnit,
  groupIndian,
  sanitizeNumberText,
  stripGrouping,
} from "../indianNumber.js";

describe("indian number helpers", () => {
  test("stripGrouping and groupIndian round-trip plain numbers", () => {
    expect(stripGrouping("12,34,567.5")).toBe("1234567.5");
    expect(groupIndian("1234567.5")).toBe("12,34,567.5");
    expect(groupIndian("123456")).toBe("1,23,456");
    expect(groupIndian("123")).toBe("123");
    expect(groupIndian("-45.6")).toBe("-45.6");
    expect(groupIndian("-")).toBe("-");
    expect(groupIndian("")).toBe("");
  });

  test("sanitizeNumberText cleans pasted currency and grouping", () => {
    expect(sanitizeNumberText("1,23,456.50")).toBe("123456.50");
    expect(sanitizeNumberText("₹ 5000")).toBe("5000");
    expect(sanitizeNumberText("-12.3.4")).toBe("-12.34");
  });

  test("display presets use en-IN grouping", () => {
    expect(formatCount(1_234_567)).toBe("12,34,567");
    expect(formatCount(null)).toBe("—");
    expect(formatCount("not-a-number")).toBe("—");
    expect(formatWithUnit(1235)).toBe("1,235 km");
    expect(formatWithUnit(1235, { unit: false })).toBe("1,235");
    expect(formatWithUnit(12, { unit: "m³" })).toBe("12 m³");
    expect(formatWithUnit(undefined, { empty: "n/a" })).toBe("n/a");
    expect(formatPercent(42)).toBe("42%");
    expect(formatPercent("")).toBe("—");
    expect(formatFractionPercent(0.42)).toBe("42%");
    expect(formatFractionPercent(null)).toBe("—");
  });
});
