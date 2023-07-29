interface StorageBackend {
  clear: () => void;
  getItem: (key: string) => Promise<null | string> | null | string;
  removeItem: (key: string) => Promise<void> | void;
  setItem: (key: string, value: string) => void;
}

export const STORAGE_ENVIRONMENTS = ["mobile", "server", "web"] as const;
export const STORAGE_TYPES = ["persist", "session", "temp"] as const;

export let memoryStorageItems: Record<string, null | string> = {};

export const memoryStorage = {
  clear: () => (memoryStorageItems = {}),
  // eslint-disable-next-line @typescript-eslint/require-await
  getItem: async (key: string): Promise<null | string> =>
    memoryStorageItems[key] || null,
  removeItem: (key: string) => {
    memoryStorageItems[key] = null;
  },
  setItem: (key: string, value: string) => (memoryStorageItems[key] = value),
};

type StorageBackendOptions = {
  [key in (typeof STORAGE_TYPES)[number]]: StorageBackend;
};
export class AnyStorage {
  backends: StorageBackendOptions;
  clear = async () => {
    this.backends["temp"].clear();
    if (this.prefix) {
      for (const key of Object.keys(this.backends["session"])) {
        await this.backends["session"].removeItem(key);
      }
      for (const key of Object.keys(this.backends["persist"])) {
        await this.backends["persist"].removeItem(key);
      }
    }
  };
  env: (typeof STORAGE_ENVIRONMENTS)[number];
  formKey = (key: string) => (this.prefix ? `${this.prefix}.${key}` : key);
  getBackend = (persist: boolean, session: boolean) => {
    if (persist) {
      return this.backends["persist"];
    }
    if (session) {
      return this.backends["session"];
    }
    return this.backends["temp"];
  };

  getItem = async <TResponse extends null | string>(
    key: string,
    { json = this.json, noNull = false, persist = false, session = false } = {},
  ): Promise<TResponse | null | string | undefined> => {
    const storageKey = this.formKey(key);
    const backend = this.getBackend(persist, session);
    let response = await backend.getItem(storageKey);
    if (response === null && !persist) {
      response = await (session
        ? this.backends["persist"].getItem(storageKey)
        : this.backends["session"].getItem(storageKey));
    }
    if (json && response) {
      try {
        response = JSON.parse(response) as TResponse;
      } catch {
        // do nothing, return the string
      }
    }
    if (undefined && response === null) return undefined;
    return response;
  };

  json = false;

  prefix: string = "";

  // eslint-disable-next-line @typescript-eslint/require-await
  removeItem = async (key: string) => {
    // remove the key from temp, session and persist storage
    const storageKey = this.formKey(key);
    await this.backends["temp"].removeItem(storageKey);
    await this.backends["session"].removeItem(storageKey);
    return this.backends["persist"].removeItem(storageKey);
  };

  setBackend = (storageBackends: Partial<StorageBackendOptions>) => {
    this.backends = {
      ...this.backends,
      ...storageBackends,
    };
  };

  setItem = async (
    key: string,
    value: any,
    { json = this.json, persist = false, session = false } = {},
    // eslint-disable-next-line @typescript-eslint/require-await
  ) => {
    // based on value of `persist` either store a value in temp or persist
    if (value === null) return;
    const storageKey = this.formKey(key);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const saveValue = json ? JSON.stringify(value) : value;
    const backend = this.getBackend(persist, session);
    return backend.setItem(storageKey, saveValue as string);
  };

  version: number | string = 1;

  constructor(env?: (typeof STORAGE_ENVIRONMENTS)[number]) {
    const noBrowser =
      typeof localStorage === "undefined" ||
      typeof sessionStorage === "undefined";
    this.env = env || noBrowser ? "mobile" : "web";
    this.backends = noBrowser
      ? {
          persist: memoryStorage,
          session: memoryStorage,
          temp: memoryStorage,
        }
      : {
          persist: localStorage,
          session: sessionStorage,
          temp: memoryStorage,
        };
  }
}

export const anyStorageInstance = new AnyStorage();
