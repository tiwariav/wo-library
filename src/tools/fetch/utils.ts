import { pickBy } from "lodash-es";

import type { WoRequestData, WoRequestQuery, XHRStateChange } from "./types.js";

import { WoResponseError } from "../error/index.js";
import { CONTENT_TYPE_FORM, CONTENT_TYPE_HEADER } from "./constants.js";

export function getFormData(
  file: Blob,
  data?: Record<string, string>,
): FormData {
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

function updateResourceUrl(
  resourceUrl: URL,
  query?: WoRequestQuery,
  trailingSlash?: boolean,
) {
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
}

function getResourcePath(path: string, devProxy?: string) {
  if (devProxy && path.startsWith(devProxy)) {
    return path.replace(devProxy, "");
  }
  return path;
}

function combineResourceUrl(
  apiEndpoint: string,
  baseUrl: string,
  resourcePath: string,
) {
  if (!(apiEndpoint.startsWith("http:") || apiEndpoint.startsWith("https:"))) {
    baseUrl = combineUrls(window.location.origin, apiEndpoint);
  }
  const resourceUrl = new URL(combineUrls(baseUrl, resourcePath));
  return { baseUrl, resourceUrl };
}

interface CreateUrlOptions {
  devProxy?: string;
  id?: string;
  query?: WoRequestQuery;
  trailingSlash?: boolean;
}

export function createUrl(
  apiEndpoint: string,
  path: string,
  { devProxy, id, query, trailingSlash }: CreateUrlOptions = {},
): URL {
  let baseUrl = apiEndpoint;
  const resourcePath = getResourcePath(path, devProxy);
  let resourceUrl: URL;
  if (resourcePath.startsWith("http:") || resourcePath.startsWith("https:")) {
    resourceUrl = new URL(combineUrls(resourcePath));
  } else {
    ({ baseUrl, resourceUrl } = combineResourceUrl(
      apiEndpoint,
      baseUrl,
      resourcePath,
    ));
  }
  if (id && !resourceUrl.pathname.endsWith("/")) {
    resourceUrl.pathname += `/${id}`;
  }
  updateResourceUrl(resourceUrl, query, trailingSlash);
  return resourceUrl;
}

export function getHeaderInstance(
  xhr: boolean,
  allHeaders: Record<string, string>,
) {
  const headersInstance = xhr ? new Map() : new Headers();
  for (const key in allHeaders) {
    const element = allHeaders[key];
    headersInstance.set(key, element);
  }
  return headersInstance;
}

export function handleReadyStateChange({
  onStateChange,
  reject,
  resolve,
  xhrObject,
}: {
  onStateChange?: XHRStateChange;
  reject: (reason?: WoResponseError<object>) => void;
  resolve: (value: PromiseLike<void> | void) => void;
  xhrObject: XMLHttpRequest;
}): (this: XMLHttpRequest, event_: Event) => void {
  return () => {
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
  };
}

export function getFetchBody(
  requestHeaders: Headers | Map<string, string>,
  data?: WoRequestData,
) {
  let body: FormData | RequestInit["body"];
  if (data) {
    body =
      requestHeaders.get(CONTENT_TYPE_HEADER) === CONTENT_TYPE_FORM
        ? (data as FormData)
        : JSON.stringify(data);
  }
  return body;
}
