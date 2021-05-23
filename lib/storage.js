export const anyStorage = {
  getItem: (key) => sessionStorage.getItem(key) || localStorage.getItem(key),
  setItem: (key, value) =>
    sessionStorage.setItem(key, value) || localStorage.setItem(key, value),
  removeItem: (key) => {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  },
};
