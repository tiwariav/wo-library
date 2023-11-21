import AsyncStorage from "@react-native-async-storage/async-storage";

import { AnyStorage, STORAGE_ENVIRONMENTS } from "./index.js";

describe("storage in web", () => {
  const anyStorageInstance = new AnyStorage();
  test("env should be web", () => {
    expect(anyStorageInstance.env).toBe("web");
  });
});

describe("storage in mobile", () => {
  const anyStorageInstance = new AnyStorage("mobile");
  anyStorageInstance.setBackend({
    // @ts-expect-error: TS2739 because AsyncStorage type is not read
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    persist: AsyncStorage,
  });
  test("env should be mobile", () => {
    expect(anyStorageInstance.env).toBe("mobile");
  });
  test("backends should be asyncstorage", () => {
    expect(anyStorageInstance.backends.persist).toStrictEqual(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      AsyncStorage,
    );
  });
});

const TEST_KEY = "TEST_KEY";
const TEST_TEMP_VALUE = "TEST_TEMP_VALUE";
const TEST_SESSION_VALUE = "TEST_SESSION_VALUE";
const TEST_PERSIST_VALUE = "TEST_PERSIST_VALUE";

function envTest(key: (typeof STORAGE_ENVIRONMENTS)[number]) {
  return async () => {
    const anyStorageInstance = new AnyStorage(key);
    if (key === "mobile") {
      // @ts-expect-error: TS2739 because AsyncStorage type is not read
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      anyStorageInstance.setBackend({ persist: AsyncStorage });
    } else if (key === "web") {
      anyStorageInstance.setBackend({ persist: localStorage });
    }

    // persist
    await anyStorageInstance.setItem(TEST_KEY, TEST_PERSIST_VALUE, {
      persist: true,
    });
    expect(await anyStorageInstance.backends.persist.getItem(TEST_KEY)).toBe(
      TEST_PERSIST_VALUE,
    );
    expect(await anyStorageInstance.getItem(TEST_KEY, { persist: true })).toBe(
      TEST_PERSIST_VALUE,
    );
    expect(await anyStorageInstance.getItem(TEST_KEY, { session: true })).toBe(
      TEST_PERSIST_VALUE,
    );

    // session
    await anyStorageInstance.setItem(TEST_KEY, TEST_SESSION_VALUE, {
      session: true,
    });
    expect(await anyStorageInstance.backends.session.getItem(TEST_KEY)).toBe(
      TEST_SESSION_VALUE,
    );
    expect(await anyStorageInstance.getItem(TEST_KEY, { session: true })).toBe(
      TEST_SESSION_VALUE,
    );
    expect(await anyStorageInstance.getItem(TEST_KEY)).toBe(TEST_SESSION_VALUE);

    // temp
    await anyStorageInstance.setItem(TEST_KEY, TEST_TEMP_VALUE);
    expect(await anyStorageInstance.backends.temp.getItem(TEST_KEY)).toBe(
      TEST_TEMP_VALUE,
    );
    expect(await anyStorageInstance.getItem(TEST_KEY)).toBe(TEST_TEMP_VALUE);

    // remove
    await anyStorageInstance.removeItem(TEST_KEY);
    expect(await anyStorageInstance.backends.temp.getItem(TEST_KEY)).toBe(null);
    expect(await anyStorageInstance.backends.session.getItem(TEST_KEY)).toBe(
      null,
    );
    expect(await anyStorageInstance.backends.persist.getItem(TEST_KEY)).toBe(
      null,
    );
  };
}

describe("storage operations", () => {
  for (const key of STORAGE_ENVIRONMENTS) {
    test(`should access ${key} env`, envTest(key));
  }
});
