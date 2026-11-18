import * as nodeExports from "../../index.js";

describe("@wo-library/node", () => {
  test("package entry exports limiters and idempotency helpers", () => {
    expect(typeof nodeExports.RateLimiter).toBe("function");
    expect(typeof nodeExports.parseIdempotencyKey).toBe("function");
    expect(typeof nodeExports.hashRequest).toBe("function");
  });
});
