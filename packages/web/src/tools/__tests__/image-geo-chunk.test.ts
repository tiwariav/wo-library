import { isChunkLoadError, reloadOnceForChunkError } from "../chunkReload.js";
import { fitWithin, shouldCompress } from "../imageCompress.js";
import {
  applyTextSizeToDom,
  normalizeTextSize,
  readStoredTextSize,
  saveTextSize,
  textSizeStorageKey,
} from "../textSize.js";

describe("imageCompress helpers", () => {
  test("fitWithin and shouldCompress", () => {
    expect(fitWithin(3200, 2400, 1600)).toEqual({ height: 1200, width: 1600 });
    expect(fitWithin(800, 600, 1600)).toEqual({ height: 600, width: 800 });
    expect(shouldCompress({ size: 100, type: "image/jpeg" })).toBe(false);
    expect(shouldCompress({ size: 500_000, type: "image/jpeg" })).toBe(true);
    expect(shouldCompress({ size: 500_000, type: "image/heic" })).toBe(true);
    expect(shouldCompress({ size: 500_000, type: "text/plain" })).toBe(false);
  });
});

describe("chunkReload and textSize", () => {
  test("isChunkLoadError", () => {
    expect(
      isChunkLoadError(
        new Error("Failed to fetch dynamically imported module"),
      ),
    ).toBe(true);
    expect(isChunkLoadError(new Error("boom"))).toBe(false);
  });

  test("reloadOnceForChunkError suppresses second call", () => {
    const assign = vi.fn();
    vi.stubGlobal("location", {
      assign,
      href: "http://localhost/app",
    });
    sessionStorage.clear();
    expect(reloadOnceForChunkError("k")).toBe(true);
    expect(reloadOnceForChunkError("k")).toBe(false);
    vi.unstubAllGlobals();
  });

  test("textSize helpers", () => {
    expect(normalizeTextSize("large")).toBe("large");
    expect(normalizeTextSize("nope")).toBe("default");
    expect(textSizeStorageKey("demo")).toBe("demo_text_size");
    const store = new Map<string, string>();
    const storage = {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
    };
    saveTextSize("compact", storage, "k");
    expect(readStoredTextSize(storage, "k")).toBe("compact");
    applyTextSizeToDom("large");
    expect(document.documentElement.dataset.textSize).toBe("large");
  });
});
