import {
  formatExactTime,
  formatRelativeTime,
  formatShortAge,
} from "../relativeTime.js";

const MINUTE_MS = 60_000;
const HOUR_MS = 3_600_000;

describe("relative time helpers", () => {
  const now = new Date("2026-11-17T12:00:00.000Z");
  const nowMs = now.getTime();

  test("formatRelativeTime covers past and near-now", () => {
    const fiveMinutesAgo = new Date(nowMs - 5 * MINUTE_MS);
    const twoHoursAgo = new Date(nowMs - 2 * HOUR_MS);
    const ninetySecondsLater = new Date(nowMs + 90_000);

    expect(formatRelativeTime(fiveMinutesAgo, now, "en")).toMatch(
      /5 minutes? ago/,
    );
    expect(formatRelativeTime(twoHoursAgo, now, "en")).toMatch(/2 hours? ago/);
    expect(formatRelativeTime(ninetySecondsLater, now, "en")).toMatch(
      /in 2 minutes?|2 minutes? from now/i,
    );
    expect(formatRelativeTime(now, now, "en")).toMatch(/now/i);
    expect(formatRelativeTime("not-a-date", now)).toBe("");
  });

  test("formatShortAge uses injected clock", () => {
    const twelveMinutesAgo = new Date(nowMs - 12 * MINUTE_MS);
    const threeHoursAgo = new Date(nowMs - 3 * HOUR_MS);
    const fiftyHoursAgo = new Date(nowMs - 50 * HOUR_MS);
    const oneMinuteLater = new Date(nowMs + MINUTE_MS);

    expect(formatShortAge(now, now)).toBe("just now");
    expect(formatShortAge(twelveMinutesAgo, now)).toBe("12 min ago");
    expect(formatShortAge(threeHoursAgo, now)).toBe("3 h ago");
    expect(formatShortAge(fiftyHoursAgo, now)).toBe("2 d ago");
    expect(formatShortAge(oneMinuteLater, now)).toBe("just now");
  });

  test("formatExactTime formats in the given time zone", () => {
    const text = formatExactTime("2026-10-20T10:12:00.000Z", {
      locale: "en-IN",
      timeZone: "UTC",
    });
    expect(text).toContain("2026");
    expect(text).toMatch(/Oct/);
  });
});
