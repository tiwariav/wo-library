import { describe, expect, test } from "@jest/globals";

import { UploadFile, UPLOAD_FILE_STATUS } from "../uploadFile.js";

describe("UploadFile", () => {
  test("initializes with defaults", () => {
    const file = new File(["abc"], "a.txt");
    const upload = new UploadFile(file);

    expect(upload.file).toBe(file);
    expect(upload.id.startsWith("upload_file_")).toBe(true);
    expect(upload.status).toBe(UPLOAD_FILE_STATUS.new);
    expect(upload.data).toBeUndefined();
    expect(upload.type).toBeUndefined();
  });

  test("initializes with provided options", () => {
    const file = new File(["abc"], "a.txt");
    const upload = new UploadFile(file, {
      data: [{ name: "p", type: "preview", value: "1" }],
      status: "uploading",
      type: "avatar",
    });

    expect(upload.status).toBe("uploading");
    expect(upload.data?.[0]?.name).toBe("p");
    expect(upload.type).toBe("avatar");
  });
});
