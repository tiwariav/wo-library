import {
  AnyStorage,
  DEFAULT_STORAGE_BACKENDS,
  STORAGE_ENVIRONMENTS,
  STORAGE_TYPES,
} from "../storage";

describe("storage in web", () => {
  const anyStorageInstance = new AnyStorage();
  test("env should be web", () => {
    expect(anyStorageInstance.storageEnv).toBe(STORAGE_ENVIRONMENTS.web);
  });
  test("backends should be browser storage", () => {
    expect(anyStorageInstance.storageBackends).toBe(
      DEFAULT_STORAGE_BACKENDS[STORAGE_ENVIRONMENTS.web]
    );
  });
});

describe("storage in mobile", () => {
  const anyStorageInstance = new AnyStorage(STORAGE_ENVIRONMENTS.mobile);
  test("env should be mobile", () => {
    expect(anyStorageInstance.storageEnv).toBe(STORAGE_ENVIRONMENTS.mobile);
  });
  test("backends should be asyncstorage", () => {
    expect(anyStorageInstance.storageBackends).toBe(
      DEFAULT_STORAGE_BACKENDS[STORAGE_ENVIRONMENTS.mobile]
    );
  });
});

const TEST_KEY = "TEST_KEY";
const TEST_SET_VALUE = "TEST_SET_VALUE";
const TEST_GET_VALUE = "TEST_GET_VALUE";

describe("storage operations", () => {
  for (const [key, backends] of Object.entries(DEFAULT_STORAGE_BACKENDS)) {
    const anyStorageInstance = new AnyStorage(key);
    test(`should set value to ${key} - temp`, async () => {
      await anyStorageInstance.setItem(TEST_KEY, TEST_SET_VALUE);
      expect(await backends[STORAGE_TYPES.temp].getItem(TEST_KEY)).toBe(
        TEST_SET_VALUE
      );
    });
    test(`should set value to ${key} - persist`, async () => {
      await anyStorageInstance.setItem(TEST_KEY, TEST_SET_VALUE, {
        persist: true,
      });
      expect(await backends[STORAGE_TYPES.persist].getItem(TEST_KEY)).toBe(
        TEST_SET_VALUE
      );
    });
    test(`should delete value from ${key}`, async () => {
      await anyStorageInstance.removeItem(TEST_KEY);
      expect(await backends[STORAGE_TYPES.temp].getItem(TEST_KEY)).toBe(null);
      expect(await backends[STORAGE_TYPES.persist].getItem(TEST_KEY)).toBe(
        null
      );
    });
    test(`should get value from ${key} - temp`, async () => {
      await anyStorageInstance.setItem(TEST_KEY, TEST_GET_VALUE);
      expect(await anyStorageInstance.getItem(TEST_KEY)).toBe(TEST_GET_VALUE);
      expect(
        await anyStorageInstance.getItem(TEST_KEY, { persist: true })
      ).toBe(null);
      expect(await anyStorageInstance.getItem(TEST_KEY, { temp: true })).toBe(
        TEST_GET_VALUE
      );
      await anyStorageInstance.removeItem(TEST_KEY);
    });
    test(`should get value from ${key} - persist`, async () => {
      await anyStorageInstance.setItem(TEST_KEY, TEST_GET_VALUE, {
        persist: true,
      });
      expect(await anyStorageInstance.getItem(TEST_KEY)).toBe(TEST_GET_VALUE);
      expect(
        await anyStorageInstance.getItem(TEST_KEY, { persist: true })
      ).toBe(TEST_GET_VALUE);
      expect(await anyStorageInstance.getItem(TEST_KEY, { temp: true })).toBe(
        null
      );
      await anyStorageInstance.removeItem(TEST_KEY);
    });
  }
});
