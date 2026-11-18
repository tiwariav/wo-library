/**
 * Generic HTTP-oriented error classes (framework-agnostic).
 */

/* eslint-disable @typescript-eslint/no-magic-numbers -- HTTP status codes */
/* eslint-disable lodash/prefer-lodash-typecheck -- keep guards dependency-light */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public code?: string;
  public body?: Record<string, unknown>;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}

export class UnsupportedMediaTypeError extends AppError {
  constructor(message = "Unsupported file type") {
    super(message, 415);
  }
}

export function isHttpError(
  error: unknown,
): error is { message: string; statusCode: number } {
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof error.statusCode === "number"
  );
}

/** Machine-readable extras (`code` + `body`) from an `AppError`. */
export function errorExtras(error: unknown): Record<string, unknown> {
  if (!(error instanceof AppError)) {
    return {};
  }
  return {
    ...error.body,
    ...(error.code && { code: error.code }),
  };
}
