import { BREAKPOINTS } from "../styles/media.js";
import { svgPathFlagData, svgPathPinData } from "../svg/paths/index.js";

describe("ui non-UI exports", () => {
  test("exports BREAKPOINTS and svg path constants", () => {
    expect(BREAKPOINTS).toEqual({
      lg: 1200,
      md: 960,
      sm: 600,
      xl: 1440,
      xs: 360,
      xxl: 1920,
    });
    expect(typeof svgPathFlagData.d).toBe("string");
    expect(typeof svgPathPinData.d).toBe("string");
    expect(typeof svgPathPinData.transform).toBe("string");
  });

  test("BREAKPOINTS values are ordered and numeric", () => {
    expect(BREAKPOINTS).toEqual({
      lg: 1200,
      md: 960,
      sm: 600,
      xl: 1440,
      xs: 360,
      xxl: 1920,
    });
  });
});
