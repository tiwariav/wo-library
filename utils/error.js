export class WoNetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = "WoNetworkError";
  }
}

export class WoResponseError extends Error {
  constructor(message) {
    super(message);
    this.name = "WoResponseError";
  }
}

export class WoErrorData {
  constructor(error, data, message) {
    this.error = error;
    this.data = data;
    this.message = message;
  }
}
