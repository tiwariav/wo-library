// TYPES

export const ACCESS_TOKEN = "wo:accessToken";
export const USER_DATA = "wo:userData";

export function authStorageClear() {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(USER_DATA);
}
