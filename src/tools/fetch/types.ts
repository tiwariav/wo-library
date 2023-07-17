import { defaultErrorHandler } from "./errorHandlers.js";
import { jsonResponseHandler } from "./responseHandlers.js";

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

export interface FetchOptions<
  DataType = WoRequestData,
  QueryType = WoRequestQuery,
> {
  credentials?: RequestCredentials;
  data?: DataType;
  errorHandler?: typeof defaultErrorHandler;
  headers?: Record<string, string>;
  id?: string;
  noProxy?: boolean;
  query?: QueryType;
  requireAuth?: boolean;
  responseHandler?: typeof jsonResponseHandler;
  token?: string;
  trailingSlash?: boolean;
}

export type FetchData<DataType, QueryType = WoRequestQuery> = FetchOptions<
  DataType,
  QueryType
>;
export type FetchQuery<QueryType, DataType = WoRequestData> = FetchOptions<
  DataType,
  QueryType
>;
