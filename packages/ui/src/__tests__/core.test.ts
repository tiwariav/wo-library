import { BREAKPOINTS } from "../styles/media.js";
import { SVGPathFlagData, SVGPathPinData } from "../svg/paths/index.js";

describe("ui non-UI exports", () => {
  test("exports BREAKPOINTS and svg path constants", () => {
    expect(BREAKPOINTS).toEqual({
      xs: 360,
      sm: 600,
      md: 960,
      lg: 1200,
      xl: 1440,
      xxl: 1920,
    });
    expect(typeof SVGPathFlagData.d).toBe("string");
    expect(typeof SVGPathPinData.d).toBe("string");
    expect(typeof SVGPathPinData.transform).toBe("string");
  });

  test("BREAKPOINTS values are ordered and numeric", () => {
    expect(BREAKPOINTS).toEqual({
      xs: 360,
      sm: 600,
      md: 960,
      lg: 1200,
      xl: 1440,
      xxl: 1920,
    });
  });
});
