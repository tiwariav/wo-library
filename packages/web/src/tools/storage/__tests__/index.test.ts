import { AnyStorage } from "../index.js";

describe("AnyStorage", () => {
  describe("getJsonItem fallback", () => {
    test("returns parsed object for valid JSON", async () => {
      const storage = new AnyStorage("mobile");
      const validJson = '{"a":1}';
      const key = "test-key";

      await storage.backends.temp.setItem(key, validJson);
      const result = await storage.getItem(key, { json: true });

      expect(result).toEqual({ a: 1 });
    });

    test("returns original string when JSON.parse fails with SyntaxError", async () => {
      const storage = new AnyStorage("mobile");
      const invalidJson = "{ invalid json }";
      const key = "test-key";

      await storage.backends.temp.setItem(key, invalidJson);
      const result = await storage.getItem(key, { json: true });

      expect(result).toBe(invalidJson);
    });

    test("rethrows non-SyntaxError from JSON.parse", async () => {
      const storage = new AnyStorage("mobile");
      const key = "test-key";
      await storage.backends.temp.setItem(key, "some-value");

      const originalParse = JSON.parse;
      const customError = new Error("Custom error");
      JSON.parse = () => {
        throw customError;
      };

      try {
        await expect(storage.getItem(key, { json: true })).rejects.toThrow(
          "Custom error",
        );
      } finally {
        JSON.parse = originalParse;
      }
    });
  });
});
