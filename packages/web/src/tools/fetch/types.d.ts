import type { SetRequired } from "type-fest";

import type { defaultErrorHandler } from "./errorHandlers.ts";

export type WoRequestMethod = "DELETE" | "GET" | "PATCH" | "POST" | "PUT";

export type WoRequestQueryValue = boolean | number | string | undefined;
export type WoRequestQuery = Record<
  string,
  WoRequestQueryValue | WoRequestQueryValue[]
>;
export type WoRequestData = FormData | object;

export type XhrEventListener = (
  this: XMLHttpRequestUpload,
  event: ProgressEvent<XMLHttpRequestEventTarget>,
) => void;
export type XhrStateChange = (
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
  responseHandler?: <TResponseData>(
    response: Response,
    errorHandler: typeof defaultErrorHandler,
  ) => Promise<TResponseData>;
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
