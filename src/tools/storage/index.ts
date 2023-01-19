interface StorageBackend {
  getItem: (arg0: string) => any;
  setItem: (arg0: string, arg1: any) => void;
  removeItem: (arg0: string) => void;
  clear: () => void;
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

export let memoryStorageItems = {};

const memoryStorage = {
  clear: async () => (memoryStorageItems = {}),
  getItem: async (key: string) => memoryStorageItems[key] || null,
  removeItem: async (key: string) => (memoryStorageItems[key] = null),
  setItem: async (key: string, value: any) => (memoryStorageItems[key] = value),
};

export const DEFAULT_STORAGE_BACKENDS = {
  [STORAGE_ENVIRONMENTS.web]: {
    [STORAGE_TYPES.persist]:
      typeof localStorage === "undefined" ? undefined : localStorage,
    [STORAGE_TYPES.temp]:
      typeof sessionStorage === "undefined" ? undefined : sessionStorage,
  },
  [STORAGE_ENVIRONMENTS.mobile]: {
    [STORAGE_TYPES.temp]: memoryStorage,
  },
};

type StorageEnvironments =
  typeof STORAGE_ENVIRONMENTS[keyof typeof STORAGE_ENVIRONMENTS];
type StorageTypes = typeof STORAGE_TYPES[keyof typeof STORAGE_TYPES];

export class AnyStorage {
  backends: {
    [key in StorageTypes]?: StorageBackend;
  };
  env: StorageEnvironments;
  prefix: string;
  version: number;

  constructor() {
    this.env =
      typeof localStorage === "undefined"
        ? STORAGE_ENVIRONMENTS.mobile
        : STORAGE_ENVIRONMENTS.web;
    this.backends = {
      ...DEFAULT_STORAGE_BACKENDS[this.env],
    };
  }

  setBackend = (storageBackends) => {
    this.backends = {
      ...this.backends,
      ...storageBackends,
    };
  };

  formKey = (key) => (this.prefix ? `${this.prefix}.${key}` : key);

  getItem = async (
    key,
    { persist = false, temp = false, json = false } = {}
  ) => {
    let response;
    const storageKey = this.formKey(key);
    if (!persist) {
      // do not check persist storage, return what found in temp
      response = await this.backends[STORAGE_TYPES.temp].getItem(storageKey);
      if (temp) return response || null;
    }
    if (!response) {
      // if checking persist only, or value not found in temp, return from persist
      response = await this.backends[STORAGE_TYPES.persist].getItem(storageKey);
    }
    if (json && response) {
      response = JSON.parse(response);
    }
    return response || null;
  };

  setItem = async (key, value, { persist = false, json = false } = {}) => {
    // based on value of `persist` either store a value in temp or persist
    if (value === null) return;
    const storageKey = this.formKey(key);
    let saveValue = value;
    if (json) {
      saveValue = JSON.stringify(value);
    }
    return await (persist
      ? this.backends[STORAGE_TYPES.persist].setItem(storageKey, saveValue)
      : this.backends[STORAGE_TYPES.temp].setItem(storageKey, saveValue));
  };

  removeItem = async (key) => {
    // remove the key from both temp and persist storage
    const storageKey = this.formKey(key);
    this.backends[STORAGE_TYPES.temp].removeItem(storageKey);
    return this.backends[STORAGE_TYPES.persist].removeItem(storageKey);
  };

  clear = async () => {
    this.backends[STORAGE_TYPES.temp].clear();
    return this.backends[STORAGE_TYPES.persist].clear();
  };
}

export const anyStorageInstance = new AnyStorage();
