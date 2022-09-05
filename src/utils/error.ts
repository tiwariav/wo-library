export class WoLoadScriptError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WoLoadScriptError";
  }
}

export class WoReactInvalidProps extends Error {
  constructor(
    propFullName: string,
    componentName: string,
    additionalHelp = ""
  ) {
    const message = `Invalid prop \`${propFullName}\` supplied to \`${componentName}\`. ${additionalHelp}`;
    super(message);
    this.name = "WoReactInvalidProps";
  }
}

export class WoNetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WoNetworkError";
  }
}

export class WoResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WoResponseError";
  }
}

export class WoErrorData {
  error: Error;
  data: any;
  message: string;

  constructor(error: Error, data: Response, message: string) {
    this.error = error;
    this.data = data;
    this.message = message;
  }
}
