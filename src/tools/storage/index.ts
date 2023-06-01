interface StorageBackend {
  getItem: (arg0: string) => string | Promise<string>;
  setItem: (arg0: string, arg1: unknown) => void;
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

export let memoryStorageItems: Record<string, string> = {};

export const memoryStorage = {
  clear: () => (memoryStorageItems = {}),
  // eslint-disable-next-line @typescript-eslint/require-await
  getItem: async (key: string): Promise<string> =>
    memoryStorageItems[key] || null,
  removeItem: (key: string) => (memoryStorageItems[key] = null),
  setItem: (key: string, value: string) => (memoryStorageItems[key] = value),
};

export type StorageEnvironments =
  (typeof STORAGE_ENVIRONMENTS)[keyof typeof STORAGE_ENVIRONMENTS];
type StorageTypes = (typeof STORAGE_TYPES)[keyof typeof STORAGE_TYPES];
type StorageBackendOptions = {
  [key in StorageTypes]?: StorageBackend;
};

export const DEFAULT_STORAGE_BACKENDS: {
  [Key in StorageEnvironments]?: StorageBackendOptions;
} = {
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

export class AnyStorage {
  backends: StorageBackendOptions;
  env: StorageEnvironments;
  prefix: string;
  version: number;
  json = false;

  constructor(env?: StorageEnvironments) {
    this.env =
      env || typeof localStorage === "undefined"
        ? STORAGE_ENVIRONMENTS.mobile
        : STORAGE_ENVIRONMENTS.web;
    this.backends = {
      ...DEFAULT_STORAGE_BACKENDS[this.env],
    };
  }

  setBackend = (storageBackends: StorageBackendOptions) => {
    this.backends = {
      ...this.backends,
      ...storageBackends,
    };
  };

  formKey = (key: string) => (this.prefix ? `${this.prefix}.${key}` : key);

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
    key: string,
    { persist = false, session = false, json = this.json } = {}
  ) => {
    const storageKey = this.formKey(key);
    const backend = this.getBackend(persist, session);
    let response = await backend.getItem(storageKey);
    if (response === null && !persist) {
      response = await (session
        ? this.backends[STORAGE_TYPES.persist].getItem(storageKey)
        : this.backends[STORAGE_TYPES.session].getItem(storageKey));
    }
    if (json && response) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        response = JSON.parse(response);
      } catch {
        // do nothing, return the string
      }
    }
    return response || null;
  };

  setItem = async (
    key: string,
    value: unknown,
    { persist = false, session = false, json = this.json } = {}
    // eslint-disable-next-line @typescript-eslint/require-await
  ) => {
    // based on value of `persist` either store a value in temp or persist
    if (value === null) return;
    const storageKey = this.formKey(key);
    let saveValue = value;
    if (json) {
      saveValue = JSON.stringify(value);
    }
    const backend = this.getBackend(persist, session);
    return backend.setItem(storageKey, saveValue);
  };

  // eslint-disable-next-line @typescript-eslint/require-await
  removeItem = async (key: string) => {
    // remove the key from temp, session and persist storage
    const storageKey = this.formKey(key);
    this.backends[STORAGE_TYPES.temp].removeItem(storageKey);
    this.backends[STORAGE_TYPES.session].removeItem(storageKey);
    return this.backends[STORAGE_TYPES.persist].removeItem(storageKey);
  };

  clear = () => {
    this.backends[STORAGE_TYPES.temp].clear();
    if (this.prefix) {
      for (const key of Object.keys(this.backends[STORAGE_TYPES.session])) {
        this.backends[STORAGE_TYPES.session].removeItem(key);
      }
      for (const key of Object.keys(this.backends[STORAGE_TYPES.persist])) {
        this.backends[STORAGE_TYPES.persist].removeItem(key);
      }
    }
  };
}

export const anyStorageInstance = new AnyStorage();
