class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    data = null,
    stack = ""
  ) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.success = false;
    this.message = message;
    this.errors = errors;
    this.data = data;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // Factory methods for common error types
  static badRequest(message = "Bad Request", errors = [], data = null) {
    return new ApiError(400, message, errors, data);
  }

  static unauthorized(message = "Unauthorized", errors = [], data = null) {
    return new ApiError(401, message, errors, data);
  }

  static forbidden(message = "Forbidden", errors = [], data = null) {
    return new ApiError(403, message, errors, data);
  }

  static notFound(message = "Resource Not Found", errors = [], data = null) {
    return new ApiError(404, message, errors, data);
  }

  static validationError(
    message = "Validation Error",
    errors = [],
    data = null
  ) {
    return new ApiError(422, message, errors, data);
  }

  static internalError(
    message = "Internal Server Error",
    errors = [],
    data = null
  ) {
    return new ApiError(500, message, errors, data);
  }

  static rateLimitExceeded(message = "Too many requests, please try again after 15 minutes.", errors = [], data = null) {
    return new ApiError(429, message, errors, data);
  }

  // Converts the error object to a JSON response
  toJSON() {
    return {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      ...(this.errors.length > 0 && { errors: this.errors }),
      ...(this.data && { data: this.data }),
      ...(process.env.NODE_ENV === "development" && { stack: this.stack }),
    };
  }
}

export { ApiError };
