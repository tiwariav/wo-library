import { renderHook, act } from "@testing-library/react";
import useLocalStorage from "../useLocalStorage.js";
import { expect, describe, it, jest, beforeEach } from "@jest/globals";

describe("useLocalStorage", () => {
  const key = "test-key";
  const initialValue = { name: "initial" };

  beforeEach(() => {
    globalThis.localStorage.clear();
    jest.clearAllMocks();
  });

  it("returns initialValue when localStorage is empty", () => {
    const { result } = renderHook(() => useLocalStorage(key, initialValue));
    expect(result.current[0]).toEqual(initialValue);
  });

  it("returns value from localStorage if it exists", () => {
    const storedValue = { name: "stored" };
    globalThis.localStorage.setItem(key, JSON.stringify(storedValue));
    const { result } = renderHook(() => useLocalStorage(key, initialValue));
    expect(result.current[0]).toEqual(storedValue);
  });

  it("updates localStorage when setValue is called", () => {
    const { result } = renderHook(() => useLocalStorage(key, initialValue));
    const newValue = { name: "new" };
    act(() => {
      result.current[1](newValue);
    });
    expect(result.current[0]).toEqual(newValue);
    expect(globalThis.localStorage.getItem(key)).toBe(JSON.stringify(newValue));
  });

  it("updates localStorage with function updater", () => {
    const { result } = renderHook(() => useLocalStorage<number>("count", 0));
    act(() => {
      result.current[1]((prev) => prev + 1);
    });
    expect(result.current[0]).toBe(1);
    expect(globalThis.localStorage.getItem("count")).toBe("1");
  });

  it("handles invalid JSON in localStorage by returning initialValue", () => {
    globalThis.localStorage.setItem(key, "invalid-json");
    const { result } = renderHook(() => useLocalStorage(key, initialValue));
    expect(result.current[0]).toEqual(initialValue);
  });

  it("handles localStorage.setItem error gracefully", () => {
    const setItemSpy = jest
      .spyOn(globalThis.Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("Storage full");
      });

    const { result } = renderHook(() => useLocalStorage(key, initialValue));
    const newValue = { name: "new" };

    act(() => {
      result.current[1](newValue);
    });

    // It should still update the internal state
    expect(result.current[0]).toEqual(newValue);

    setItemSpy.mockRestore();
  });

  it("updates state when 'storage' event is triggered for the same key", () => {
    const { result } = renderHook(() => useLocalStorage(key, initialValue));
    const newValue = { name: "external-update" };

    act(() => {
      const event = new StorageEvent("storage", {
        key,
        newValue: JSON.stringify(newValue),
      });
      globalThis.dispatchEvent(event);
    });

    expect(result.current[0]).toEqual(newValue);
  });

  it("does not update state when 'storage' event is triggered for a different key", () => {
    const { result } = renderHook(() => useLocalStorage(key, initialValue));
    const newValue = { name: "external-update" };

    act(() => {
      const event = new StorageEvent("storage", {
        key: "other-key",
        newValue: JSON.stringify(newValue),
      });
      globalThis.dispatchEvent(event);
    });

    expect(result.current[0]).toEqual(initialValue);
  });
});
