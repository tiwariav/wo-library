import AsyncStorage from "@react-native-async-storage/async-storage";

interface StorageBackend {
  getItem: (arg0: string) => any;
  setItem: (arg0: string, arg1: any) => void;
  removeItem: (arg0: string) => void;
}

export const STORAGE_ENVIRONMENTS = {
  mobile: "mobile",
  server: "server",
  web: "web",
} as const;

export const STORAGE_TYPES = {
  persist: "persist",
  temp: "temp",
} as const;

export const memoryStorageItems = {};

const memoryStorage = {
  getItem: async (key: string) => memoryStorageItems[key] || null,
  setItem: async (key: string, value: any) => (memoryStorageItems[key] = value),
  removeItem: async (key: string) => (memoryStorageItems[key] = null),
};

export const DEFAULT_STORAGE_BACKENDS = {
  [STORAGE_ENVIRONMENTS.web]: {
    [STORAGE_TYPES.persist]:
      typeof localStorage !== "undefined" ? localStorage : undefined,
    [STORAGE_TYPES.temp]:
      typeof sessionStorage !== "undefined" ? sessionStorage : undefined,
  },
  [STORAGE_ENVIRONMENTS.mobile]: {
    [STORAGE_TYPES.persist]: AsyncStorage,
    [STORAGE_TYPES.temp]: memoryStorage,
  },
};

type StorageEnvironments =
  typeof STORAGE_ENVIRONMENTS[keyof typeof STORAGE_ENVIRONMENTS];
type StorageTypes = typeof STORAGE_TYPES[keyof typeof STORAGE_TYPES];

export class AnyStorage {
  storageEnv: StorageEnvironments;
  storageBackends: {
    [key in StorageTypes]: StorageBackend;
  };

  constructor(storageEnv?: StorageEnvironments, storageBackends = {}) {
    this.storageEnv =
      storageEnv ||
      (typeof localStorage !== "undefined"
        ? STORAGE_ENVIRONMENTS.web
        : STORAGE_ENVIRONMENTS.mobile);
    this.storageBackends = {
      ...storageBackends,
      ...DEFAULT_STORAGE_BACKENDS[this.storageEnv],
    };
  }

  getItem = async (
    key,
    { persist = false, temp = false, json = false } = {}
  ) => {
    let response;
    if (!persist) {
      // do not check persist storage, return what found in temp
      response = await this.storageBackends[STORAGE_TYPES.temp].getItem(key);
      if (temp) return response || null;
    }
    if (!response) {
      // if checking persist only, or value not found in temp, return from persist
      response = await this.storageBackends[STORAGE_TYPES.persist].getItem(key);
    }
    if (json && response) {
      response = JSON.parse(response);
    }
    return response || null;
  };

  setItem = async (key, value, { persist = false, json = false } = {}) => {
    // based on value of `persist` either store a value in temp or persist
    if (value === null) return;
    let saveValue = value;
    if (json) {
      saveValue = JSON.stringify(value);
    }
    return await (persist
      ? this.storageBackends[STORAGE_TYPES.persist].setItem(key, saveValue)
      : this.storageBackends[STORAGE_TYPES.temp].setItem(key, saveValue));
  };

  removeItem = async (key) => {
    // remove the key from both temp and persist storage
    this.storageBackends[STORAGE_TYPES.temp].removeItem(key);
    return this.storageBackends[STORAGE_TYPES.persist].removeItem(key);
  };
}

export const anyStorageInstance = new AnyStorage();
