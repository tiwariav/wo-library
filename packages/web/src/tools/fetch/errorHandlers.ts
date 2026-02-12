import { WoNetworkError, WoResponseError } from "../error/index.js";
import {
  CONTENT_TYPE_HEADER,
  CONTENT_TYPE_JSON,
  HTTP_STATUS,
} from "./constants.js";

export async function getResponseData<TResponseData>(
  response: Response,
): Promise<TResponseData | string> {
  const contentType = response.headers.get(CONTENT_TYPE_HEADER);
  if (contentType?.includes(CONTENT_TYPE_JSON)) {
    try {
      return (await response.json()) as TResponseData;
    } catch (error) {
      if (!(error instanceof SyntaxError)) {
        throw error;
      }
    }
  }
  return response.text();
}

const ERROR_MESSAGES = {
  [HTTP_STATUS.badRequest]: "Invalid Data!",
  [HTTP_STATUS.forbidden]: "You are not authorized to access this page!",
  [HTTP_STATUS.internalServerError]: "Internal server error!",
  [HTTP_STATUS.notFound]: "Endpoint not found!",
  [HTTP_STATUS.tooManyRequests]: "Too many requests!",
  [HTTP_STATUS.unauthorized]: "Your session has expired!",
};

export async function defaultErrorHandler<TResponseData>(
  response?: Response,
  error?: unknown,
): Promise<void> {
  if (!response || error) {
    throw new WoNetworkError("Network Error!");
  }
  // handle error depending on http response status codes
  const responseData = await getResponseData<TResponseData>(response);
  const errorMessage = ERROR_MESSAGES[response.status] ?? "Unhandled error!";
  throw new WoResponseError(responseData, response.status, errorMessage);
}
