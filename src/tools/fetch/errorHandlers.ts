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

export async function defaultErrorHandler<TResponseData>(
  response?: Response,
  error?: unknown,
): Promise<void> {
  if (!response || error) {
    throw new WoNetworkError("Network Error!");
  }
  // handle error depending on http response status codes
  const responseData = await getResponseData<TResponseData>(response);
  switch (response.status) {
    case HTTP_STATUS.badRequest: {
      throw new WoResponseError(responseData, response.status, "Invalid Data!");
    }
    case HTTP_STATUS.unauthorized: {
      throw new WoResponseError(
        responseData,
        response.status,
        "Your session has expired!",
      );
    }
    case HTTP_STATUS.forbidden: {
      throw new WoResponseError(
        responseData,
        response.status,
        "You are not authorized to access this page!",
      );
    }
    case HTTP_STATUS.notFound: {
      throw new WoResponseError(
        responseData,
        response.status,
        "Endpoint not found!",
      );
    }
    case HTTP_STATUS.tooManyRequests: {
      throw new WoResponseError(
        responseData,
        response.status,
        "Too many requests!",
      );
    }
    case HTTP_STATUS.internalServerError: {
      throw new WoResponseError(
        responseData,
        response.status,
        "Internal server error!",
      );
    }
    default: {
      throw new WoResponseError(
        responseData,
        response.status,
        "Unhandled error!",
      );
    }
  }
}
