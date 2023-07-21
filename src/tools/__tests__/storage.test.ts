import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  AnyStorage,
  StorageEnvironment,
  StorageType,
} from "../storage/index.js";

describe("storage in web", () => {
  const anyStorageInstance = new AnyStorage();
  test("env should be web", () => {
    expect(anyStorageInstance.env).toBe(StorageEnvironment.WEB);
  });
});

describe("storage in mobile", () => {
  const anyStorageInstance = new AnyStorage(StorageEnvironment.MOBILE);
  anyStorageInstance.setBackend({
    // @ts-ignore: TS2739 because AsyncStorage type is not read
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    [StorageType.PERSIST]: AsyncStorage,
  });
  test("env should be mobile", () => {
    expect(anyStorageInstance.env).toBe(StorageEnvironment.MOBILE);
  });
  test("backends should be asyncstorage", () => {
    expect(anyStorageInstance.backends.PERSIST).toStrictEqual(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      AsyncStorage,
    );
  });
});

const TEST_KEY = "TEST_KEY";
const TEST_TEMP_VALUE = "TEST_TEMP_VALUE";
const TEST_SESSION_VALUE = "TEST_SESSION_VALUE";
const TEST_PERSIST_VALUE = "TEST_PERSIST_VALUE";

function envTest(key: StorageEnvironment) {
  return async () => {
    const anyStorageInstance = new AnyStorage(key);
    if (key === StorageEnvironment.MOBILE) {
      // @ts-ignore: TS2739 because AsyncStorage type is not read
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      anyStorageInstance.setBackend({ PERSIST: AsyncStorage });
    } else if (key === StorageEnvironment.WEB) {
      anyStorageInstance.setBackend({ PERSIST: localStorage });
    }

    // persist
    await anyStorageInstance.setItem(TEST_KEY, TEST_PERSIST_VALUE, {
      persist: true,
    });
    expect(await anyStorageInstance.backends.PERSIST.getItem(TEST_KEY)).toBe(
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
    expect(await anyStorageInstance.backends.SESSION.getItem(TEST_KEY)).toBe(
      TEST_SESSION_VALUE,
    );
    expect(await anyStorageInstance.getItem(TEST_KEY, { session: true })).toBe(
      TEST_SESSION_VALUE,
    );
    expect(await anyStorageInstance.getItem(TEST_KEY)).toBe(TEST_SESSION_VALUE);

    // temp
    await anyStorageInstance.setItem(TEST_KEY, TEST_TEMP_VALUE);
    expect(await anyStorageInstance.backends.TEMP.getItem(TEST_KEY)).toBe(
      TEST_TEMP_VALUE,
    );
    expect(await anyStorageInstance.getItem(TEST_KEY)).toBe(TEST_TEMP_VALUE);

    // remove
    await anyStorageInstance.removeItem(TEST_KEY);
    expect(await anyStorageInstance.backends.TEMP.getItem(TEST_KEY)).toBe(null);
    expect(await anyStorageInstance.backends.SESSION.getItem(TEST_KEY)).toBe(
      null,
    );
    expect(await anyStorageInstance.backends.PERSIST.getItem(TEST_KEY)).toBe(
      null,
    );
  };
}

describe("storage operations", () => {
  for (const key of Object.values(StorageEnvironment)) {
    test(`should access ${key} env`, envTest(key));
  }
});
