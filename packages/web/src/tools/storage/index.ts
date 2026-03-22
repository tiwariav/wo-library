/**
 * A pluggable storage backend interface (sync or async).
 * Mirrors the Web Storage API (`localStorage` / `sessionStorage`).
 */
export interface StorageBackend {
  clear: () => void;
  getItem: (key: string) => Promise<null | string> | null | string;
  removeItem: (key: string) => Promise<void> | void;
  setItem: (key: string, value: string) => Promise<void> | void;
}

/** Supported storage environment types. */
export const STORAGE_ENVIRONMENTS = ["mobile", "server", "web"] as const;

/** Storage durability tiers: persist (localStorage), session, or temp (memory). */
export const STORAGE_TYPES = ["persist", "session", "temp"] as const;

/** In-memory record backing the fallback {@link memoryStorage} backend. */
export let memoryStorageItems: Record<string, null | string> = {};

/**
 * In-memory `StorageBackend` implementation used as a fallback when
 * `localStorage` / `sessionStorage` are unavailable (e.g., SSR).
 */
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

type StorageBackendOptions = Record<
  (typeof STORAGE_TYPES)[number],
  StorageBackend
>;

interface GetBackendOptions {
  persist?: boolean;
  session?: boolean;
}

interface GetItemOptions extends GetBackendOptions {
  json?: boolean;
}

function getJsonItem(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch (error) {
    if (!(error instanceof SyntaxError)) {
      throw error;
    }
    // in case of syntax error return string
  }
  return value;
}

function getStorageKeys(backend: StorageBackend): string[] {
  if (typeof Storage !== "undefined" && backend instanceof Storage) {
    const keys: string[] = [];
    for (let index = 0; index < backend.length; index += 1) {
      const key = backend.key(index);
      if (key !== null) {
        keys.push(key);
      }
    }
    return keys;
  }

  return Object.keys(memoryStorageItems);
}

function getPrefixedRemovalTasks(
  backend: StorageBackend,
  prefix: string,
): Promise<void>[] {
  const pendingRemovals: Promise<void>[] = [];
  for (const key of getStorageKeys(backend)) {
    if (key.startsWith(`${prefix}.`)) {
      pendingRemovals.push(Promise.resolve(backend.removeItem(key)));
    }
  }
  return pendingRemovals;
}

/**
 * Unified storage abstraction that delegates to `localStorage`,
 * `sessionStorage`, or an in-memory fallback depending on the environment.
 *
 * Supports optional JSON serialisation, key prefixing, and pluggable backends
 * (e.g., React Native `AsyncStorage`).
 *
 * @example
 * ```ts
 * import { anyStorageInstance } from "@wo-library/web";
 *
 * await anyStorageInstance.setItem("token", "abc123", { persist: true });
 * const token = await anyStorageInstance.getItem("token", { persist: true });
 * ```
 */
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
    this.env = env ?? (noBrowser ? "mobile" : "web");
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
    if (!this.prefix) {
      this.backends.session.clear();
      this.backends.persist.clear();
      return;
    }

    const pendingRemovals = [
      ...getPrefixedRemovalTasks(this.backends.session, this.prefix),
      ...getPrefixedRemovalTasks(this.backends.persist, this.prefix),
    ];
    await Promise.all(pendingRemovals);
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
    options: { json: true } & GetItemOptions,
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
      response = getJsonItem(response) as TResponse;
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

/** Pre-instantiated {@link AnyStorage} singleton for convenience. */
export const anyStorageInstance = new AnyStorage();
