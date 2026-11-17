import { getFlagEmoji } from "../phone.js";

describe("getFlagEmoji", () => {
  test("returns regional-indicator emoji for country codes", () => {
    expect(getFlagEmoji("IN")).toBe("🇮🇳");
    expect(getFlagEmoji("US")).toBe("🇺🇸");
  });
});
