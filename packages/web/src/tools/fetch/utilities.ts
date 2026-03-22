import { pickBy } from "lodash-es";

import type { WoRequestData, WoRequestQuery, XhrStateChange } from "./types.js";

import { WoResponseError } from "../error/index.js";
import { CONTENT_TYPE_FORM, CONTENT_TYPE_HEADER } from "./constants.js";

/**
 * Wraps a `Blob` (and optional key/value metadata) in a `FormData` instance
 * for file upload requests.
 *
 * @param file - The file blob to upload.
 * @param data - Optional string key/value pairs to include in the form data.
 * @returns A `FormData` object ready for submission.
 */
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

/**
 * Joins a base URL and a relative URL, removing duplicate slashes.
 *
 * @param baseUrl - The base URL.
 * @param relativeUrl - The path to append.
 * @returns The combined URL string.
 */
export function combineUrls(baseUrl: string, relativeUrl?: string): string {
  const sanitizedBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const sanitizedRelativeUrl = relativeUrl?.startsWith("/")
    ? relativeUrl.slice(1)
    : relativeUrl;
  const combinedUrl = sanitizedRelativeUrl
    ? `${sanitizedBaseUrl}/${sanitizedRelativeUrl}`
    : sanitizedBaseUrl;
  return combinedUrl.endsWith("/") ? combinedUrl.slice(0, -1) : combinedUrl;
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
  resourcePath: string,
) {
  const baseUrl =
    apiEndpoint.startsWith("http:") || apiEndpoint.startsWith("https:")
      ? apiEndpoint
      : combineUrls(globalThis.location.origin, apiEndpoint);
  const resourceUrl = new URL(combineUrls(baseUrl, resourcePath));
  return resourceUrl;
}

interface CreateUrlOptions {
  devProxy?: string;
  id?: string;
  query?: WoRequestQuery;
  trailingSlash?: boolean;
}

/**
 * Builds a full `URL` from an API endpoint and path, applying optional query
 * parameters, resource ID, trailing slash, and dev proxy stripping.
 *
 * @param apiEndpoint - The base API endpoint.
 * @param path - The resource path.
 * @param options - URL construction options.
 * @returns A fully constructed `URL` object.
 */
export function createUrl(
  apiEndpoint: string,
  path: string,
  { devProxy, id, query, trailingSlash }: CreateUrlOptions = {},
): URL {
  const resourcePath = getResourcePath(path, devProxy);
  const resourceUrl =
    resourcePath.startsWith("http:") || resourcePath.startsWith("https:")
      ? new URL(combineUrls(resourcePath))
      : combineResourceUrl(apiEndpoint, resourcePath);
  if (id && !resourceUrl.pathname.endsWith("/")) {
    resourceUrl.pathname += `/${id}`;
  }
  updateResourceUrl(resourceUrl, query, trailingSlash);
  return resourceUrl;
}

/**
 * Creates a `Headers` or `Map<string, string>` instance depending on whether
 * the request is XHR-based or fetch-based.
 *
 * @param xhr - Whether the request uses XMLHttpRequest.
 * @param allHeaders - Key/value header pairs.
 * @returns A `Headers` instance (fetch) or `Map` (XHR).
 */
export function getHeaderInstance(
  xhr: boolean,
  allHeaders: Record<string, string>,
) {
  const headersInstance = xhr ? new Map<string, string>() : new Headers();
  for (const key in allHeaders) {
    const element = allHeaders[key];
    headersInstance.set(key, element);
  }
  return headersInstance;
}

/**
 * Returns an event handler for `XMLHttpRequest.onreadystatechange` that
 * resolves or rejects a promise based on the final status code.
 *
 * @param options - The XHR object, optional state change callback, and
 *   promise resolve/reject functions.
 * @returns An event handler function.
 */
export function handleReadyStateChange({
  onStateChange,
  reject,
  resolve,
  xhrObject,
}: {
  onStateChange?: XhrStateChange;
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

/**
 * Prepares the request body for `fetch`. Serialises to JSON unless the
 * content type is multipart form data.
 *
 * @param requestHeaders - The request headers (used to check content type).
 * @param data - The request payload.
 * @returns The body to pass to `fetch`.
 */
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