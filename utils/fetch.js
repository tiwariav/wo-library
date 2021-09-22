import { merge } from "lodash-es";
import { anyStorageInstance } from "../lib/storage";
import { WoErrorData, WoNetworkError, WoResponseError } from "./error";

const CONTENT_TYPE = "Content-Type";
const ACCESS_TOKEN = "wo:authToken";
const CONTENT_TYPE_FORM = "multipart/form-data";
const DEFAULT_HEADERS = {
  [CONTENT_TYPE]: "application/json",
};

function getFormData(data, file) {
  const formData = new FormData();
  if (data) {
    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value);
    }
  }
  formData.append("file", file);
  return formData;
}

export function defaultResponseErrorHandler(error, data) {
  // handle http response status codes
  switch (data.status) {
    case 400:
      throw new WoErrorData(error, data, "Invalid Data!");
    case 401:
      throw new WoErrorData(error, data, "You session has expired!");
    case 403:
      throw new WoErrorData(
        error,
        data,
        "You are not authorized to access this page!"
      );
    case 404:
      throw new WoErrorData(error, data, "Endpoint not found!");
    case 500:
      throw new WoErrorData(error, data, "Internal server error!");
    default:
      break;
  }
}

export function defaultErrorHandler(error, data) {
  // handle manual set error status codes
  switch (error.name) {
    case "TypeError":
      throw new WoErrorData(error, data, "Response is not proper json!");
    case "AbortError":
      throw new WoErrorData(error, data, "Request aborted!");
    case "WoResponseError":
      defaultResponseErrorHandler(error, data);
      break;
    default:
      throw new WoErrorData(error, data, "Unknown Error!");
  }
}

export function combineURLs(baseURL, relativeURL) {
  const combinedUrl = relativeURL
    ? `${baseURL.replace(/\/+$/, "")}/${relativeURL.replace(/^\/+/, "")}`
    : baseURL;
  return combinedUrl.replace(/\/+$/, "");
}

export function createURL(
  apiEndpoint,
  path,
  { query, id, trailingSlash, devProxy } = {}
) {
  let resourceURL = path;
  let baseURL = apiEndpoint;
  if (devProxy && path.startsWith(devProxy)) {
    resourceURL = path.replace(devProxy, "");
  }
  if (resourceURL.startsWith("http:") || resourceURL.startsWith("https:")) {
    resourceURL = new URL(combineURLs(resourceURL));
  } else {
    if (
      !(apiEndpoint.startsWith("http:") || apiEndpoint.startsWith("https:"))
    ) {
      baseURL = combineURLs(window.location.origin, apiEndpoint);
    }
    resourceURL = new URL(combineURLs(baseURL, resourceURL));
  }
  if (id && resourceURL.pathname.slice(-1) !== "/") {
    resourceURL.pathname += `/${id}`;
  }
  if (query) {
    resourceURL.search = new URLSearchParams(query);
  }
  if (trailingSlash && resourceURL.pathname.slice(-1) !== "/") {
    resourceURL.pathname += "/";
  }
  return resourceURL;
}

export class WoFetch {
  constructor(
    apiEndpoint,
    {
      tokenName = ACCESS_TOKEN,
      errorHandler = defaultErrorHandler,
      authHeader = "Authorization",
      authTokenPrefix = "Bearer",
      trailingSlash = false,
      devProxy,
    } = {}
  ) {
    this.apiEndpoint = apiEndpoint;
    this.tokenName = tokenName;
    this.errorHandler = errorHandler;
    this.authHeader = authHeader;
    this.authTokenPrefix = authTokenPrefix;
    this.trailingSlash = trailingSlash;
    this.devProxy = devProxy;
  }

  handleResponse = async (response, errorHandler = this.errorHandler) => {
    if (response.ok) {
      if (response.status === 204) {
        // success, but no response content
        return response.text();
      }
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return response.json();
      }
      return response;
    }
    return errorHandler(new WoResponseError("Not Ok!"), response);
  };

  handleError = async (error, errorHandler = this.errorHandler) => {
    if (error.data) {
      throw error;
    } else {
      return errorHandler(new WoNetworkError("Network Error!"), error);
    }
  };

  getHeaders = async ({
    headers = {},
    requireAuth = true,
    token,
    xhr = false,
  } = {}) => {
    const headersInstance = xhr ? new Map() : new Headers();
    const allHeaders = merge({}, DEFAULT_HEADERS, headers);
    if (allHeaders[CONTENT_TYPE] === CONTENT_TYPE_FORM) {
      delete allHeaders[CONTENT_TYPE];
    }
    if (requireAuth && this.tokenName) {
      const accessToken =
        token || (await anyStorageInstance.getItem(this.tokenName));
      allHeaders[this.authHeader] = `${this.authTokenPrefix} ${accessToken}`;
    }
    for (const key in allHeaders) {
      const element = allHeaders[key];
      if (xhr) {
        headersInstance[key] = element;
      } else {
        headersInstance.set(key, element);
      }
    }
    return headersInstance;
  };

  fetchURL = async (
    method,
    path,
    {
      data,
      errorHandler,
      headers,
      id,
      noProxy,
      query = {},
      requireAuth,
      trailingSlash = this.trailingSlash,
      token,
    } = {}
  ) => {
    const requestHeaders = await this.getHeaders({
      headers,
      requireAuth,
      token,
    });
    const url = createURL(this.apiEndpoint, path, {
      query,
      id,
      trailingSlash,
      devProxy: !noProxy ? this.devProxy : undefined,
    });
    let body;
    if (data) {
      body =
        requestHeaders.get("Content-Type") === CONTENT_TYPE_FORM
          ? data
          : JSON.stringify(data);
    }
    return fetch(url, { body, headers: requestHeaders, method })
      .then((response) => this.handleResponse(response, errorHandler))
      .catch((error) => this.handleError(error, errorHandler));
  };

  getUrl = async (...args) => this.fetchURL("GET", ...args);

  postUrl = async (...args) => this.fetchURL("POST", ...args);

  putUrl = async (...args) => this.fetchURL("PUT", ...args);

  patchUrl = async (...args) => this.fetchURL("PATCH", ...args);

  deleteUrl = async (...args) => this.fetchURL("DELETE", ...args);

  uploadFileXHR = async (
    path,
    file,
    {
      requireAuth,
      data,
      progressFunction,
      loadStartFunction,
      transferCompleteFunction,
      onStateChange,
    }
  ) => {
    const formData = getFormData(data, file);

    const headers = await this.getHeaders({
      headers: { "Content-Type": CONTENT_TYPE_FORM },
      xhr: true,
      requireAuth,
    });

    const xhrObject = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      // add event listeners to xhrObj
      if (loadStartFunction) {
        xhrObject.upload.addEventListener(
          "loadstart",
          loadStartFunction,
          false
        );
      }
      if (progressFunction) {
        xhrObject.upload.addEventListener("progress", progressFunction, false);
      }
      if (transferCompleteFunction) {
        xhrObject.upload.addEventListener(
          "load",
          transferCompleteFunction,
          false
        );
      }

      // when an XHR object is opened, add a listener for its readystatechange events
      xhrObject.addEventListener("readystatechange", (e) => {
        if (onStateChange) {
          onStateChange(xhrObject.readyState, xhrObject);
        }
        if (xhrObject.readyState !== 4) {
          return;
        }
        if (xhrObject.status >= 300 || xhrObject.status < 200) {
          reject(xhrObject);
        }
        resolve(xhrObject);
      });

      xhrObject.open(
        "POST",
        createURL(this.apiEndpoint, path, {
          trailingSlash: this.trailingSlash,
          devProxy: this.devProxy,
        }),
        true
      );
      for (const key of Object.keys(headers)) {
        xhrObject.setRequestHeader(key, headers[key]);
      }
      xhrObject.send(formData);
    });
  };
}
