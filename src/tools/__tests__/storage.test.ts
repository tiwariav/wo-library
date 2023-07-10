import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  AnyStorage,
  DEFAULT_STORAGE_BACKENDS,
  STORAGE_ENVIRONMENTS,
  STORAGE_TYPES,
  StorageEnvironments,
  memoryStorage,
} from "../storage/index.js";

describe("storage in web", () => {
  const anyStorageInstance = new AnyStorage();
  test("env should be web", () => {
    expect(anyStorageInstance.env).toBe(STORAGE_ENVIRONMENTS.web);
  });
  test("backends should be browser storage", () => {
    expect(anyStorageInstance.backends).toStrictEqual(
      DEFAULT_STORAGE_BACKENDS[STORAGE_ENVIRONMENTS.web],
    );
  });
});

describe("storage in mobile", () => {
  const anyStorageInstance = new AnyStorage(STORAGE_ENVIRONMENTS.mobile);
  anyStorageInstance.setBackend({
    // @ts-ignore: TS2739 because AsyncStorage type is not read
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    persist: AsyncStorage,
  });
  test("env should be mobile", () => {
    expect(anyStorageInstance.env).toBe(STORAGE_ENVIRONMENTS.mobile);
  });
  test("backends should be asyncstorage", () => {
    expect(anyStorageInstance.backends).toStrictEqual({
      ...DEFAULT_STORAGE_BACKENDS[STORAGE_ENVIRONMENTS.mobile],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      persist: AsyncStorage,
    });
  });
});

const TEST_KEY = "TEST_KEY";
const TEST_TEMP_VALUE = "TEST_TEMP_VALUE";
const TEST_SESSION_VALUE = "TEST_SESSION_VALUE";
const TEST_PERSIST_VALUE = "TEST_PERSIST_VALUE";

describe("storage operations", () => {
  for (const key of Object.keys(DEFAULT_STORAGE_BACKENDS)) {
    test(`should access ${key} env`, async () => {
      const anyStorageInstance = new AnyStorage(key as StorageEnvironments);
      if (key === STORAGE_ENVIRONMENTS.mobile) {
        // @ts-ignore: TS2739 because AsyncStorage type is not read
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        anyStorageInstance.setBackend({ persist: AsyncStorage });
      } else if (key === STORAGE_ENVIRONMENTS.web) {
        anyStorageInstance.setBackend({ persist: memoryStorage });
      }

      // persist
      await anyStorageInstance.setItem(TEST_KEY, TEST_PERSIST_VALUE, {
        persist: true,
      });
      expect(
        await anyStorageInstance.backends[STORAGE_TYPES.persist].getItem(
          TEST_KEY,
        ),
      ).toBe(TEST_PERSIST_VALUE);
      expect(
        await anyStorageInstance.getItem(TEST_KEY, { persist: true }),
      ).toBe(TEST_PERSIST_VALUE);
      expect(
        await anyStorageInstance.getItem(TEST_KEY, { session: true }),
      ).toBe(TEST_PERSIST_VALUE);

      // session
      await anyStorageInstance.setItem(TEST_KEY, TEST_SESSION_VALUE, {
        session: true,
      });
      expect(
        await anyStorageInstance.backends[STORAGE_TYPES.session].getItem(
          TEST_KEY,
        ),
      ).toBe(TEST_SESSION_VALUE);
      expect(
        await anyStorageInstance.getItem(TEST_KEY, { session: true }),
      ).toBe(TEST_SESSION_VALUE);
      expect(await anyStorageInstance.getItem(TEST_KEY)).toBe(
        TEST_SESSION_VALUE,
      );

      // temp
      await anyStorageInstance.setItem(TEST_KEY, TEST_TEMP_VALUE);
      expect(
        await anyStorageInstance.backends[STORAGE_TYPES.temp].getItem(TEST_KEY),
      ).toBe(TEST_TEMP_VALUE);
      expect(await anyStorageInstance.getItem(TEST_KEY)).toBe(TEST_TEMP_VALUE);

      // remove
      await anyStorageInstance.removeItem(TEST_KEY);
      expect(
        await anyStorageInstance.backends[STORAGE_TYPES.temp].getItem(TEST_KEY),
      ).toBe(null);
      expect(
        await anyStorageInstance.backends[STORAGE_TYPES.session].getItem(
          TEST_KEY,
        ),
      ).toBe(null);
      expect(
        await anyStorageInstance.backends[STORAGE_TYPES.persist].getItem(
          TEST_KEY,
        ),
      ).toBe(null);
    });
  }
});
