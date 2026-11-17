/* eslint-disable @typescript-eslint/no-unnecessary-condition -- navigator/clipboard vary by environment */

/** Subset of the async clipboard API used by the text helper. */
export interface ClipboardLike {
  writeText: (text: string) => Promise<void>;
}

/**
 * Copies text to the clipboard. Rejects when the browser refuses permission.
 * Falls back to a hidden textarea + `document.execCommand("copy")` when the
 * async API is missing. Pass `clipboard` to inject a fake in tests.
 */
export async function copyToClipboard(
  text: string,
  clipboard?: ClipboardLike | null,
): Promise<void> {
  if (clipboard) {
    await clipboard.writeText(text);
    return;
  }
  const browserClipboard = globalThis.navigator?.clipboard;
  if (browserClipboard?.writeText) {
    await browserClipboard.writeText(text);
    return;
  }
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.append(area);
  try {
    area.select();
    // Legacy fallback for insecure contexts / older WebViews.
    // eslint-disable-next-line @typescript-eslint/no-deprecated, sonarjs/deprecation -- intentional fallback
    if (!document.execCommand("copy")) {
      throw new Error("Copy was refused");
    }
  } finally {
    area.remove();
  }
}

/** Subset of the async clipboard API used for image writes. */
export interface ImageClipboardLike {
  write: (items: ClipboardItem[]) => Promise<void>;
}

/**
 * Copies a PNG blob to the clipboard. Rejects when `ClipboardItem` or
 * `clipboard.write` is unavailable.
 */
export async function copyImageToClipboard(
  png: Blob,
  clipboard: ImageClipboardLike | null | undefined = globalThis.navigator
    ?.clipboard,
): Promise<void> {
  if (typeof ClipboardItem === "undefined" || !clipboard?.write) {
    throw new Error("This browser cannot copy images to the clipboard.");
  }
  const pngType = "image/png";
  await clipboard.write([new ClipboardItem({ [pngType]: png })]);
}
