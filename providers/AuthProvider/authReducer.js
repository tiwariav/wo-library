/* A reducer, to modify the auth state */
import { cloneIfModified } from "../../utils/object";
import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_REQUEST,
  SIGNUP_FAILURE,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
} from "./authActions";
import { ACCESS_TOKEN, authStorageClear, USER_DATA } from "./authStorage";

export const authInitialState = {
  isAuthenticated: false,
  isLoading: false,
  accessToken: localStorage.getItem(ACCESS_TOKEN) || "",
  userData: localStorage.getItem(USER_DATA) || null,
};

export function authInit(state) {
  return state;
}

export default function authReducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case LOGIN_REQUEST:
    case SIGNUP_REQUEST:
      authStorageClear();
      return cloneIfModified(state, { ...authInitialState, isLoading: true });
    case LOGIN_SUCCESS:
    case SIGNUP_SUCCESS:
      return cloneIfModified(state, {
        isLoading: false,
        isAuthenticated: true,
        accessToken: (payload || {}).accessToken || "",
        userData: (payload || {}).userData || null,
      });
    case LOGIN_FAILURE:
    case SIGNUP_FAILURE:
    case LOGOUT_REQUEST:
      authStorageClear();
      return cloneIfModified(state, authInitialState);
    default:
      return state;
  }
}
