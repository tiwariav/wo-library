import AsyncStorage from '@react-native-async-storage/async-storage';
export class AnyStorage {
  constructor() {
    if (typeof localStorage !== 'undefined') {
      this.storageType = 'web';
    } else {
      this.storageType = 'mobile';
    }
  }
  getItem = async (key) =>
    this.storageType === 'web'
      ? sessionStorage.getItem(key) || localStorage.getItem(key)
      : await AsyncStorage.getItem(key);
  setItem = async (key, value) =>
    this.storageType === 'web'
      ? sessionStorage.setItem(key, value) || localStorage.setItem(key, value)
      : await AsyncStorage.setItem(key, value);
  removeItem = async key => {
    if (this.storageType === 'web') {
      sessionStorage.removeItem(key);
      localStorage.removeItem(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  };
}
