import { copyImageToClipboard, copyToClipboard } from "../clipboard.js";

describe("clipboard helpers", () => {
  test("copyToClipboard uses injected clipboard", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    await copyToClipboard("hello", { writeText });
    expect(writeText).toHaveBeenCalledWith("hello");
  });

  test("copyToClipboard uses navigator.clipboard when present", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    await copyToClipboard("hi");
    expect(writeText).toHaveBeenCalledWith("hi");
    vi.unstubAllGlobals();
  });

  test("copyToClipboard falls back to textarea copy", async () => {
    vi.stubGlobal("navigator", {});
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: vi.fn().mockReturnValue(true),
      writable: true,
    });
    await copyToClipboard("fallback");
    expect(document.execCommand).toHaveBeenCalledWith("copy");
    vi.unstubAllGlobals();
  });

  test("copyToClipboard rejects when execCommand fails", async () => {
    vi.stubGlobal("navigator", {});
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: vi.fn().mockReturnValue(false),
      writable: true,
    });
    await expect(copyToClipboard("nope")).rejects.toThrow("Copy was refused");
    vi.unstubAllGlobals();
  });

  test("copyImageToClipboard writes a PNG ClipboardItem", async () => {
    class FakeClipboardItem {
      constructor(public items: Record<string, Blob>) {}
    }
    vi.stubGlobal("ClipboardItem", FakeClipboardItem);
    const write = vi.fn().mockResolvedValue(undefined);
    const png = new Blob(["x"], { type: "image/png" });
    await copyImageToClipboard(png, { write });
    expect(write).toHaveBeenCalledOnce();
    vi.unstubAllGlobals();
  });

  test("copyImageToClipboard rejects without ClipboardItem support", async () => {
    vi.stubGlobal("ClipboardItem", undefined);
    await expect(
      copyImageToClipboard(new Blob(), { write: vi.fn() }),
    ).rejects.toThrow(/cannot copy images/i);
    vi.unstubAllGlobals();
  });
});
