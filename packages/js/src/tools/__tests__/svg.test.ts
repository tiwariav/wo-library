import { describeArc, svgPathFlagData, svgPathPinData } from "../svg.js";

describe("svg path data", () => {
  test("exports pin and flag path strings", () => {
    expect(typeof svgPathFlagData.d).toBe("string");
    expect(typeof svgPathPinData.d).toBe("string");
    expect(typeof svgPathPinData.transform).toBe("string");
  });

  test("describeArc returns a path string", () => {
    const path = describeArc(40, { end: 90, start: 0 }, { x: 50, y: 50 });
    expect(path.startsWith("M ")).toBe(true);
    expect(path).toContain(" A ");
  });
});
