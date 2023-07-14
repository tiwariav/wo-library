import { defaultErrorHandler } from "./errorHandlers.js";

export async function jsonResponseHandler<TResponseData = object>(
  response: Response,
  errorHandler: typeof defaultErrorHandler,
): Promise<TResponseData> {
  if (!response.ok) {
    // request not successful, call errorHandler with request param
    await errorHandler(response);
  }
  if (response.status === 204) {
    // no content
    return {} as TResponseData;
  }
  return (await response.json()) as TResponseData;
}

export async function textResponseHandler(
  response: Response,
  errorHandler: typeof defaultErrorHandler,
): Promise<string> {
  if (!response.ok) {
    // request not successful, call errorHandler with request param
    await errorHandler(response);
  }
  return await response.text();
}
