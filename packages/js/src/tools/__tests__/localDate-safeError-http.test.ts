import {
  dayRangeUtc,
  istDayRangeUtc,
  IST_OFFSET_MIN,
  toLocalDateKey,
  toLocalMonthKey,
  wallClockOf,
} from "../localDate.js";
import { safeErrSerializer, safeError, safeUrl } from "../safeError.js";
import {
  AppError,
  BadRequestError,
  ConflictError,
  errorExtras,
  ForbiddenError,
  isHttpError,
  NotFoundError,
  UnauthorizedError,
  UnsupportedMediaTypeError,
} from "../httpErrors.js";

describe("localDate", () => {
  test("keys and ranges", () => {
    const d = new Date(2026, 10, 17, 15, 30);
    expect(toLocalDateKey(d)).toBe("2026-11-17");
    expect(toLocalMonthKey(d)).toBe("2026-11");
    expect(IST_OFFSET_MIN).toBe(330);
    const wall = wallClockOf(new Date("2026-11-17T00:00:00.000Z"));
    expect(wall.dateKey).toBe("2026-11-17");
    expect(wall.hour).toBe(5);
    expect(wall.minute).toBe(30);
    const range = istDayRangeUtc("2026-11-17");
    expect(range.lt.getTime() - range.gte.getTime()).toBe(86_400_000);
    expect(dayRangeUtc("2026-11-17", 0).gte.toISOString()).toContain(
      "2026-11-17",
    );
  });
});

describe("safeError", () => {
  test("shapes and urls", () => {
    expect(safeError(new Error("boom"))).toEqual({
      code: undefined,
      message: "boom",
      name: "Error",
      status: undefined,
    });
    expect(safeError("x").message).toBe("x");
    const httpErr = Object.assign(new Error("fail"), {
      code: "ECONNRESET",
      config: { method: "get", url: "https://user:pass@example.com/a?q=1#h" },
      response: { status: 503 },
    });
    expect(safeError(httpErr).status).toBe(503);
    expect(safeUrl("https://user:pass@example.com/a?q=1#h")).toBe(
      "https://example.com/a",
    );
    expect(safeUrl("/relative/path")).toBe("/relative/path");
    expect(safeUrl("ftp://example.com/x")).toBe("[unparseable url]");
    expect(safeUrl("https://[")).toBe("[unparseable url]");
    expect(safeErrSerializer(null)).toEqual({
      message: "null",
      type: "Error",
    });
    expect(safeErrSerializer(12).message).toBe("12");
    const nested = safeErrSerializer({
      cause: { message: "inner", name: "Error" },
      code: 42,
      config: { method: "post", url: "https://example.com/x" },
      errors: [{ message: "a" }],
      message: "many",
      name: "AggregateError",
      response: { status: 400 },
      stack: "trace",
    });
    expect(nested.status).toBe(400);
    expect(nested.stack).toBe("trace");
    expect(nested.code).toBe(42);
    expect(nested.method).toBe("POST");
    expect(nested.url).toBe("https://example.com/x");
    expect(nested.cause).toMatchObject({ message: "inner" });
  });
});

describe("httpErrors", () => {
  test("classes and guards", () => {
    expect(new NotFoundError().statusCode).toBe(404);
    expect(new BadRequestError().statusCode).toBe(400);
    expect(new UnauthorizedError().statusCode).toBe(401);
    expect(new ForbiddenError().statusCode).toBe(403);
    expect(new ConflictError().statusCode).toBe(409);
    expect(new UnsupportedMediaTypeError().statusCode).toBe(415);
    const err = new AppError("x", 422);
    err.code = "X";
    err.body = { id: 1 };
    expect(errorExtras(err)).toEqual({ code: "X", id: 1 });
    expect(errorExtras(new Error("no"))).toEqual({});
    expect(isHttpError(err)).toBe(true);
    expect(isHttpError(null)).toBe(false);
  });
});
