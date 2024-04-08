import type { SetRequired } from "type-fest";

import { merge } from "lodash-es";

import type {
  FetchOptions,
  WoRequestMethod,
  XhrEventListener,
  XhrStateChange,
} from "./types.js";

import { anyStorageInstance } from "../storage/index.js";
import {
  ACCESS_TOKEN_KEY,
  CONTENT_TYPE_FORM,
  CONTENT_TYPE_HEADER,
  CONTENT_TYPE_JSON,
} from "./constants.js";
import { defaultErrorHandler } from "./errorHandlers.js";
import { jsonResponseHandler } from "./responseHandlers.js";
import {
  createUrl,
  getFetchBody,
  getFormData,
  getHeaderInstance,
  handleReadyStateChange,
} from "./utils.js";

interface UploadXhrOptions {
  data: Record<string, string>;
  loadStartFunction?: XhrEventListener;
  onStateChange?: XhrStateChange;
  progressFunction: XhrEventListener;
  requireAuth: boolean;
  transferCompleteFunction?: XhrEventListener;
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
      query,
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
    try {
      const response = await fetch(url.toString(), {
        body: getFetchBody(requestHeaders, data),
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
    const allHeaders: Record<string, string> = merge({}, headers);
    if (!(CONTENT_TYPE_HEADER in allHeaders)) {
      allHeaders[CONTENT_TYPE_HEADER] = CONTENT_TYPE_JSON;
    }
    if (requireAuth && this.tokenName) {
      const accessToken =
        token ?? (await anyStorageInstance.getItem(this.tokenName)) ?? "";
      allHeaders[this.authHeader] = `${this.authTokenPrefix} ${accessToken}`;
    }
    return getHeaderInstance(xhr, allHeaders);
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
    }: UploadXhrOptions,
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

      xhrObject.addEventListener(
        "readystatechange",
        handleReadyStateChange({ onStateChange, reject, resolve, xhrObject }),
      );

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
