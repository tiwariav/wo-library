export interface StorageBackend {
  clear: () => void;
  getItem: (key: string) => Promise<null | string> | null | string;
  removeItem: (key: string) => Promise<void> | void;
  setItem: (key: string, value: string) => Promise<void> | void;
}

export const STORAGE_ENVIRONMENTS = ["mobile", "server", "web"] as const;
export const STORAGE_TYPES = ["persist", "session", "temp"] as const;

export let memoryStorageItems: Record<string, null | string> = {};

export const memoryStorage = {
  clear: () => (memoryStorageItems = {}),
  getItem: (key: string): null | string => memoryStorageItems[key] ?? null,
  removeItem: (key: string) => {
    memoryStorageItems[key] = null;
  },
  setItem: (key: string, value: string) => {
    memoryStorageItems[key] = value;
  },
};

type StorageBackendOptions = {
  [key in (typeof STORAGE_TYPES)[number]]: StorageBackend;
};

interface GetBackendOptions {
  persist?: boolean;
  session?: boolean;
}

interface GetItemOptions extends GetBackendOptions {
  json?: boolean;
}

export class AnyStorage {
  backends: StorageBackendOptions;
  env: (typeof STORAGE_ENVIRONMENTS)[number];
  formKey = (key: string) => (this.prefix ? `${this.prefix}.${key}` : key);
  json = false;
  prefix = "";
  version: number | string = 1;

  constructor(env?: (typeof STORAGE_ENVIRONMENTS)[number]) {
    const noBrowser =
      typeof localStorage === "undefined" ||
      typeof sessionStorage === "undefined";
    this.env = env ?? noBrowser ? "mobile" : "web";
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

  async clear() {
    this.backends.temp.clear();
    if (this.prefix) {
      await Promise.all(
        Object.keys(this.backends.session).map((key) =>
          this.backends.session.removeItem(key),
        ),
      );
      await Promise.all(
        Object.keys(this.backends.persist).map((key) =>
          this.backends.persist.removeItem(key),
        ),
      );
    }
  }

  getBackend({ persist, session }: GetBackendOptions = {}) {
    if (persist) {
      return this.backends.persist;
    }
    if (session) {
      return this.backends.session;
    }
    return this.backends.temp;
  }

  getItem<TResponse = object>(
    key: string,
    options: GetItemOptions & { json: true },
  ): Promise<TResponse | null>;

  getItem<TResponse = string>(
    key: string,
    options?: GetItemOptions,
  ): Promise<TResponse | null>;

  async getItem<TResponse = object | string>(
    key: string,
    { json = this.json, persist, session }: GetItemOptions = {},
  ): Promise<TResponse | null | string> {
    const storageKey = this.formKey(key);
    const backend = this.getBackend({ persist, session });
    let response: TResponse | null | string = await backend.getItem(storageKey);
    if (response === null && !persist) {
      response = await (session
        ? this.backends.persist.getItem(storageKey)
        : this.backends.session.getItem(storageKey));
    }
    if (json && response) {
      try {
        response = JSON.parse(response) as TResponse;
      } catch (error) {
        if (!(error instanceof SyntaxError)) {
          throw error;
        }
        // in case of syntax error return string
      }
    }
    return response;
  }

  async removeItem(key: string) {
    // remove the key from all of temp, session and persist storage
    const storageKey = this.formKey(key);
    await this.backends.temp.removeItem(storageKey);
    await this.backends.session.removeItem(storageKey);
    return this.backends.persist.removeItem(storageKey);
  }

  setBackend(storageBackends: Partial<StorageBackendOptions>) {
    this.backends = {
      ...this.backends,
      ...storageBackends,
    };
  }
  async setItem(
    key: string,
    value: unknown,
    { json = this.json, persist = false, session = false } = {},
  ) {
    if (value === null) {
      return;
    }
    const storageKey = this.formKey(key);
    const saveValue = json ? JSON.stringify(value) : value;
    const backend = this.getBackend({ persist, session });
    await backend.setItem(storageKey, saveValue as string);
  }
}

export const anyStorageInstance = new AnyStorage();
