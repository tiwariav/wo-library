import { WoNetworkError, WoResponseError } from "../error/index.js";
import { CONTENT_TYPE_HEADER, CONTENT_TYPE_JSON } from "./constants.js";

async function getResponseData<TResponseData>(
  response: Response,
): Promise<TResponseData | string> {
  const contentType = response.headers.get(CONTENT_TYPE_HEADER);
  if (contentType && contentType.includes(CONTENT_TYPE_JSON)) {
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
    case 400: {
      throw new WoResponseError(responseData, response.status, "Invalid Data!");
    }
    case 401: {
      throw new WoResponseError(
        responseData,
        response.status,
        "Your session has expired!",
      );
    }
    case 403: {
      throw new WoResponseError(
        responseData,
        response.status,
        "You are not authorized to access this page!",
      );
    }
    case 404: {
      throw new WoResponseError(
        responseData,
        response.status,
        "Endpoint not found!",
      );
    }
    case 429: {
      throw new WoResponseError(
        responseData,
        response.status,
        "Too many requests!",
      );
    }
    case 500: {
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
