import * as rootExports from "../../index.js";
import {
  WoError,
  WoLoadScriptError,
  WoNetworkError,
  WoResponseError,
} from "../error/index.js";
import {
  cssVariable,
  loadScript,
  loadStylesheet,
  others,
  overrideStyleProperty,
  storage,
  svg,
} from "../index.js";

describe("css and svg tools", () => {
  test("root index exports tool namespaces", () => {
    expect(typeof rootExports.loadScript).toBe("function");
    expect(typeof rootExports.fetch).toBe("object");
  });

  test("cssVariable and overrideStyleProperty work with document body", () => {
    overrideStyleProperty("--test-color", "red");
    expect(cssVariable("--test-color").trim()).toBe("red");

    overrideStyleProperty("--test-color");
    expect(cssVariable("--test-color").trim()).toBe("red");
  });

  test("svg data helpers encode payloads", () => {
    const svgNode = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    const fromNode = svg.svgNodeToData(svgNode);
    const fromText = svg.responseTextToData("<svg></svg>");

    expect(fromNode.startsWith("data:image/svg+xml;utf8,")).toBe(true);
    expect(fromText).toContain(encodeURIComponent("<svg></svg>"));
  });

  test("css helpers support explicit node parameter", () => {
    const node = document.createElement("div");
    overrideStyleProperty("--node-color", "blue", node);
    expect(cssVariable("--node-color", node).trim()).toBe("blue");
  });
});

describe("script and stylesheet loaders", () => {
  test("loadScript returns true for existing script", async () => {
    const src = "https://cdn.example.com/existing.js";
    const script = document.createElement("script");
    script.src = src;
    document.body.append(script);

    await expect(loadScript(src)).resolves.toBe(true);
  });

  test("loadScript appends and resolves on load event", async () => {
    const src = "https://cdn.example.com/new.js";
    const promise = loadScript(src, { "data-kind": "sdk" });
    const script = document.querySelector(
      `script[src="${src}"]`,
    ) as HTMLScriptElement;

    expect(script).toBeTruthy();
    expect(script.dataset.kind).toBe("sdk");
    script.dispatchEvent(new Event("load"));

    await expect(promise).resolves.toBe(true);
  });

  test("loadScript resolves false on error", async () => {
    const src = "https://cdn.example.com/fail.js";
    const promise = loadScript(src);
    const script = document.querySelector(
      `script[src="${src}"]`,
    ) as HTMLScriptElement;

    script.dispatchEvent(new Event("error"));
    await expect(promise).resolves.toBe(false);
  });

  test("loadScript applies CSP nonce when meta is present", async () => {
    const meta = document.createElement("meta");
    meta.setAttribute("property", "csp-nonce");
    meta.setAttribute("content", "nonce-123");
    document.head.append(meta);

    const src = "https://cdn.example.com/nonce.js";
    const promise = loadScript(src);
    const script = document.querySelector(
      `script[src="${src}"]`,
    ) as HTMLScriptElement;
    expect(script.getAttribute("nonce")).toBe("nonce-123");
    script.dispatchEvent(new Event("load"));
    await expect(promise).resolves.toBe(true);
  });

  test("loadStylesheet appends and resolves", async () => {
    const href = "https://cdn.example.com/main.css";
    const promise = loadStylesheet(href);
    const link = document.querySelector(
      `link[href="${href}"]`,
    ) as HTMLLinkElement;

    expect(link).toBeTruthy();
    link.dispatchEvent(new Event("load"));
    await expect(promise).resolves.toBe(true);
  });

  test("loadStylesheet returns true when already present", async () => {
    const href = "https://cdn.example.com/existing.css";
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.append(link);

    await expect(loadStylesheet(href)).resolves.toBe(true);
  });

  test("loadStylesheet resolves false on error", async () => {
    const href = "https://cdn.example.com/fail.css";
    const promise = loadStylesheet(href);
    const link = document.querySelector(
      `link[href="${href}"]`,
    ) as HTMLLinkElement;

    link.dispatchEvent(new Event("error"));
    await expect(promise).resolves.toBe(false);
  });

  test("loadStylesheet applies CSP nonce from meta", async () => {
    document
      .querySelectorAll("meta[property~='csp-nonce'][content]")
      .forEach((item) => item.remove());
    const meta = document.createElement("meta");
    meta.setAttribute("property", "csp-nonce");
    meta.setAttribute("content", "nonce-456");
    document.head.append(meta);

    const href = "https://cdn.example.com/nonce.css";
    const promise = loadStylesheet(href);
    const link = document.querySelector(
      `link[href="${href}"]`,
    ) as HTMLLinkElement;
    expect(link.getAttribute("nonce")).toBe("nonce-456");
    link.dispatchEvent(new Event("load"));
    await expect(promise).resolves.toBe(true);
  });
});

describe("error classes", () => {
  test("web errors set names and payloads", () => {
    const base = new WoError("base");
    const load = new WoLoadScriptError("load");
    const network = new WoNetworkError("network");
    const response = new WoResponseError({ ok: false }, 400, "bad");

    expect(base.name).toBe("WoError");
    expect(load.name).toBe("WoLoadScriptError");
    expect(network.name).toBe("WoNetworkError");
    expect(response.name).toBe("WoResponseError");
    expect(response.status).toBe(400);
    expect(response.data).toEqual({ ok: false });
  });
});

describe("storage helpers", () => {
  test("memory storage backend supports set/get/remove/clear", () => {
    storage.memoryStorage.clear();
    storage.memoryStorage.setItem("a", "1");
    expect(storage.memoryStorage.getItem("a")).toBe("1");
    storage.memoryStorage.removeItem("a");
    expect(storage.memoryStorage.getItem("a")).toBeNull();
    storage.memoryStorage.setItem("b", "2");
    storage.memoryStorage.clear();
    expect(storage.memoryStorage.getItem("b")).toBeNull();
  });

  test("AnyStorage handles json and backend selection", async () => {
    const instance = new storage.AnyStorage("mobile");
    instance.prefix = "pref";

    await instance.setItem("obj", { a: 1 }, { json: true, persist: true });
    await expect(
      instance.getItem("obj", { json: true, persist: true }),
    ).resolves.toEqual({ a: 1 });

    await instance.setItem("plain", "x", { session: true });
    await expect(instance.getItem("plain", { session: true })).resolves.toBe(
      "x",
    );

    await instance.removeItem("plain");
    await expect(
      instance.getItem("plain", { session: true }),
    ).resolves.toBeNull();

    instance.setBackend({
      temp: {
        clear: () => undefined,
        getItem: () => "not-json",
        removeItem: () => undefined,
        setItem: () => undefined,
      },
    });
    await expect(instance.getItem("broken", { json: true })).resolves.toBe(
      "not-json",
    );

    await instance.clear();
  });

  test("AnyStorage supports environment constants and no-browser fallback", () => {
    expect(storage.STORAGE_ENVIRONMENTS).toEqual(["mobile", "server", "web"]);
    expect(storage.STORAGE_TYPES).toEqual(["persist", "session", "temp"]);

    const nativeLocalStorage = globalThis.localStorage;
    const nativeSessionStorage = globalThis.sessionStorage;
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: undefined,
      writable: true,
    });
    Object.defineProperty(globalThis, "sessionStorage", {
      configurable: true,
      value: undefined,
      writable: true,
    });

    const fallback = new storage.AnyStorage();
    expect(fallback.env).toBe("mobile");

    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: nativeLocalStorage,
      writable: true,
    });
    Object.defineProperty(globalThis, "sessionStorage", {
      configurable: true,
      value: nativeSessionStorage,
      writable: true,
    });
  });
});

describe("routing helper", () => {
  test("others namespace exports redirectToLogout", () => {
    expect(typeof others.redirectToLogout).toBe("function");
  });
});
