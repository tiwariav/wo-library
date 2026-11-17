import { afterEach, beforeEach, vi } from "vitest";

import { debounce } from "../debounce.js";

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("invokes once after the wait window", () => {
    const spy = vi.fn();
    const debounced = debounce(spy, 100);
    debounced("a");
    debounced("b");
    expect(spy).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith("b");
  });
});
