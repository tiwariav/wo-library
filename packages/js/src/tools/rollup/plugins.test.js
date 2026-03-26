import { skipOutput } from "./plugins.js";

describe("skipOutput plugin", () => {
  it("should remove .js files from the bundle", () => {
    const plugin = skipOutput();
    const bundle = {
      "file1.js": { type: "chunk" },
      "file2.css": { type: "asset" },
      "file3.js.map": { type: "asset" },
      "folder/file4.js": { type: "chunk" },
    };

    plugin.generateBundle({}, bundle);

    expect(bundle).toEqual({
      "file2.css": { type: "asset" },
      "file3.js.map": { type: "asset" },
    });
  });

  it("should have the correct name", () => {
    const plugin = skipOutput();
    expect(plugin.name).toBe("wo-library/skip-output");
  });
});
