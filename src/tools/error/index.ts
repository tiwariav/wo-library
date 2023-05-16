export class WoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WoError";
  }
}

export class WoLoadScriptError extends WoError {
  constructor(message: string) {
    super(message);
    this.name = "WoLoadScriptError";
  }
}

export class WoNetworkError extends WoError {
  constructor(message: string) {
    super(message);
    this.name = "WoNetworkError";
  }
}

export class WoResponseError extends WoError {
  data: unknown;

  constructor(data: object, message = "Response Error!") {
    super(message);
    this.name = "WoResponseError";
    this.data = data;
  }
}
