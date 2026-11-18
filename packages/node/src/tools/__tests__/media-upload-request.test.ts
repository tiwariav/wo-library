import {
  isConvertibleImageKey,
  isThumbKey,
  stemFromKey,
  thumbKeyFromCanonicalKey,
  toWebpKey,
} from "../mediaImage.js";
import {
  getCleanBody,
  getParam,
  getQueryEnum,
  getQueryString,
  getQueryStringArray,
} from "../requestParams.js";
import {
  canonicalUploadValue,
  isPublicReadableKey,
  isPublicUploadKey,
  uploadKeyFromStoredValue,
} from "../uploadKey.js";

describe("mediaImage", () => {
  test("keys", () => {
    expect(isThumbKey("a/thumb-x.webp")).toBe(true);
    expect(isThumbKey("a/plain.webp")).toBe(false);
    expect(toWebpKey("a/b.jpg")).toBe("a/b.webp");
    expect(toWebpKey("a/b.webp")).toBe("a/b.webp");
    expect(toWebpKey("noext")).toBe("noext.webp");
    expect(stemFromKey("dir/abc.jpg")).toBe("abc");
    expect(stemFromKey("alone")).toBe("alone");
    expect(thumbKeyFromCanonicalKey("dir/abc.jpg")).toBe("dir/thumb-abc.webp");
    expect(thumbKeyFromCanonicalKey("abc.jpg")).toBe("thumb-abc.webp");
    expect(thumbKeyFromCanonicalKey("")).toBeNull();
    expect(thumbKeyFromCanonicalKey("dir/thumb-abc.webp")).toBeNull();
    expect(thumbKeyFromCanonicalKey("thumb-only")).toBeNull();
    expect(isConvertibleImageKey("x.png")).toBe(true);
    expect(isConvertibleImageKey("thumb-x.png")).toBe(false);
    expect(isConvertibleImageKey("x.txt")).toBe(false);
  });
});

describe("uploadKey", () => {
  test("bare key and url parsing", () => {
    expect(uploadKeyFromStoredValue(12)).toBeNull();
    expect(uploadKeyFromStoredValue("")).toBeNull();
    expect(uploadKeyFromStoredValue("public/logo.png")).toBe("public/logo.png");
    expect(uploadKeyFromStoredValue("../escape")).toBeNull();
    expect(isPublicUploadKey("public/x")).toBe(true);
    expect(isPublicReadableKey("public/x")).toBe(true);
    expect(isPublicReadableKey("private/x")).toBe(false);
    expect(
      uploadKeyFromStoredValue(
        "https://mybucket.s3.ap-south-1.amazonaws.com/path/file.jpg",
        { awsBucketNames: ["mybucket"] },
      ),
    ).toBe("path/file.jpg");
    expect(
      uploadKeyFromStoredValue("https://other.s3.amazonaws.com/path/file.jpg", {
        awsBucketNames: ["mybucket"],
      }),
    ).toBeNull();
    expect(
      uploadKeyFromStoredValue("https://evil.example.com/x.jpg", {
        awsBucketNames: ["mybucket"],
      }),
    ).toBeNull();
    expect(
      uploadKeyFromStoredValue("https://files.example.com/k/a.jpg", {
        publicHosts: ["files.example.com"],
      }),
    ).toBe("k/a.jpg");
    expect(
      uploadKeyFromStoredValue("http://localhost/uploads/a/b.jpg", {
        localHosts: ["localhost"],
      }),
    ).toBe("a/b.jpg");
    expect(
      uploadKeyFromStoredValue("http://localhost/other/a.jpg", {
        localHosts: ["localhost"],
      }),
    ).toBeNull();
    expect(
      uploadKeyFromStoredValue(
        "https://acct.r2.cloudflarestorage.com/bucket/dir/f.jpg",
        {
          endpointBuckets: ["bucket"],
          endpointUrl: "https://acct.r2.cloudflarestorage.com",
        },
      ),
    ).toBe("dir/f.jpg");
    expect(
      uploadKeyFromStoredValue(
        "https://acct.r2.cloudflarestorage.com/wrong/dir/f.jpg",
        {
          endpointBuckets: ["bucket"],
          endpointUrl: "https://acct.r2.cloudflarestorage.com",
        },
      ),
    ).toBeNull();
    expect(
      uploadKeyFromStoredValue(
        "https://bucket.acct.r2.cloudflarestorage.com/dir/f.jpg",
        {
          endpointBuckets: ["bucket"],
          endpointUrl: "https://acct.r2.cloudflarestorage.com",
        },
      ),
    ).toBe("dir/f.jpg");
    expect(uploadKeyFromStoredValue("https://[")).toBeNull();
    expect(uploadKeyFromStoredValue("not a url%2e%2e")).toBeNull();
    expect(canonicalUploadValue("https://cdn.example.com/k.jpg?sig=1#h")).toBe(
      "https://cdn.example.com/k.jpg",
    );
    expect(canonicalUploadValue("bare-key")).toBe("bare-key");
    expect(canonicalUploadValue("https://[")).toBe("https://[");
    expect(
      uploadKeyFromStoredValue("https://acct.example.com/bucket/k.jpg", {
        endpointBuckets: [],
        endpointUrl: "https://acct.example.com",
      }),
    ).toBeNull();
    expect(
      uploadKeyFromStoredValue("https://files.example.com/%2e%2e/x.jpg", {
        publicHosts: ["files.example.com"],
      }),
    ).toBeNull();
    expect(
      uploadKeyFromStoredValue(
        `https://mybucket.s3.amazonaws.com/${"a".repeat(2100)}`,
        { awsBucketNames: ["mybucket"] },
      ),
    ).toBeNull();
  });
});

describe("requestParams", () => {
  test("param query body", () => {
    expect(getParam({ id: "abc" }, "id")).toBe("abc");
    expect(getParam({ id: ["a", "b"] }, "id")).toBe("a");
    expect(getParam({ id: [1] }, "id")).toBe("");
    expect(getParam({}, "id")).toBe("");
    expect(getQueryString({ q: "x" }, "q")).toBe("x");
    expect(getQueryString({}, "q")).toBeUndefined();
    expect(getQueryStringArray({ tag: "solo" }, "tag")).toEqual(["solo"]);
    expect(getQueryStringArray({ tag: ["a", "b"] }, "tag")).toEqual(["a", "b"]);
    expect(getQueryStringArray({ tag: [1, "b"] }, "tag")).toEqual(["b"]);
    expect(getQueryStringArray({}, "tag")).toEqual([]);
    expect(getQueryEnum({ mode: "on" }, "mode", ["on", "off"] as const)).toBe(
      "on",
    );
    expect(
      getQueryEnum({ mode: "nope" }, "mode", ["on"] as const),
    ).toBeUndefined();
    expect(getCleanBody(undefined)).toEqual({});
    expect(
      getCleanBody({ createdBy: "me", name: "x", updatedById: 1 }),
    ).toEqual({ name: "x" });
  });
});
