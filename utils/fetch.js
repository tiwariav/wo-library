import { ACCESS_TOKEN } from "../providers/AuthProvider/authStorage";
import WoError from "./error";

export function defaultErrorHandler(response, status) {
  // handle manual set error status codes
  switch (status) {
    case "20X":
      return new WoError("Response is not proper json!", response);
    case "TypeError":
      return new WoError("Network error!", response);
    case "AbortError":
      return new WoError("Request aborted!", response);
    default:
      break;
  }
  // handle http response status codes
  switch (response.status) {
    case 400:
      return new WoError("Invalid Data!", response);
    case 401:
      return new WoError(
        "You session has expired! Please log in again.",
        response
      );
    case 403:
      return new WoError(
        "You are not authorized to access this page! Kindly contact admin.",
        response
      );
    case 404:
      return new WoError("Api endpoint not found!", response);
    case 500:
      return new WoError("Server encountered an internal error!", response);
    default:
      return new WoError("Unknown Error!", response);
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
  if (id) {
    resourceURL.pathname += `/${id}`;
  }
  if (query) {
    resourceURL.search = new URLSearchParams(query);
  }
  if (trailingSlash) {
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

  handleResponse = (response, errorHandler = this.errorHandler) =>
    new Promise((resolve, reject) => {
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (response.status === 204) {
          // success, but no response content
          return resolve(response.text());
        }
        if (contentType && contentType.includes("application/json")) {
          return resolve(response.json());
        }
        return reject(errorHandler(response, "20X"));
      }
      return reject(errorHandler(response));
    });

  handleError = (error, errorHandler = this.errorHandler) =>
    new Promise((resolve, reject) => reject(errorHandler(error, error.name)));

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
      const accessToken = token || localStorage.getItem(this.tokenName);
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
    { id, query = {}, requireAuth, contentType, token, data, errorHandler } = {}
  ) => {
    const headers = this.getHeaders({ requireAuth, contentType, token });
    const url = createURL(this.apiEndpoint, path, {
      query,
      id,
      trailingSlash: this.trailingSlash,
      devProxy: this.devProxy,
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
      data,
      progressFunction,
      loadStartFunction,
      transferCompleteFunction,
      onStateChange,
    }
  ) => {
    const formData = new FormData();
    formData.append("file", file);

    if (data) {
      Object.entries(data).forEach(([key, value]) =>
        formData.append(key, value)
      );
    }
    const headers = this.getHeaders({
      contentType: "multipart/form-data",
      xhr: true,
    });

    const xhrObj = new XMLHttpRequest();

    // add event listeners to xhrObj
    if (progressFunction) {
      xhrObj.upload.addEventListener("loadstart", loadStartFunction, false);
    }
    if (loadStartFunction) {
      xhrObj.upload.addEventListener("progress", progressFunction, false);
    }
    if (transferCompleteFunction) {
      xhrObj.upload.addEventListener("load", transferCompleteFunction, false);
    }
    if (onStateChange) {
      // when an XHR object is opened, add a listener for its readystatechange events
      xhrObj.addEventListener("readystatechange", (e) => {
        onStateChange(xhrObj.readyState, xhrObj);
      });
    }

    xhrObj.open("POST", createURL(this.apiEndpoint, path), true);
    Object.keys(headers).forEach((key) =>
      xhrObj.setRequestHeader(key, headers[key])
    );
    xhrObj.send(formData);
  };
}
