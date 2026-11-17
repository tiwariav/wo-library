import * as nodeExports from "../../index.js";

describe("@wo-library/node", () => {
  test("package entry loads", () => {
    expect(nodeExports).toBeTypeOf("object");
  });
});
