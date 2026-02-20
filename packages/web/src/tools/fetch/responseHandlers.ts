import type { defaultErrorHandler } from "./errorHandlers.js";

import { HTTP_STATUS } from "./constants.js";

/**
 * Handles a successful JSON response. Delegates to `errorHandler` if the
 * response is not OK. Returns an empty object for 204 No Content.
 *
 * @typeParam TResponseData - Expected shape of the JSON response body.
 * @param response - The `Response` object from `fetch`.
 * @param errorHandler - Error handler to call when `response.ok` is false.
 * @returns The parsed JSON body.
 */
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

/**
 * Handles a successful plain-text response. Delegates to `errorHandler` if the
 * response is not OK.
 *
 * @typeParam TResponseData - Expected return type (defaults to `string`).
 * @param response - The `Response` object from `fetch`.
 * @param errorHandler - Error handler to call when `response.ok` is false.
 * @returns The response body as text.
 */
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
