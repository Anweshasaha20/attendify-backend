class ApiError extends Error {
  constructor(
    statusCode,
    message = "An unexpected error occurred.",
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
  static badRequest(
    message = "The request could not be understood or was missing required parameters.",
    errors = [],
    data = null
  ) {
    return new ApiError(400, message, errors, data);
  }

  static unauthorized(
    message = "Authentication is required or has failed.",
    errors = [],
    data = null
  ) {
    return new ApiError(401, message, errors, data);
  }

  static forbidden(
    message = "You do not have permission to access this resource.",
    errors = [],
    data = null
  ) {
    return new ApiError(403, message, errors, data);
  }

  static notFound(
    message = "The requested resource could not be found.",
    errors = [],
    data = null
  ) {
    return new ApiError(404, message, errors, data);
  }

  static validationError(
    message = "The request data is invalid or does not meet the required format.",
    errors = [],
    data = null
  ) {
    return new ApiError(422, message, errors, data);
  }

  static internalError(
    message = "An internal server error occurred. Please try again later.",
    errors = [],
    data = null
  ) {
    return new ApiError(500, message, errors, data);
  }

  static rateLimitExceeded(
    message = "Too many requests. Please try again later.",
    errors = [],
    data = null
  ) {
    return new ApiError(429, message, errors, data);
  }

  static conflict(
    message = "A conflict occurred. The resource already exists.",
    errors = [],
    data = null
  ) {
    return new ApiError(409, message, errors, data);
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

export default ApiError;
