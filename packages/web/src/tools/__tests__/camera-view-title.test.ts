import { cameraSkipReason, probeCamera } from "../cameraAvailability.js";
import { attachTruncationTitles } from "../titleIfTruncated.js";
import { canFade, canSlide, runViewTransition } from "../viewTransition.js";

describe("cameraAvailability", () => {
  test("probe and reason", async () => {
    expect(cameraSkipReason("none")).toContain("[camera_none]");
    expect(await probeCamera()).toBe("ok");
    expect(
      await probeCamera({
        mediaDevices: {
          enumerateDevices: async () => [{ kind: "audioinput" }],
        },
      }),
    ).toBe("none");
    expect(
      await probeCamera({
        mediaDevices: {
          enumerateDevices: async () => [{ kind: "videoinput" }],
        },
      }),
    ).toBe("ok");
  });
});

describe("viewTransition and truncation", () => {
  test("fallbacks without API", () => {
    expect(canSlide()).toBe(false);
    expect(canFade()).toBe(false);
    const fn = vi.fn();
    runViewTransition("push", fn);
    expect(fn).toHaveBeenCalledOnce();
  });

  test("attachTruncationTitles", () => {
    const table = document.createElement("table");
    document.body.append(table);
    const td = document.createElement("td");
    Object.defineProperty(td, "scrollWidth", { value: 200 });
    Object.defineProperty(td, "clientWidth", { value: 50 });
    td.textContent = "long text";
    table.append(td);
    const detach = attachTruncationTitles(table);
    td.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    expect(td.title).toBe("long text");
    detach();
    table.remove();
  });
});
