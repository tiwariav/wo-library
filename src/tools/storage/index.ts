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
  session: "session",
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
    [STORAGE_TYPES.session]:
      typeof sessionStorage === "undefined" ? undefined : sessionStorage,
    [STORAGE_TYPES.temp]: memoryStorage,
  },
  [STORAGE_ENVIRONMENTS.mobile]: {
    [STORAGE_TYPES.session]: memoryStorage,
    [STORAGE_TYPES.temp]: memoryStorage,
  },
};

type StorageEnvironments =
  (typeof STORAGE_ENVIRONMENTS)[keyof typeof STORAGE_ENVIRONMENTS];
type StorageTypes = (typeof STORAGE_TYPES)[keyof typeof STORAGE_TYPES];

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

  getBackend = (persist, session) => {
    if (persist) {
      return this.backends[STORAGE_TYPES.persist];
    }
    if (session) {
      return this.backends[STORAGE_TYPES.session];
    }
    return this.backends[STORAGE_TYPES.temp];
  };

  getItem = async (
    key,
    { persist = false, session = false, temp = false, json = false } = {}
  ) => {
    let response;
    const storageKey = this.formKey(key);
    const backend = this.getBackend(persist, session);
    response = await backend.getItem(storageKey);
    if (response === null && !persist) {
      response = await (session
        ? this.backends[STORAGE_TYPES.persist].getItem(storageKey)
        : this.backends[STORAGE_TYPES.session].getItem(storageKey));
    }
    if (json && response) {
      response = JSON.parse(response);
    }
    return response || null;
  };

  setItem = async (
    key,
    value,
    { persist = false, session = false, json = false } = {}
  ) => {
    // based on value of `persist` either store a value in temp or persist
    if (value === null) return;
    const storageKey = this.formKey(key);
    let saveValue = value;
    if (json) {
      saveValue = JSON.stringify(value);
    }
    const backend = this.getBackend(persist, session);
    return await backend.setItem(storageKey, saveValue);
  };

  removeItem = async (key) => {
    // remove the key from temp, session and persist storage
    const storageKey = this.formKey(key);
    this.backends[STORAGE_TYPES.temp].removeItem(storageKey);
    this.backends[STORAGE_TYPES.session].removeItem(storageKey);
    return this.backends[STORAGE_TYPES.persist].removeItem(storageKey);
  };

  clear = async () => {
    this.backends[STORAGE_TYPES.temp].clear();
    if (this.prefix) {
      for (const key of Object.keys(localStorage)) {
        this.backends[STORAGE_TYPES.session].removeItem(key);
        this.backends[STORAGE_TYPES.persist].removeItem(key);
      }
    }
  };
}

export const anyStorageInstance = new AnyStorage();
