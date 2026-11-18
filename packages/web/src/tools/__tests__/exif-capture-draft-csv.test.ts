import {
  buildCaptureMetadata,
  captureMetadataFields,
  classifyCaptureSource,
  looksLikeImageUrl,
  partitionImageUrls,
} from "../captureMetadata.js";
import { exifTakenAtToIso, readExif } from "../exif.js";
import {
  changedFieldCount,
  clearDraft,
  draftKey,
  omitFields,
  readDraft,
  resetSavedGuards,
  writeDraft,
} from "../formDraft.js";
import {
  collectAllPages,
  downloadCsvFile,
  escapeCsvCell,
  neutralizeCsvFormula,
} from "../listCsv.js";
import { describeDevice, getWebPushStatus } from "../webPush.js";

describe("exif", () => {
  test("rejects non-jpeg", () => {
    expect(readExif(new ArrayBuffer(8))).toBeNull();
    expect(exifTakenAtToIso(null)).toBeUndefined();
    expect(
      exifTakenAtToIso({ offset: "+05:30", takenAt: "2026-11-17T12:00:00" }),
    ).toMatch(/2026-11-17/);
  });
});

describe("captureMetadata", () => {
  test("classify and build", () => {
    expect(
      classifyCaptureSource({
        coarsePointer: true,
        lastModified: Date.now(),
        now: Date.now(),
        via: "camera",
      }),
    ).toBe("camera");
    expect(
      classifyCaptureSource({
        coarsePointer: false,
        now: Date.now(),
        via: "camera",
      }),
    ).toBe("upload");
    const meta = buildCaptureMetadata({
      coarsePointer: true,
      exif: { latitude: 28.6, longitude: 77.2, takenAt: "2026-11-17T10:00:00" },
      lastModified: Date.now(),
      now: Date.now(),
      via: "picker",
    });
    expect(meta.locationSource).toBe("exif");
    expect(captureMetadataFields(meta).captureSource).toBeDefined();
    expect(looksLikeImageUrl("blob:x")).toBe(true);
    expect(partitionImageUrls(["a.png", "b.txt"]).images).toHaveLength(1);
  });
});

describe("formDraft and csv", () => {
  test("draft round-trip", () => {
    resetSavedGuards();
    const key = draftKey("user-1", "create");
    clearDraft(key);
    expect(readDraft(key)).toBeNull();
    writeDraft(key, { name: "Alpha" });
    expect(readDraft<{ name: string }>(key)?.values.name).toBe("Alpha");
    clearDraft(key, { afterSave: true });
    expect(omitFields({ a: 1, b: 2 }, ["b"])).toEqual({ a: 1 });
    expect(changedFieldCount({ a: "x", b: "" }, { a: "" })).toBe(1);
  });

  test("csv helpers", async () => {
    expect(escapeCsvCell("a,b")).toBe('"a,b"');
    expect(neutralizeCsvFormula("=1+1")).toBe("'=1+1");
    expect(downloadCsvFile("t.csv", ["A"], [["1"]])).toBe(true);
    const pages = await collectAllPages(
      async ({ offset }) => ({
        count: 3,
        data: offset === 0 ? [1, 2] : [3],
      }),
      2,
    );
    expect(pages).toEqual([1, 2, 3]);
  });
});

describe("webPush status", () => {
  test("unconfigured without config", () => {
    expect(getWebPushStatus(undefined).configured).toBe(false);
    expect(
      describeDevice("Mozilla/5.0 (Windows NT 10.0) Chrome/120"),
    ).toContain("Chrome");
  });
});
