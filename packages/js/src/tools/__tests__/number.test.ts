import type { FormatNumberSuffixOptions } from "../number.js";

import {
  formatNumber,
  formatNumberWhileTyping,
  formatNumberWithSuffix,
  parseFormattedNumber,
} from "../number.js";

type TestData = [[string, FormatNumberSuffixOptions?], string | undefined][];

const SOME_STRING = "some string";
const NON_NUMBERS: TestData = [
  [[SOME_STRING], ""],
  [[SOME_STRING, { nullValue: "xx" }], "xx"],
  [[""], ""],
];

function expectResult(tests: TestData, withSuffix?: boolean) {
  for (const item of tests) {
    const format = withSuffix ? formatNumberWithSuffix : formatNumber;
    const output = format(item[0][0], item[0][1]);
    expect(output).toBe(item[1]);
  }
}

const DECIMAL_NUMBER = 85_752.3848233;

describe("format number options", () => {
  test("max fraction digit 0", () => {
    // max fration digits should not be less than min fraction digits
    const output = formatNumber(DECIMAL_NUMBER, { maximumFractionDigits: 0 });
    expect(output).toBe("85,752");
  });

  test("fraction digits 0", () => {
    const output = formatNumber(DECIMAL_NUMBER, {
      fractionDigits: 0,
    });
    expect(output).toBe("85,752");
  });

  test("should return null-value for non-numbers", () => {
    expectResult(NON_NUMBERS);
  });

  test("should return correct number of decimals", () => {
    const tests: TestData = [
      [["1"], "1.00"],
      [["-1"], "-1.00"],
      [["1.001"], "1.00"],
      [["1", { fractionDigits: 1 }], "1.0"],
      [["1", { minimumFractionDigits: 0 }], "1"],
    ];
    expectResult(tests);
  });

  test("should round off correctly", () => {
    const tests: TestData = [
      [["1.006"], "1.01"],
      [["1.005"], "1.01"],
      [["1.004"], "1.00"],
    ];
    expectResult(tests);
  });
});

describe("format number", () => {
  test("should format correctly", () => {
    const tests: TestData = [
      [["0"], "0.00"],
      [["-0.002"], "-0.00"],
      [["-0.05"], "-0.05"],
      [["-0.055"], "-0.06"],
      [["0.05"], "0.05"],
      [["0.055"], "0.06"],
      [["1"], "1.00"],
      [["10"], "10.00"],
      [["100"], "100.00"],
      [["1000"], "1,000.00"],
      [["10000"], "10,000.00"],
      [["100000"], "1,00,000.00"],
      [["1000000"], "10,00,000.00"],
      [["10000000"], "1,00,00,000.00"],
      [["100000000"], "10,00,00,000.00"],
      [["1000000000"], "1,00,00,00,000.00"],
      [["10000000000"], "10,00,00,00,000.00"],
    ];
    expectResult(tests);
  });
});

describe("format number with suffix", () => {
  test("should return null-value for non-numbers", () => {
    expectResult(NON_NUMBERS, true);
  });

  test("should format correctly", () => {
    const tests: TestData = [
      [["1"], "1.00"],
      [["10"], "10.00"],
      [["100"], "100.00"],
      [["1000"], "1.00 K"],
      [["10000"], "10.00 K"],
      [["100", { suffix: "K" }], "0.10 K"],
      [["1000000", { suffix: "K" }], "1,000.00 K"],
      [["100000"], "1.00 L"],
      [["1000000"], "10.00 L"],
      [["1000", { suffix: "L" }], "0.01 L"],
      [["100000000", { suffix: "L" }], "1,000.00 L"],
      [["10000000"], "1.00 Cr"],
      [["100000000"], "10.00 Cr"],
      [["1000000000"], "100.00 Cr"],
      [["10000000000"], "1,000.00 Cr"],
      [["10000000000", { suffix: "Cr" }], "1,000.00 Cr"],
      [["10000", { fractionDigits: 3, suffix: "Cr" }], "0.001 Cr"],
    ];
    expectResult(tests, true);
  });
});

describe("formatNumberWhileTyping", () => {
  test("returns value unchanged when format is false", () => {
    expect(formatNumberWhileTyping("1234", false)).toEqual({
      display: "1234",
      raw: "1234",
    });
  });

  test("keeps trailing decimal and minus while typing", () => {
    expect(formatNumberWhileTyping("12.", true).display).toBe("12.");
    expect(formatNumberWhileTyping("-", true).display).toBe("-");
  });

  test("formats with en-IN grouping", () => {
    const result = formatNumberWhileTyping("1234567", {
      fractionDigits: 0,
      maximumFractionDigits: 0,
    });
    expect(result.display).toBe("12,34,567");
  });

  test("truncates raw when input exceeds max fraction digits", () => {
    const result = formatNumberWhileTyping("1.2345", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
    expect(result.display).toBe("1.23");
    expect(result.raw).toBe("1.23");
  });

  test("truncates to an integer display when max fraction digits is 0", () => {
    const result = formatNumberWhileTyping("1.9", {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    });
    expect(result.display.includes(".")).toBe(false);
    expect(result.raw.endsWith(".")).toBe(true);
  });

  test("formats with boolean true defaults", () => {
    const result = formatNumberWhileTyping("1000", true);
    expect(result.display).toContain("1,000");
  });

  test("uses empty nullValue when value is empty after format path", () => {
    // empty string short-circuits before formatNumber via endsWith check? ""
    // does not end with "." and is not "-"; formatNumber("") returns nullValue "".
    expect(formatNumberWhileTyping("", true)).toEqual({
      display: "",
      raw: "",
    });
  });
});

describe("parseFormattedNumber", () => {
  test("parses formatted display back to a number when parse is true", () => {
    expect(
      parseFormattedNumber({
        emptyValue: "",
        format: true,
        formattedValue: "1,234.50",
        parse: true,
        textValue: "1234.50",
      }),
    ).toBe(1234.5);
  });

  test("returns emptyValue when text is empty", () => {
    expect(
      parseFormattedNumber({
        emptyValue: null,
        format: true,
        formattedValue: "",
        parse: true,
        textValue: "",
      }),
    ).toBeNull();
  });

  test("returns textValue when format is false", () => {
    expect(
      parseFormattedNumber({
        emptyValue: "",
        format: false,
        formattedValue: "1,234",
        parse: false,
        textValue: "1234",
      }),
    ).toBe("1234");
  });

  test("stringifies when parse is false and value is present", () => {
    expect(
      parseFormattedNumber({
        emptyValue: "",
        format: true,
        formattedValue: "1,234",
        parse: false,
        textValue: "1234",
      }),
    ).toBe("1234");
  });
});
