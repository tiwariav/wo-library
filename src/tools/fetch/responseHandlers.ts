import type { defaultErrorHandler } from "./errorHandlers.js";

import { HTTP_STATUS } from "./constants.js";

export async function jsonResponseHandler<TResponseData = object>(
  response: Response,
  errorHandler: typeof defaultErrorHandler,
): Promise<TResponseData> {
  if (!response.ok) {
    // request not successful, call errorHandler with request param
    await errorHandler<TResponseData>(response);
  }
  if (response.status === HTTP_STATUS.noContent) {
    // no content
    return {} as TResponseData;
  }
  return (await response.json()) as TResponseData;
}

export async function textResponseHandler<TResponseData = string>(
  response: Response,
  errorHandler: typeof defaultErrorHandler,
): Promise<TResponseData> {
  if (!response.ok) {
    // request not successful, call errorHandler with request param
    await errorHandler(response);
  }
  return (await response.text()) as TResponseData;
}
