import { SetRequired } from "type-fest";

import { defaultErrorHandler } from "./errorHandlers.js";

export type WoRequestMethod = "DELETE" | "GET" | "PATCH" | "POST" | "PUT";

export type WoRequestQueryValue = boolean | number | string;
export type WoRequestQuery = Record<
  string,
  WoRequestQueryValue | WoRequestQueryValue[]
>;
export type WoRequestData = FormData | object;

export type XHREventListener = (
  this: XMLHttpRequestUpload,
  event: ProgressEvent<XMLHttpRequestEventTarget>,
) => void;
export type XHRStateChange = (
  state: XMLHttpRequest["readyState"],
  xhrObject: XMLHttpRequest,
) => void;

export interface FetchOptions<TData = WoRequestData, TQuery = WoRequestQuery> {
  credentials?: RequestCredentials;
  data?: TData;
  errorHandler?: typeof defaultErrorHandler;
  headers?: Record<string, string>;
  id?: string;
  noProxy?: boolean;
  query?: TQuery;
  requireAuth?: boolean;
  responseHandler?: <TData>(
    response: Response,
    errorHandler: typeof defaultErrorHandler,
  ) => Promise<TData>;
  token?: string;
  trailingSlash?: boolean;
}

export type FetchData<TData, TQuery = WoRequestQuery> = SetRequired<
  FetchOptions<TData, TQuery>,
  "data"
>;
export type FetchQuery<TQuery, TData = WoRequestData> = SetRequired<
  FetchOptions<TData, TQuery>,
  "query"
>;
