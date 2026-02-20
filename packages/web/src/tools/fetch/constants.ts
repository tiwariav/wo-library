/** Standard HTTP header name for content type. */
export const CONTENT_TYPE_HEADER = "content-type";

/** Default storage key used to store the auth access token. */
export const ACCESS_TOKEN_KEY = "wo:authToken";

/** MIME type for multipart form data uploads. */
export const CONTENT_TYPE_FORM = "multipart/form-data";

/** MIME type for JSON request/response bodies. */
export const CONTENT_TYPE_JSON = "application/json";

/** Common HTTP status codes used by the fetch module. */
/* eslint-disable perfectionist/sort-objects */
export const HTTP_STATUS = {
  created: 201,
  ok: 200,
  noContent: 204,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  tooManyRequests: 429,
  internalServerError: 500,
};
/* eslint-enable perfectionist/sort-objects */
