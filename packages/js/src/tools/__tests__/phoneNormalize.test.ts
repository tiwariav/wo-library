import {
  formatToE164,
  normalizePhoneDigits,
  phoneMatchVariants,
} from "../phoneNormalize.js";

describe("phone normalize helpers", () => {
  test("normalizePhoneDigits strips and drops trunk zero", () => {
    expect(normalizePhoneDigits(undefined)).toBeUndefined();
    expect(normalizePhoneDigits(null)).toBeNull();
    expect(normalizePhoneDigits("")).toBe("");
    expect(normalizePhoneDigits("+91 98765-43210")).toBe("919876543210");
    expect(normalizePhoneDigits("09876543210")).toBe("9876543210");
  });

  test("phoneMatchVariants does not invent a country code", () => {
    expect(phoneMatchVariants("")).toEqual([]);
    expect(normalizePhoneDigits({ weird: true })).toBe("");
    expect(new Set(phoneMatchVariants("9876543210"))).toEqual(
      new Set(["+9876543210", "09876543210", "9876543210"]),
    );
    expect(phoneMatchVariants("9876543210", "91")).toContain("+919876543210");
    expect(phoneMatchVariants("919876543210", "91")).toContain("9876543210");
  });

  test("formatToE164 guards letters and length", () => {
    expect(formatToE164("")).toBe("");
    expect(formatToE164("UNSET-abc")).toBeNull();
    expect(formatToE164("+919876543210")).toBe("+919876543210");
    expect(
      formatToE164("9876543210", { defaultCountryCallingCode: "91" }),
    ).toBe("+919876543210");
    expect(
      formatToE164("09876543210", { defaultCountryCallingCode: "91" }),
    ).toBe("+919876543210");
    expect(formatToE164("919876543210")).toBe("+919876543210");
    expect(formatToE164("12345")).toBe("12345");
    expect(formatToE164(`+${"1".repeat(16)}`)).toBeNull();
    expect(formatToE164("1".repeat(16))).toBeNull();
  });
});
