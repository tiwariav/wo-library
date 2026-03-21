import { loadScript, loadStylesheet } from "../index.js";

describe("Security: DOM XSS in loadScript and loadStylesheet", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    document.body.innerHTML = "";
    // Mock CSS.escape if it's not available in the test environment (jsdom might not have it depending on version)
    if (typeof CSS === "undefined") {
      (global as any).CSS = {
        escape: (str: string) => str.replace(/([!"#$%&'()*+,./:;<=>?@\[\\\]^`{|}~])/g, "\\$1"),
      };
    }
  });

  test("loadScript handles malicious source strings by escaping them", async () => {
    const maliciousSource = '"]; console.log("xss"); //';
    const spy = jest.spyOn(document, "querySelector");

    // We don't want to actually load anything, just check how querySelector is called
    try {
        await loadScript(maliciousSource);
    } catch (e) {
        // ignore errors from document.body.append if any
    }

    expect(spy).toHaveBeenCalledWith(`script[src="${CSS.escape(maliciousSource)}"]`);
    spy.mockRestore();
  });

  test("loadStylesheet handles malicious source strings by escaping them", async () => {
    const maliciousSource = '"]; console.log("xss"); //';
    const spy = jest.spyOn(document, "querySelector");

    try {
        await loadStylesheet(maliciousSource);
    } catch (e) {
    }

    expect(spy).toHaveBeenCalledWith(`link[href="${CSS.escape(maliciousSource)}"]`);
    spy.mockRestore();
  });
});
