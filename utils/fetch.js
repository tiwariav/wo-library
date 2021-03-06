import { anyStorage } from "../lib/storage";
import { WoErrorData, WoNetworkError, WoResponseError } from "./error";

const ACCESS_TOKEN = "wo:authToken";

export function defaultErrorHandler(error, data) {
  // handle manual set error status codes
  switch (error.name) {
    case "TypeError":
      throw new WoErrorData(error, data, "Response is not proper json!");
    case "AbortError":
      throw new WoErrorData(error, data, "Request aborted!");
    case "WoResponseError":
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

  getHeaders = ({
    requireAuth = true,
    contentType = "application/json",
    xhr = false,
    token,
  } = {}) => {
    const headers = xhr ? new Map() : new Headers();
    if (contentType !== "multipart/form-data") {
      headers.set("Content-Type", contentType);
    }
    if (requireAuth && this.tokenName) {
      const accessToken = token || anyStorage.getItem(this.tokenName);
      if (accessToken) {
        if (xhr) {
          headers[this.authHeader] = `${this.authTokenPrefix} ${accessToken}`;
        } else {
          headers.set(
            this.authHeader,
            `${this.authTokenPrefix} ${accessToken}`
          );
        }
      }
    }
    return headers;
  };

  fetchURL = async (
    method,
    path,
    {
      contentType,
      data,
      errorHandler,
      id,
      noProxy,
      query = {},
      requireAuth,
      trailingSlash = this.trailingSlash,
      token,
    } = {}
  ) => {
    const headers = this.getHeaders({ requireAuth, contentType, token });
    const url = createURL(this.apiEndpoint, path, {
      query,
      id,
      trailingSlash,
      devProxy: !noProxy ? this.devProxy : undefined,
    });
    let body;
    if (data) {
      body =
        contentType === "multipart/form-data" ? data : JSON.stringify(data);
    }
    return fetch(url, { method, headers, body })
      .then((response) => this.handleResponse(response, errorHandler))
      .catch((error) => this.handleError(error, errorHandler));
  };

  getUrl = async (...args) => this.fetchURL("GET", ...args);

  postUrl = async (...args) => this.fetchURL("POST", ...args);

  putUrl = async (...args) => this.fetchURL("PUT", ...args);

  patchUrl = async (...args) => this.fetchURL("PATCH", ...args);

  deleteUrl = async (...args) => this.fetchURL("DELETE", ...args);

  uploadFileXHR = (
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
    const formData = new FormData();
    if (data) {
      Object.entries(data).forEach(([key, value]) =>
        formData.append(key, value)
      );
    }

    formData.append("file", file);

    const headers = this.getHeaders({
      contentType: "multipart/form-data",
      xhr: true,
      requireAuth,
    });

    const xhrObj = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      // add event listeners to xhrObj
      if (loadStartFunction) {
        xhrObj.upload.addEventListener("loadstart", loadStartFunction, false);
      }
      if (progressFunction) {
        xhrObj.upload.addEventListener("progress", progressFunction, false);
      }
      if (transferCompleteFunction) {
        xhrObj.upload.addEventListener("load", transferCompleteFunction, false);
      }

      // when an XHR object is opened, add a listener for its readystatechange events
      xhrObj.addEventListener("readystatechange", (e) => {
        if (onStateChange) {
          onStateChange(xhrObj.readyState, xhrObj);
        }
        if (xhrObj.readyState === 4) {
          if (xhrObj.status >= 300 || xhrObj.status < 200) {
            reject(xhrObj);
          } else {
            resolve(xhrObj);
          }
        }
      });

      xhrObj.open(
        "POST",
        createURL(this.apiEndpoint, path, {
          trailingSlash: this.trailingSlash,
          devProxy: this.devProxy,
        }),
        true
      );
      Object.keys(headers).forEach((key) =>
        xhrObj.setRequestHeader(key, headers[key])
      );
      xhrObj.send(formData);
    });
  };
}
