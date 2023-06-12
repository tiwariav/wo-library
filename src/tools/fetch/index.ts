import { merge } from "lodash-es";

import { WoResponseError } from "../error/index.js";
import { anyStorageInstance } from "../storage/index.js";

type WoRequestQueryTypes = boolean | number | string;
export type WoRequestQuery = Record<
  string,
  WoRequestQueryTypes | WoRequestQueryTypes[]
>;
type XHREventListener = (
  this: XMLHttpRequestUpload,
  event: ProgressEvent<XMLHttpRequestEventTarget>
) => any;
type XHRStateChange = (
  state: XMLHttpRequest["readyState"],
  xhrObject: XMLHttpRequest
) => any;

export interface FetchURLOptions<
  DataType = FormData | Record<string, any>,
  QueryType = Record<string, WoRequestQueryTypes | WoRequestQueryTypes[]>
> {
  credentials?: RequestCredentials;
  data?: DataType;
  errorHandler?: typeof defaultErrorHandler;
  headers?: Record<string, string>;
  id?: string;
  noProxy?: boolean;
  query?: QueryType;
  requireAuth?: boolean;
  token?: string;
  trailingSlash?: boolean;
}

export type FetchURLOptionsData<DataType, QueryType = any> = FetchURLOptions<
  DataType,
  QueryType
>;
export type FetchURLOptionsQuery<QueryType, DataType = any> = FetchURLOptions<
  DataType,
  QueryType
>;

type FetchURLArgs = [path: string, options?: FetchURLOptions];

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

export async function defaultErrorHandler(response: Response): Promise<void> {
  // handle error depending on http response status codes
  const responseData = (await response.json()) as object;
  switch (response.status) {
    case 400: {
      throw new WoResponseError(responseData, "Invalid Data!");
    }
    case 401: {
      throw new WoResponseError(responseData, "You session has expired!");
    }
    case 403: {
      throw new WoResponseError(
        responseData,
        "You are not authorized to access this page!"
      );
    }
    case 404: {
      throw new WoResponseError(responseData, "Endpoint not found!");
    }
    case 429: {
      throw new WoResponseError(responseData, "Too many requests!");
    }
    case 500: {
      throw new WoResponseError(responseData, "Internal server error!");
    }
    default: {
      break;
    }
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
    devProxy,
    id,
    query,
    trailingSlash,
  }: {
    devProxy?: string;
    id?: string;
    query?: WoRequestQuery;
    trailingSlash?: boolean;
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

interface WoFetchOptions<E = typeof defaultErrorHandler> {
  authHeader?: string;
  authTokenPrefix?: string;
  credentials?: RequestCredentials;
  devProxy?: string;
  endpoint?: string;
  errorHandler?: E;
  tokenName?: string;
  trailingSlash?: boolean;
}

export interface WoFetch extends WoFetchOptions {
  endpoint: string;
}

/**
 *
 *
 * @export
 * @class WoFetch
 */
export class WoFetch {
  deleteUrl = async (...rest: FetchURLArgs) => this.fetchURL("DELETE", ...rest);

  fetchURL = async (
    method: string,
    path: string,
    {
      credentials,
      data,
      errorHandler,
      headers,
      id,
      noProxy,
      query = {},
      requireAuth,
      token,
      trailingSlash = this.trailingSlash,
    }: FetchURLOptions = {}
  ): Promise<any> => {
    if (!this.endpoint) {
      throw new Error("API endpoint is not defined");
    }
    const requestHeaders = await this.getHeaders({
      headers,
      requireAuth,
      token,
    });
    const url = createURL(this.endpoint, path, {
      devProxy: noProxy ? undefined : this.devProxy,
      id,
      query,
      trailingSlash,
    });
    let body: FormData | RequestInit["body"];
    if (data) {
      body =
        requestHeaders.get("Content-Type") === contentTypeForm
          ? (data as FormData)
          : JSON.stringify(data);
    }
    return fetch(url.toString(), {
      body,
      credentials,
      headers: Object.fromEntries(requestHeaders),
      method,
    }).then((response) => this.handleResponse(response, errorHandler));
  };

  getHeaders = async ({
    headers = {},
    requireAuth = true,
    token,
    xhr = false,
  }: {
    headers?: Record<string, string>;
    requireAuth?: boolean;
    token?: string;
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

  getUrl = async (...rest: FetchURLArgs) => this.fetchURL("GET", ...rest);

  /**
   *
   * @param response the fetch Response object
   * @param {errorHandler} errorHandler
   * @returns
   */
  handleResponse = async (
    response: Response,
    errorHandler = this.errorHandler
  ): Promise<Response | ReturnType<typeof errorHandler> | object | string> => {
    if (response.ok) {
      if (response.status === 204) {
        // success, but no response content, return empty string
        return response.text();
      }
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        // success, and response type json, return the json content
        return response.json() as object;
      }
      // success, and response type unknown, return the entire response
      return response;
    }
    // request not successful, call errorHandler with request param
    // since the function awaits, if it throws any error, that will
    // be passed on to the catch block.
    return await errorHandler(response);
  };

  patchUrl = async (...rest: FetchURLArgs) => this.fetchURL("PATCH", ...rest);

  postUrl = async (...rest: FetchURLArgs) => this.fetchURL("POST", ...rest);

  putUrl = async (...rest: FetchURLArgs) => this.fetchURL("PUT", ...rest);

  uploadFileXHR = async (
    path: string,
    file: Blob,
    {
      data,
      loadStartFunction,
      onStateChange,
      progressFunction,
      requireAuth,
      transferCompleteFunction,
    }: {
      data: Record<any, any>;
      loadStartFunction?: XHREventListener;
      onStateChange?: XHRStateChange;
      progressFunction: XHREventListener;
      requireAuth: boolean;
      transferCompleteFunction?: XHREventListener;
    }
  ): Promise<void> => {
    const formData = getFormData(data, file);

    const headers = await this.getHeaders({
      headers: { "Content-Type": contentTypeForm },
      requireAuth,
      xhr: true,
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
        createURL(this.endpoint, path, {
          devProxy: this.devProxy,
          trailingSlash: this.trailingSlash,
        }),
        true
      );
      for (const key of Object.keys(headers)) {
        xhrObject.setRequestHeader(key, headers[key] as string);
      }
      xhrObject.send(formData);
    });
  };

  constructor({
    authHeader = "Authorization",
    authTokenPrefix = "Bearer",
    credentials,
    devProxy,
    endpoint,
    errorHandler = defaultErrorHandler,
    tokenName = accessToken,
    trailingSlash = false,
  }: WoFetchOptions = {}) {
    this.endpoint = endpoint;
    this.tokenName = tokenName;
    this.errorHandler = errorHandler;
    this.authHeader = authHeader;
    this.authTokenPrefix = authTokenPrefix;
    this.trailingSlash = trailingSlash;
    this.devProxy = devProxy;
    this.credentials = credentials;
  }
}
