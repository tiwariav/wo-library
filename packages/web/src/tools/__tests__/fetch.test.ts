import { jest } from "@jest/globals";

import { WoNetworkError, WoResponseError } from "../error/index.js";
import {
  ACCESS_TOKEN_KEY,
  CONTENT_TYPE_FORM,
  CONTENT_TYPE_HEADER,
  CONTENT_TYPE_JSON,
  HTTP_STATUS,
} from "../fetch/constants.js";
import {
  defaultErrorHandler,
  getResponseData,
} from "../fetch/errorHandlers.js";
import { WoFetchBase } from "../fetch/index.js";
import {
  jsonResponseHandler,
  textResponseHandler,
} from "../fetch/responseHandlers.js";
import {
  combineUrls,
  createUrl,
  getFetchBody,
  getFormData,
  getHeaderInstance,
  handleReadyStateChange,
} from "../fetch/utils.js";
import { anyStorageInstance } from "../storage/index.js";

class MockResponse {
  headers: Headers;
  ok: boolean;
  status: number;
  private readonly payload: unknown;

  constructor(payload: unknown, { headers = {}, status = 200 } = {}) {
    this.payload = payload;
    this.status = status;
    this.headers = new Headers(headers as HeadersInit);
    this.ok = status >= 200 && status < 300;
  }

  async json() {
    if (typeof this.payload === "string") {
      return JSON.parse(this.payload) as unknown;
    }
    return this.payload;
  }

  async text() {
    return typeof this.payload === "string"
      ? this.payload
      : JSON.stringify(this.payload);
  }
}

beforeAll(() => {
  Object.defineProperty(globalThis, "Response", {
    configurable: true,
    value: MockResponse,
    writable: true,
  });
  Object.defineProperty(globalThis, "fetch", {
    configurable: true,
    value: jest.fn(),
    writable: true,
  });
});

describe("fetch constants", () => {
  test("exports expected constants", () => {
    expect(ACCESS_TOKEN_KEY).toBe("wo:authToken");
    expect(CONTENT_TYPE_HEADER).toBe("content-type");
    expect(CONTENT_TYPE_FORM).toBe("multipart/form-data");
    expect(CONTENT_TYPE_JSON).toBe("application/json");
    expect(HTTP_STATUS.ok).toBe(200);
  });
});

describe("fetch helpers", () => {
  test("getFormData appends metadata and file", () => {
    const file = new Blob(["x"]);
    const data = getFormData(file, { a: "1" });
    expect(data.get("a")).toBe("1");
    expect(data.get("file")).toBeInstanceOf(Blob);
  });

  test("combineUrls and createUrl normalize path and query", () => {
    expect(combineUrls("https://api.example.com/", "/v1/users")).toBe(
      "https://api.example.com/v1/users",
    );

    const url = createUrl("https://api.example.com", "/v1/users", {
      id: "42",
      query: { q: "test", skip: undefined },
      trailingSlash: true,
    });

    expect(url.toString()).toBe("https://api.example.com/v1/users/42/?q=test");
  });

  test("createUrl handles absolute path and proxy stripping", () => {
    const absolute = createUrl("https://api.example.com", "https://x.dev/a");
    expect(absolute.toString()).toBe("https://x.dev/a");

    const proxied = createUrl("/api", "/proxy/users", {
      devProxy: "/proxy",
    });
    expect(proxied.toString()).toContain("/api/users");
  });

  test("getHeaderInstance returns Headers or Map", () => {
    const headers = getHeaderInstance(false, { a: "1" });
    const map = getHeaderInstance(true, { a: "1" });
    expect(headers).toBeInstanceOf(Headers);
    expect(map).toBeInstanceOf(Map);
    expect(headers.get("a")).toBe("1");
    expect(map.get("a")).toBe("1");
  });

  test("getFetchBody returns json string or form data", () => {
    const jsonHeaders = new Headers({
      [CONTENT_TYPE_HEADER]: CONTENT_TYPE_JSON,
    });
    const formHeaders = new Map([[CONTENT_TYPE_HEADER, CONTENT_TYPE_FORM]]);
    const fd = new FormData();
    fd.append("x", "1");

    expect(getFetchBody(jsonHeaders, { a: 1 })).toBe(JSON.stringify({ a: 1 }));
    expect(getFetchBody(formHeaders, fd)).toBe(fd);
    expect(getFetchBody(jsonHeaders)).toBeUndefined();
  });

  test("handleReadyStateChange resolves and rejects by status", () => {
    const onState = jest.fn();
    const reject = jest.fn();
    const resolve = jest.fn();

    const xhrObject = {
      readyState: 2,
      response: { error: true },
      status: 500,
    } as unknown as XMLHttpRequest;

    const handler = handleReadyStateChange({
      onStateChange: onState,
      reject,
      resolve,
      xhrObject,
    });
    handler.call(xhrObject, new Event("readystatechange"));
    expect(onState).toHaveBeenCalled();
    expect(reject).not.toHaveBeenCalled();
    expect(resolve).not.toHaveBeenCalled();

    (xhrObject as unknown as { readyState: number }).readyState = 4;
    handler.call(xhrObject, new Event("readystatechange"));
    expect(reject).toHaveBeenCalled();
    expect(resolve).toHaveBeenCalled();
  });
});

describe("error and response handlers", () => {
  test("getResponseData handles json, syntax error fallback, and text", async () => {
    const jsonResponse = new MockResponse(JSON.stringify({ ok: true }), {
      headers: { [CONTENT_TYPE_HEADER]: CONTENT_TYPE_JSON },
      status: 200,
    });
    await expect(
      getResponseData<{ ok: boolean }>(jsonResponse as unknown as Response),
    ).resolves.toEqual({ ok: true });

    const syntaxFallback = {
      headers: new Headers({ [CONTENT_TYPE_HEADER]: CONTENT_TYPE_JSON }),
      json: async () => {
        throw new SyntaxError("bad");
      },
      text: async () => "fallback",
    } as unknown as Response;
    await expect(getResponseData(syntaxFallback)).resolves.toBe("fallback");

    const textResponse = new MockResponse("plain", {
      headers: { [CONTENT_TYPE_HEADER]: "text/plain" },
      status: 200,
    });
    await expect(
      getResponseData(textResponse as unknown as Response),
    ).resolves.toBe("plain");
  });

  test("defaultErrorHandler throws network and response errors", async () => {
    await expect(
      defaultErrorHandler(undefined, new Error("x")),
    ).rejects.toBeInstanceOf(WoNetworkError);

    const response = new MockResponse(JSON.stringify({ code: "BAD" }), {
      headers: { [CONTENT_TYPE_HEADER]: CONTENT_TYPE_JSON },
      status: HTTP_STATUS.badRequest,
    });
    await expect(
      defaultErrorHandler(response as unknown as Response),
    ).rejects.toBeInstanceOf(WoResponseError);

    const unknownResponse = new MockResponse("teapot", {
      headers: { [CONTENT_TYPE_HEADER]: "text/plain" },
      status: 418,
    });
    await expect(
      defaultErrorHandler(unknownResponse as unknown as Response),
    ).rejects.toBeInstanceOf(WoResponseError);
  });

  test("response handlers parse successful values and call error handler", async () => {
    const errorHandler = jest.fn(async () => undefined);

    const okJson = new MockResponse(JSON.stringify({ ok: true }), {
      headers: { [CONTENT_TYPE_HEADER]: CONTENT_TYPE_JSON },
      status: HTTP_STATUS.ok,
    });
    await expect(
      jsonResponseHandler(okJson as unknown as Response, errorHandler as never),
    ).resolves.toEqual({ ok: true });

    const noContent = new MockResponse(null, { status: HTTP_STATUS.noContent });
    await expect(
      jsonResponseHandler(
        noContent as unknown as Response,
        errorHandler as never,
      ),
    ).resolves.toEqual({});

    const bad = new MockResponse(JSON.stringify({ error: true }), {
      status: HTTP_STATUS.badRequest,
    });
    await jsonResponseHandler(
      bad as unknown as Response,
      errorHandler as never,
    );
    expect(errorHandler).toHaveBeenCalled();

    const okText = new MockResponse("hello", { status: HTTP_STATUS.ok });
    await expect(
      textResponseHandler(okText as unknown as Response, errorHandler as never),
    ).resolves.toBe("hello");

    const badText = new MockResponse("oops", {
      status: HTTP_STATUS.badRequest,
    });
    await textResponseHandler(
      badText as unknown as Response,
      errorHandler as never,
    );
    expect(errorHandler).toHaveBeenCalledTimes(2);
  });
});

describe("WoFetchBase", () => {
  test("fetchUrl throws for missing endpoint", async () => {
    const instance = new WoFetchBase({ endpoint: "" });
    await expect(instance.fetchUrl("GET", "/x")).rejects.toThrow(
      "API endpoint is not defined",
    );
  });

  test("getHeaders injects auth token and content-type", async () => {
    const spy = jest
      .spyOn(anyStorageInstance, "getItem")
      .mockResolvedValue("token");
    const instance = new WoFetchBase({ endpoint: "https://api.example.com" });

    const headers = await instance.getHeaders({ requireAuth: true });
    expect(headers.get(CONTENT_TYPE_HEADER)).toBe(CONTENT_TYPE_JSON);
    expect(headers.get("Authorization")).toBe("Bearer token");

    spy.mockRestore();
  });

  test("fetchUrl calls fetch and custom response handler", async () => {
    const instance = new WoFetchBase({ endpoint: "https://api.example.com" });
    const fetchSpy = jest.spyOn(globalThis, "fetch").mockResolvedValue(
      new MockResponse(JSON.stringify({ ok: true }), {
        headers: { [CONTENT_TYPE_HEADER]: CONTENT_TYPE_JSON },
        status: HTTP_STATUS.ok,
      }) as unknown as Response,
    );

    const responseHandler = jest.fn(async () => ({ ok: true }));
    await expect(
      instance.fetchUrl("GET", "/resource", {
        responseHandler: responseHandler as never,
      }),
    ).resolves.toEqual({ ok: true });

    expect(fetchSpy).toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  test("fetchUrl catch path invokes error handler and returns fallback response", async () => {
    const instance = new WoFetchBase({ endpoint: "https://api.example.com" });
    const fetchSpy = jest
      .spyOn(globalThis, "fetch")
      .mockRejectedValue(new Error("down"));
    const errorHandler = jest.fn(async () => undefined);

    const output = await instance.fetchUrl("GET", "/resource", {
      errorHandler,
    });
    expect(errorHandler).toHaveBeenCalled();
    expect(output).toBeInstanceOf(Response);

    fetchSpy.mockRestore();
  });

  test("generateFetchMethod delegates request method", async () => {
    const instance = new WoFetchBase({ endpoint: "https://api.example.com" });
    const spy = jest
      .spyOn(instance, "fetchUrl")
      .mockResolvedValue({ ok: true } as never);

    const get = instance.generateFetchMethod("GET");
    await get("/x");

    expect(spy).toHaveBeenCalledWith("GET", "/x", undefined);
    spy.mockRestore();
  });
});
