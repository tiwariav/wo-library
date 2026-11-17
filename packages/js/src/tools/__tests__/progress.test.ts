import {
  getArcSegmentAngles,
  getCircleStyles,
  getProgressClass,
  getProgressTextContent,
  MAX_PROGRESS,
} from "../progress.js";

describe("getProgressClass", () => {
  test("maps percentage ranges", () => {
    expect(getProgressClass(0)).toBe("progressNone");
    expect(getProgressClass(50)).toBe("progressPartial");
    expect(getProgressClass(100)).toBe("progressFull");
  });
});

describe("getCircleStyles", () => {
  test("returns stroke dash values", () => {
    const styles = getCircleStyles(10, 0, 50);
    expect(styles.strokeDasharray).toBeCloseTo(2 * 10 * Math.PI);
    expect(typeof styles.strokeDashoffset).toBe("number");
  });

  test("uses default rotation and completion", () => {
    const styles = getCircleStyles(10);
    expect(styles.strokeDasharray).toBeCloseTo(2 * 10 * Math.PI);
  });
});

describe("getProgressTextContent", () => {
  test("formats label modes", () => {
    expect(getProgressTextContent("parts", [1, 2], 50)).toBe("0.5");
    expect(getProgressTextContent("percent", [1, 2], 50)).toBe("50%");
    expect(getProgressTextContent("value", [3, 4], 75)).toBe("3");
    expect(getProgressTextContent("of 4", [3, 4], 75)).toBe("3 of 4");
  });
});

describe("getArcSegmentAngles", () => {
  test("splits the arc into segments", () => {
    const angles = getArcSegmentAngles(2);
    expect(angles).toHaveLength(2);
    expect(angles[0]?.[0]).toBe(-90);
    expect(angles[1]?.[1]).toBe(-90 + 180);
    expect(MAX_PROGRESS).toBe(100);
  });

  test("honours a custom slice gap", () => {
    const angles = getArcSegmentAngles(2, 0);
    expect(angles[0]?.[1]).toBe(0);
  });
});
