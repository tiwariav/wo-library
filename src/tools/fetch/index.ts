import type { SetRequired } from "type-fest";

import { merge, pickBy } from "lodash-es";

import type {
  FetchOptions,
  WoRequestMethod,
  WoRequestQuery,
  XhrEventListener,
  XhrStateChange,
} from "./types.js";

import { WoResponseError } from "../error/index.js";
import { anyStorageInstance } from "../storage/index.js";
import {
  ACCESS_TOKEN_KEY,
  CONTENT_TYPE_FORM,
  CONTENT_TYPE_HEADER,
  CONTENT_TYPE_JSON,
} from "./constants.js";
import { defaultErrorHandler } from "./errorHandlers.js";
import { jsonResponseHandler } from "./responseHandlers.js";

function getFormData(file: Blob, data?: Record<string, string>): FormData {
  const formData = new FormData();
  if (data) {
    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value);
    }
  }
  formData.append("file", file);
  return formData;
}

export function combineUrls(baseUrl: string, relativeUrl?: string): string {
  const combinedUrl = relativeUrl
    ? `${baseUrl.replace(/\/+$/, "")}/${relativeUrl.replace(/^\/+/, "")}`
    : baseUrl;
  return combinedUrl.replace(/\/+$/, "");
}

export function createUrl(
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
  } = {},
): URL {
  let resourcePath = path;
  let baseUrl = apiEndpoint;
  if (devProxy && path.startsWith(devProxy)) {
    resourcePath = path.replace(devProxy, "");
  }
  let resourceUrl: URL;
  if (resourcePath.startsWith("http:") || resourcePath.startsWith("https:")) {
    resourceUrl = new URL(combineUrls(resourcePath));
  } else {
    if (
      !(apiEndpoint.startsWith("http:") || apiEndpoint.startsWith("https:"))
    ) {
      baseUrl = combineUrls(window.location.origin, apiEndpoint);
    }
    resourceUrl = new URL(combineUrls(baseUrl, resourcePath));
  }
  if (id && !resourceUrl.pathname.endsWith("/")) {
    resourceUrl.pathname += `/${id}`;
  }
  if (query) {
    const cleanQuery = pickBy(query, (value) => value !== undefined);
    const searchParams = new URLSearchParams(
      cleanQuery as Record<string, string>,
    );
    resourceUrl.search = searchParams.toString();
  }
  if (trailingSlash && !resourceUrl.pathname.endsWith("/")) {
    resourceUrl.pathname += "/";
  }
  return resourceUrl;
}

export class WoFetchBase {
  authHeader = "Authorization";
  authTokenPrefix = "Bearer";
  credentials?: RequestCredentials;
  devProxy?: string;
  endpoint: string;
  errorHandler = defaultErrorHandler;
  responseHandler = jsonResponseHandler;
  tokenName = ACCESS_TOKEN_KEY;
  trailingSlash?: boolean;

  constructor({
    endpoint,
    ...options
  }: SetRequired<Partial<WoFetchBase>, "endpoint">) {
    this.endpoint = endpoint;
    Object.assign(this, options);
  }

  async fetchUrl<TResponseData>(
    method: string,
    path: string,
    options: FetchOptions = {},
  ): Promise<TResponseData> {
    const {
      credentials,
      data,
      errorHandler = this.errorHandler,
      headers,
      id,
      noProxy,
      query = {},
      requireAuth,
      responseHandler = this.responseHandler,
      token,
      trailingSlash = this.trailingSlash,
    } = options;
    if (!this.endpoint) {
      throw new Error("API endpoint is not defined");
    }
    const requestHeaders = await this.getHeaders({
      headers,
      requireAuth,
      token,
    });
    const url = createUrl(this.endpoint, path, {
      devProxy: noProxy ? undefined : this.devProxy,
      id,
      query,
      trailingSlash,
    });
    let body: FormData | RequestInit["body"];
    if (data) {
      body =
        requestHeaders.get(CONTENT_TYPE_HEADER) === CONTENT_TYPE_FORM
          ? (data as FormData)
          : JSON.stringify(data);
    }
    try {
      const response = await fetch(url.toString(), {
        body,
        credentials,
        headers: Object.fromEntries(requestHeaders),
        method,
      });
      return responseHandler<TResponseData>(response, errorHandler);
    } catch (error) {
      await errorHandler(undefined, error);
    }
    return new Response() as TResponseData;
  }

  generateFetchMethod(method: WoRequestMethod) {
    return <
      TData extends object,
      TFetchOptions extends FetchOptions = FetchOptions,
    >(
      path: string,
      options?: TFetchOptions,
    ) => this.fetchUrl<TData>(method, path, options);
  }

  async getHeaders({
    headers = {},
    requireAuth = true,
    token,
    xhr = false,
  }: {
    headers?: Record<string, string>;
    requireAuth?: boolean;
    token?: string;
    xhr?: boolean;
  } = {}): Promise<Headers | Map<string, string>> {
    const headersInstance = xhr ? new Map() : new Headers();
    const allHeaders: Record<string, string> = merge({}, headers);
    if (!(CONTENT_TYPE_HEADER in allHeaders)) {
      allHeaders[CONTENT_TYPE_HEADER] = CONTENT_TYPE_JSON;
    }
    if (requireAuth && this.tokenName) {
      const accessToken =
        token ?? (await anyStorageInstance.getItem(this.tokenName)) ?? "";
      allHeaders[this.authHeader] = `${this.authTokenPrefix} ${accessToken}`;
    }
    for (const key in allHeaders) {
      const element = allHeaders[key];
      headersInstance.set(key, element);
    }
    return headersInstance;
  }

  async uploadFileXhr(
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
      data: Record<string, string>;
      loadStartFunction?: XhrEventListener;
      onStateChange?: XhrStateChange;
      progressFunction: XhrEventListener;
      requireAuth: boolean;
      transferCompleteFunction?: XhrEventListener;
    },
  ): Promise<void> {
    const formData = getFormData(file, data);
    const headers = await this.getHeaders({
      headers: { [CONTENT_TYPE_HEADER]: CONTENT_TYPE_FORM },
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
          false,
        );
      }

      xhrObject.upload.addEventListener("progress", progressFunction, false);
      if (transferCompleteFunction) {
        xhrObject.upload.addEventListener(
          "load",
          transferCompleteFunction,
          false,
        );
      }

      // when an XHR object is opened, add a listener for its readystatechange events
      xhrObject.addEventListener("readystatechange", () => {
        if (onStateChange) {
          onStateChange(xhrObject.readyState, xhrObject);
        }
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        if (xhrObject.readyState !== 4) {
          return;
        }
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        if (xhrObject.status >= 300 || xhrObject.status < 200) {
          reject(new WoResponseError(xhrObject.response, xhrObject.status));
        }
        resolve();
      });

      xhrObject.open(
        "POST",
        createUrl(this.endpoint, path, {
          devProxy: this.devProxy,
          trailingSlash: this.trailingSlash,
        }),
        true,
      );
      for (const key of Object.keys(headers)) {
        xhrObject.setRequestHeader(key, headers.get(key) ?? "");
      }
      xhrObject.send(formData);
    });
  }
}

export class WoFetch extends WoFetchBase {
  deleteUrl = this.generateFetchMethod("DELETE");
  getUrl = this.generateFetchMethod("GET");
  patchUrl = this.generateFetchMethod("PATCH");
  postUrl = this.generateFetchMethod("POST");
  putUrl = this.generateFetchMethod("PUT");
}
