import { jest } from "@jest/globals";
import * as rootExports from "../../index.js";
import { INPUT_DEBOUNCE } from "../constants/index.js";
import {
  addOrUpdate,
  describeArc,
  formatNumber,
  formatNumberWithSuffix,
  getNestedValue,
  hexToRgb,
  inSubArray,
  isEmpty,
  ordinalNumber,
  plularize,
  polarToCartesian,
  posixPath,
  pushOrCreate,
  randomGradientGenerator,
  range,
  rgbToHex,
  stringToNumber,
  wait,
} from "../index.js";

describe("constants", () => {
  test("root index exports tools", () => {
    expect(typeof rootExports.formatNumber).toBe("function");
  });

  test("exports INPUT_DEBOUNCE", () => {
    expect(INPUT_DEBOUNCE).toBe(500);
  });
});

describe("array tools", () => {
  test("range creates inclusive sequence", () => {
    expect(range(1, 5, 2)).toEqual([1, 3, 5]);
  });

  test("addOrUpdate adds and updates items immutably", () => {
    const data = [{ id: 1, value: "one" }];
    const added = addOrUpdate(data, { id: 2, value: "two" }, "id");
    expect(added).toEqual([
      { id: 1, value: "one" },
      { id: 2, value: "two" },
    ]);

    const updated = addOrUpdate(added, { id: 2, value: "second" }, "id");
    expect(updated).toEqual([
      { id: 1, value: "one" },
      { id: 2, value: "second" },
    ]);
    expect(data).toEqual([{ id: 1, value: "one" }]);
  });
});

describe("color tools", () => {
  test("rgbToHex and hexToRgb convert both ways", () => {
    expect(rgbToHex(255, 87, 51)).toBe("#ff5733");

    expect(hexToRgb("#ff5733")).toEqual({ b: 51, g: 87, r: 255 });

    expect(hexToRgb("#fff")).toEqual({ b: 255, g: 255, r: 255 });
    expect(hexToRgb("invalid")).toBeNull();
  });

  test("randomGradientGenerator produces deterministic shape", () => {
    // colors.ts always calls getRandomValues with a Uint32Array(1);
    // setting element to UINT32_MAX makes getRandomValue() return 1,
    // so angle = Math.round(1 * 360) = 360.
    const UINT32_MAX = 0xff_ff_ff_ff;
    const getRandomValuesSpy = jest
      .spyOn(globalThis.crypto, "getRandomValues")
      .mockImplementation(<T extends ArrayBufferView | null>(array: T) => {
        (array as unknown as Uint32Array)[0] = UINT32_MAX;
        return array;
      });

    const output = randomGradientGenerator(60);

    expect(output).toContain("linear-gradient(360deg");
    expect(output).toContain("/ 60%)");

    getRandomValuesSpy.mockRestore();
  });

  test("randomGradientGenerator uses default opacity when undefined", () => {
    // Any non-zero value suffices here; we only verify the default opacity (100).
    const getRandomValuesSpy = jest
      .spyOn(globalThis.crypto, "getRandomValues")
      .mockImplementation(<T extends ArrayBufferView | null>(array: T) => {
        (array as unknown as Uint32Array)[0] = 1;
        return array;
      });

    const output = randomGradientGenerator(undefined as unknown as number);

    expect(output).toContain("/ 100%)");
    getRandomValuesSpy.mockRestore();
  });
});

describe("language and misc tools", () => {
  test("plularize handles singular, suffix plural, and custom plural", () => {
    expect(plularize("apple", 1, { plural: "", pluralSuffix: "s" })).toBe(
      "apple",
    );
    expect(plularize("apple", 2, { plural: "", pluralSuffix: "s" })).toBe(
      "apples",
    );
    expect(
      plularize("child", 2, { plural: "children", pluralSuffix: "s" }),
    ).toBe("children");
  });

  test("wait resolves after timeout", async () => {
    jest.useFakeTimers();
    const resolved = jest.fn();

    const promise = wait(50).then(resolved);

    jest.advanceTimersByTime(49);
    await Promise.resolve();
    expect(resolved).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    await promise;
    expect(resolved).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });
});

describe("object tools", () => {
  test("pushOrCreate handles create, append, and indexed replace", () => {
    const data = { fruits: ["apple"] };
    expect(pushOrCreate({ data, key: "veggies", value: "carrot" })).toEqual([
      "carrot",
    ]);
    expect(pushOrCreate({ data, key: "fruits", value: "banana" })).toEqual([
      "apple",
      "banana",
    ]);
    expect(
      pushOrCreate({
        data: { fruits: ["apple", "banana"] },
        index: 1,
        key: "fruits",
        value: "mango",
      }),
    ).toEqual(["apple", "mango"]);
  });

  test("getNestedValue returns direct key and recursive values", () => {
    const source = {
      city: "Mumbai",
      label: "name",
      nested: {
        city: "Delhi",
        deep: { city: "Pune" },
      },
    };

    expect(getNestedValue<string>(source, "label")).toBe("name");
    expect(getNestedValue<string>(source, "city")).toBe("Mumbai");
    expect(getNestedValue<string>({ nested: source.nested }, "city")).toEqual([
      "Delhi",
    ]);
    expect(
      getNestedValue<string>({ nested: { deep: { city: "Pune" } } }, "city"),
    ).toEqual(["Pune"]);
    expect(getNestedValue<string>({ nested: 1 }, "city")).toEqual([]);
  });
});

describe("path and svg tools", () => {
  test("posixPath replaces backslashes", () => {
    expect(posixPath(String.raw`a\b\c`)).toBe("a/b/c");
  });

  test("polarToCartesian converts angle from top-origin", () => {
    const point = polarToCartesian({ x: 50, y: 50 }, 40, 0);

    expect(point.x).toBeCloseTo(50);

    expect(point.y).toBeCloseTo(10);
  });

  test("describeArc includes expected flags for small and large arcs", () => {
    const smallArc = describeArc(10, { end: 90, start: 0 }, { x: 0, y: 0 });

    const largeArc = describeArc(10, { end: 270, start: 0 }, { x: 0, y: 0 });

    expect(smallArc).toContain("A 10 10 0 0 0");
    expect(largeArc).toContain("A 10 10 0 1 0");
  });
});

describe("general utility and number helpers", () => {
  test("isEmpty and inSubArray behave correctly", () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
    expect(isEmpty("")).toBe(true);
    expect(isEmpty(0)).toBe(false);

    const sizes = ["sm", "md", "lg"] as const;
    expect(inSubArray<(typeof sizes)[number]>(sizes, "md")).toBe("md");
    expect(inSubArray<(typeof sizes)[number]>(sizes, "xl")).toBe(undefined);
  });

  test("stringToNumber parses values and falls back to nanValue", () => {
    expect(stringToNumber(42)).toBe(42);

    expect(stringToNumber("1,234.56")).toBe(1234.56);
    expect(stringToNumber("abc", 0)).toBe(0);

    expect(stringToNumber(undefined as unknown as string, 7)).toBe(7);
  });

  test("formatNumber keeps one decimal for trailing dot values", () => {
    expect(formatNumber("1.")).toBe("1.00");
  });

  test("ordinalNumber formats cardinal forms", () => {
    expect(ordinalNumber(1)).toBe("1st");
    expect(ordinalNumber(2)).toBe("2nd");

    expect(ordinalNumber(3)).toBe("3rd");

    expect(ordinalNumber(4)).toBe("4th");
    expect(ordinalNumber("x" as unknown as number)).toBe("x");
  });

  test("formatNumber and formatNumberWithSuffix are exported and callable", () => {
    expect(formatNumber(1234)).toBe("1,234.00");

    expect(formatNumberWithSuffix(100_000)).toBe("1.00 L");
  });
});
