/**
 * Base error class for all `@wo-library/web` errors.
 */
export class WoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WoError";
  }
}

/**
 * Error thrown when a dynamically loaded script fails to load.
 */
export class WoLoadScriptError extends WoError {
  constructor(message: string) {
    super(message);
    this.name = "WoLoadScriptError";
  }
}

/**
 * Error thrown when a network request fails entirely (no response).
 */
export class WoNetworkError extends WoError {
  constructor(message: string) {
    super(message);
    this.name = "WoNetworkError";
  }
}

/**
 * Error thrown when a server response indicates failure.
 * Carries the response `data` and HTTP `status` code.
 *
 * @typeParam TData - The shape of the response body.
 */
export class WoResponseError<TData> extends WoError {
  data: TData;
  status: number;

  constructor(data: TData, status: number, message = "Response Error!") {
    super(message);
    this.name = "WoResponseError";
    this.data = data;
    this.status = status;
  }
}
