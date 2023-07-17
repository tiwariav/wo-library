interface StorageBackend {
  clear: () => void;
  getItem: (key: string) => Promise<null | string> | null | string;
  removeItem: (key: string) => void;
  setItem: (key: string, value: string) => void;
}

export enum StorageEnvironment {
  MOBILE = "MOBILE",
  SERVER = "SERVER",
  WEB = "WEB",
}

export enum StorageType {
  PERSIST = "PERSIST",
  SESSION = "SESSION",
  TEMP = "TEMP",
}

export let memoryStorageItems: Record<string, null | string> = {};

export const memoryStorage = {
  clear: () => (memoryStorageItems = {}),
  // eslint-disable-next-line @typescript-eslint/require-await
  getItem: async (key: string): Promise<null | string> =>
    memoryStorageItems[key] || null,
  removeItem: (key: string) => (memoryStorageItems[key] = null),
  setItem: (key: string, value: string) => (memoryStorageItems[key] = value),
};

type StorageBackendOptions = {
  [key in StorageType]: StorageBackend;
};
export class AnyStorage {
  backends: StorageBackendOptions;
  clear = () => {
    this.backends[StorageType.TEMP].clear();
    if (this.prefix) {
      for (const key of Object.keys(this.backends[StorageType.SESSION])) {
        this.backends[StorageType.SESSION].removeItem(key);
      }
      for (const key of Object.keys(this.backends[StorageType.PERSIST])) {
        this.backends[StorageType.PERSIST].removeItem(key);
      }
    }
  };
  env: StorageEnvironment;
  formKey = (key: string) => (this.prefix ? `${this.prefix}.${key}` : key);
  getBackend = (persist: boolean, session: boolean) => {
    if (persist) {
      return this.backends[StorageType.PERSIST];
    }
    if (session) {
      return this.backends[StorageType.SESSION];
    }
    return this.backends[StorageType.TEMP];
  };

  getItem = async <TResponse extends null | string = null | string>(
    key: string,
    { json = this.json, persist = false, session = false } = {},
  ): Promise<TResponse> => {
    const storageKey = this.formKey(key);
    const backend = this.getBackend(persist, session);
    let response = await backend.getItem(storageKey);
    if (response === null && !persist) {
      response = await (session
        ? this.backends[StorageType.PERSIST].getItem(storageKey)
        : this.backends[StorageType.SESSION].getItem(storageKey));
    }
    if (json && response) {
      try {
        response = JSON.parse(response) as TResponse;
      } catch {
        // do nothing, return the string
      }
    }
    // @ts-ignore: TS2322 because response can be null
    return response;
  };

  json = false;

  prefix: string = "";

  // eslint-disable-next-line @typescript-eslint/require-await
  removeItem = async (key: string) => {
    // remove the key from temp, session and persist storage
    const storageKey = this.formKey(key);
    this.backends[StorageType.TEMP].removeItem(storageKey);
    this.backends[StorageType.SESSION].removeItem(storageKey);
    return this.backends[StorageType.PERSIST].removeItem(storageKey);
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

  version: number = 1;

  constructor(env?: StorageEnvironment) {
    const noBrowser =
      typeof localStorage === "undefined" ||
      typeof sessionStorage === "undefined";
    this.env =
      env || noBrowser ? StorageEnvironment.MOBILE : StorageEnvironment.WEB;
    this.backends = noBrowser
      ? {
          [StorageType.PERSIST]: memoryStorage,
          [StorageType.SESSION]: memoryStorage,
          [StorageType.TEMP]: memoryStorage,
        }
      : {
          [StorageType.PERSIST]: localStorage,
          [StorageType.SESSION]: sessionStorage,
          [StorageType.TEMP]: memoryStorage,
        };
  }
}

export const anyStorageInstance = new AnyStorage();
