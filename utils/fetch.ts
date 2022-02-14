import { merge } from "lodash-es";
import { anyStorageInstance } from "../lib/storage";
import { WoErrorData, WoNetworkError, WoResponseError } from "./error";

export type WoRequestQuery = Record<string, number | boolean | string>;
export type WoRequestId = Record<string, string>;
type XHREventListener = (
  this: XMLHttpRequestUpload,
  event: ProgressEvent<XMLHttpRequestEventTarget>
) => any;
type XHRStateChange = (
  state: XMLHttpRequest["readyState"],
  xhrObject: XMLHttpRequest
) => any;

interface FetchURLNamedArgs {
  data?: Record<any, any>;
  errorHandler?: typeof defaultErrorHandler;
  headers?: Record<string, string>;
  id?: WoRequestId;
  noProxy?: boolean;
  query?: WoRequestQuery;
  requireAuth?: boolean;
  trailingSlash?: boolean;
  token?: string;
}

const contentType = "Content-Type";
const accessToken = "wo:authToken";
const contentTypeForm = "multipart/form-data";
const defaultHeaders = {
  [contentType]: "application/json",
};

function getFormData(data?: Record<string, string>, file?: Blob): FormData {
  const formData = new FormData();
  if (data) {
    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value);
    }
  }
  formData.append("file", file);
  return formData;
}

export function defaultResponseErrorHandler(
  error: WoResponseError,
  data: Response
): void {
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
    case 429:
      throw new WoErrorData(error, data, "Too many requests!");
    case 500:
      throw new WoErrorData(error, data, "Internal server error!");
    default:
      break;
  }
}

export function defaultErrorHandler(
  error: WoResponseError,
  data: Response
): void {
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

export function combineURLs(baseURL: string, relativeURL?: string): string {
  const combinedUrl = relativeURL
    ? `${baseURL.replace(/\/+$/, "")}/${relativeURL.replace(/^\/+/, "")}`
    : baseURL;
  return combinedUrl.replace(/\/+$/, "");
}

export function createURL(
  apiEndpoint: string,
  path: string,
  {
    query,
    id,
    trailingSlash,
    devProxy,
  }: {
    query?: WoRequestQuery;
    id?: WoRequestId;
    trailingSlash?: boolean;
    devProxy?: string;
  } = {}
): URL {
  let resourcePath = path;
  let baseURL = apiEndpoint;
  if (devProxy && path.startsWith(devProxy)) {
    resourcePath = path.replace(devProxy, "");
  }
  let resourceURL: URL;
  if (resourcePath.startsWith("http:") || resourcePath.startsWith("https:")) {
    resourceURL = new URL(combineURLs(resourcePath));
  } else {
    if (
      !(apiEndpoint.startsWith("http:") || apiEndpoint.startsWith("https:"))
    ) {
      baseURL = combineURLs(window.location.origin, apiEndpoint);
    }
    resourceURL = new URL(combineURLs(baseURL, resourcePath));
  }
  if (id && resourceURL.pathname.slice(-1) !== "/") {
    resourceURL.pathname += `/${id}`;
  }
  if (query) {
    const searchParams = new URLSearchParams(query as Record<string, string>);
    resourceURL.search = searchParams.toString();
  }
  if (trailingSlash && resourceURL.pathname.slice(-1) !== "/") {
    resourceURL.pathname += "/";
  }
  return resourceURL;
}

interface WoFetchArgs {
  tokenName?: string;
  errorHandler?: typeof defaultErrorHandler;
  authHeader?: string;
  authTokenPrefix?: string;
  trailingSlash?: boolean;
  devProxy?: string;
}

export interface WoFetch extends WoFetchArgs {
  apiEndpoint: string;
}

/**
 *
 *
 * @export
 * @class WoFetch
 */
export class WoFetch {
  constructor(
    apiEndpoint: string,
    {
      tokenName = accessToken,
      errorHandler = defaultErrorHandler,
      authHeader = "Authorization",
      authTokenPrefix = "Bearer",
      trailingSlash = false,
      devProxy,
    }: WoFetchArgs = {}
  ) {
    this.apiEndpoint = apiEndpoint;
    this.tokenName = tokenName;
    this.errorHandler = errorHandler;
    this.authHeader = authHeader;
    this.authTokenPrefix = authTokenPrefix;
    this.trailingSlash = trailingSlash;
    this.devProxy = devProxy;
  }

  /**
   *
   * @param response the fetch Response object
   * @param {errorHandler} errorHandler
   * @returns
   */
  handleResponse = async (
    response: Response,
    errorHandler = this.errorHandler
  ): Promise<Response | object | string | ReturnType<typeof errorHandler>> => {
    if (response.ok) {
      if (response.status === 204) {
        // success, but no response content, return empty string
        return response.text();
      }
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        // success, and response type json, return the json content
        return response.json();
      }
      // success, and response type unknown, return the entire response
      return response;
    }
    // request not successful, raise error from response
    return errorHandler(new WoResponseError("Not Ok!"), response);
  };

  handleError = async (
    error: Response | WoErrorData,
    errorHandler = this.errorHandler
  ): Promise<void> => {
    if (error instanceof WoErrorData) {
      throw error;
    } else {
      return errorHandler(new WoNetworkError("Network Error!"), error);
    }
  };

  getHeaders = async ({
    token,
    headers = {},
    requireAuth = true,
    xhr = false,
  }: {
    token?: string;
    headers?: Record<string, string>;
    requireAuth?: boolean;
    xhr?: boolean;
  } = {}): Promise<Headers | Map<string, string>> => {
    const headersInstance = xhr ? new Map() : new Headers();
    const allHeaders = merge({}, defaultHeaders, headers);
    if (allHeaders[contentType] === contentTypeForm) {
      delete allHeaders[contentType];
    }
    if (requireAuth && this.tokenName) {
      const accessToken =
        token || (await anyStorageInstance.getItem(this.tokenName));
      allHeaders[this.authHeader] = `${this.authTokenPrefix} ${accessToken}`;
    }
    for (const key in allHeaders) {
      const element = allHeaders[key];
      headersInstance.set(key, element);
    }
    return headersInstance;
  };

  fetchURL = async (
    method: string,
    path: string,
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
    }: FetchURLNamedArgs = {}
  ): Promise<
    ReturnType<typeof this.handleResponse | typeof this.handleError>
  > => {
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
    let body: any;
    if (data) {
      body =
        requestHeaders.get("Content-Type") === contentTypeForm
          ? data
          : JSON.stringify(data);
    }
    return fetch(url.toString(), {
      body,
      headers: Object.fromEntries(requestHeaders),
      method,
    })
      .then((response) => this.handleResponse(response, errorHandler))
      .catch((error) => this.handleError(error, errorHandler));
  };

  getUrl = async (path, options) => this.fetchURL("GET", path, options);

  postUrl = async (path, options) => this.fetchURL("POST", path, options);

  putUrl = async (path, options) => this.fetchURL("PUT", path, options);

  patchUrl = async (path, options) => this.fetchURL("PATCH", path, options);

  deleteUrl = async (path, options) => this.fetchURL("DELETE", path, options);

  uploadFileXHR = async (
    path: string,
    file: Blob,
    {
      requireAuth,
      data,
      progressFunction,
      loadStartFunction,
      transferCompleteFunction,
      onStateChange,
    }: {
      requireAuth: boolean;
      data: Record<any, any>;
      progressFunction: XHREventListener;
      loadStartFunction: XHREventListener;
      transferCompleteFunction: XHREventListener;
      onStateChange: XHRStateChange;
    }
  ): Promise<void> => {
    const formData = getFormData(data, file);

    const headers = await this.getHeaders({
      headers: { "Content-Type": contentTypeForm },
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
      xhrObject.addEventListener("readystatechange", () => {
        if (onStateChange) {
          onStateChange(xhrObject.readyState, xhrObject);
        }
        if (xhrObject.readyState !== 4) {
          return;
        }
        if (xhrObject.status >= 300 || xhrObject.status < 200) {
          reject(xhrObject);
        }
        resolve();
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
