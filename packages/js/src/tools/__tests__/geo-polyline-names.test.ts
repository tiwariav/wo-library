import { bearingDegrees, metresBetween, metresBetweenPoints } from "../geo.js";
import { normalisedName, normalisedNameSql, uniqueName } from "../names.js";
import { decodePolyline, encodePolyline } from "../polyline.js";
import { nameOverlap, normalizeCode } from "../textMatch.js";
import { inTimeWindow, minutesOfDay, timeWindowActive } from "../timeWindow.js";
import { numberToWords } from "../numberToWords.js";
import { formatCurrency, formatWhen, intlLocaleFor } from "../format.js";

describe("geo and polyline", () => {
  test("metresBetween is symmetric and zero for same point", () => {
    expect(metresBetween({ lat: 0, lng: 0 }, { lat: 0, lng: 0 })).toBe(0);
    const a = metresBetween(
      { lat: 28.61, lng: 77.2 },
      { lat: 28.62, lng: 77.21 },
    );
    const b = metresBetweenPoints(
      { lat: 28.62, lng: 77.21 },
      { lat: 28.61, lng: 77.2 },
    );
    expect(a).toBeCloseTo(b, 5);
    expect(a).toBeGreaterThan(1000);
    expect(bearingDegrees({ lat: 0, lng: 0 }, { lat: 0, lng: 1 })).toBeCloseTo(
      90,
      0,
    );
  });

  test("polyline round-trip", () => {
    const points = [
      { lat: 38.5, lng: -120.2 },
      { lat: 40.7, lng: -120.95 },
      { lat: 43.252, lng: -126.453 },
    ];
    const encoded = encodePolyline(points);
    const decoded = decodePolyline(encoded);
    expect(decoded).toHaveLength(3);
    expect(decoded[0]?.lat).toBeCloseTo(38.5, 4);
  });
});

describe("names textMatch timeWindow format", () => {
  test("names", () => {
    expect(normalisedName("  Foo   Bar ")).toBe("foo bar");
    expect(normalisedNameSql("name")).toContain("btrim(name)");
    expect(uniqueName("Alpha", ["Alpha", "Alpha (2)"])).toBe("Alpha (3)");
  });

  test("textMatch and timeWindow", () => {
    expect(normalizeCode("BP-102 ")).toBe("bp102");
    expect(nameOverlap("John Smith", "Smith John")).toBe(1);
    expect(nameOverlap("", "x")).toBe(0);
    expect(minutesOfDay("20:30")).toBe(1230);
    expect(minutesOfDay("25:00")).toBeNull();
    expect(timeWindowActive({ from: "20:00", to: "06:00" })).toBe(true);
    const evening = new Date("2026-11-17T21:00:00");
    expect(inTimeWindow(evening, { from: "20:00", to: "06:00" })).toBe(true);
    expect(inTimeWindow(evening, { from: "08:00", to: "14:00" })).toBe(false);
    expect(inTimeWindow(null, { from: "08:00", to: "14:00" })).toBe(false);
    expect(inTimeWindow(evening, { from: null, to: "14:00" })).toBe(true);
  });

  test("format and numberToWords", () => {
    expect(intlLocaleFor("hi")).toBe("hi-IN");
    expect(formatCurrency(1500)).toContain("1,500");
    expect(numberToWords(0)).toBe("Zero");
    expect(numberToWords(150_000)).toMatch(/Lakh/i);
    const now = new Date("2026-11-17T12:00:00Z");
    expect(formatWhen(now, { locale: "en", now })).toMatch(/now/i);
  });
});
