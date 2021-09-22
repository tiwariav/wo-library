import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_ENVIRONMENTS = {
  mobile: 'mobile',
  server: 'server',
  web: 'web',
}

export const STORAGE_TYPES = {
  persist: 'persist',
  temp: 'temp',
}

export const memoryStorageItems = {};

const memoryStorage = {
  getItem: async (key) => memoryStorageItems[key] || null,
  setItem: async (key, value) => memoryStorageItems[key] = value,
  removeItem: async (key) => memoryStorageItems[key] = null,
}

export const DEFAULT_STORAGE_BACKENDS = {
  [STORAGE_ENVIRONMENTS.web]: {
    [STORAGE_TYPES.persist]: localStorage,
    [STORAGE_TYPES.temp]: sessionStorage
  },
  [STORAGE_ENVIRONMENTS.mobile]: {
    [STORAGE_TYPES.persist]: AsyncStorage,
    [STORAGE_TYPES.temp]: memoryStorage
  }
}

export class AnyStorage {
  constructor(storageEnv) {
    this.storageEnv = storageEnv || (typeof localStorage !== 'undefined'
      ? STORAGE_ENVIRONMENTS.web
      : STORAGE_ENVIRONMENTS.mobile);
    this.storageBackends = DEFAULT_STORAGE_BACKENDS[this.storageEnv]
  }

  getItem = async (key, { persist = false, temp = false } = {}) => {
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
    return response || null;
  }

  setItem = async (key, value, { persist = false } = {}) => {
    // based on value of `persist` either store a value in temp or persist
    return await (persist
      ? this.storageBackends[STORAGE_TYPES.persist].setItem(key, value)
      : this.storageBackends[STORAGE_TYPES.temp].setItem(key, value)
    );
  }

  removeItem = async (key) => {
    // remove the key from both temp and persist storage
    this.storageBackends[STORAGE_TYPES.temp].removeItem(key);
    return this.storageBackends[STORAGE_TYPES.persist].removeItem(key);
  };
}

export const anyStorageInstance = new AnyStorage();
