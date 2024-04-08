import AsyncStorage from "@react-native-async-storage/async-storage";

import type { StorageBackend } from "./index.js";

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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    persist: AsyncStorage as unknown as StorageBackend,
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

function setBackend(anyStorageInstance: AnyStorage, key: string) {
  if (key === "mobile") {
    anyStorageInstance.setBackend({
      persist: AsyncStorage as unknown as StorageBackend,
    });
  } else if (key === "web") {
    anyStorageInstance.setBackend({ persist: localStorage });
  }
}

async function persistBackend(anyStorageInstance: AnyStorage) {
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
}

async function remove(anyStorageInstance: AnyStorage) {
  await anyStorageInstance.removeItem(TEST_KEY);
  expect(await anyStorageInstance.backends.temp.getItem(TEST_KEY)).toBeNull();
  expect(
    await anyStorageInstance.backends.session.getItem(TEST_KEY),
  ).toBeNull();
  expect(
    await anyStorageInstance.backends.persist.getItem(TEST_KEY),
  ).toBeNull();
}

async function tempBackend(anyStorageInstance: AnyStorage) {
  await anyStorageInstance.setItem(TEST_KEY, TEST_TEMP_VALUE);
  expect(await anyStorageInstance.backends.temp.getItem(TEST_KEY)).toBe(
    TEST_TEMP_VALUE,
  );
  expect(await anyStorageInstance.getItem(TEST_KEY)).toBe(TEST_TEMP_VALUE);
}

async function sessionBackend(anyStorageInstance: AnyStorage) {
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
}

function expectResult(key: (typeof STORAGE_ENVIRONMENTS)[number]) {
  const anyStorageInstance = new AnyStorage(key);

  return async () => {
    setBackend(anyStorageInstance, key);
    await persistBackend(anyStorageInstance);
    await sessionBackend(anyStorageInstance);
    await tempBackend(anyStorageInstance);
    await remove(anyStorageInstance);
  };
}

describe("storage operations", () => {
  for (const key of STORAGE_ENVIRONMENTS) {
    test(`should access ${key} env`, expectResult(key));
  }
});
