class ApiResponse {
  constructor({
    data = null,
    message = "Success",
    status = 200,
    success = true,
    meta = null,
    timestamp = new Date().toLocaleString(),
  } = {}) {
    this.statusCode = status;
    this.success = success;
    this.message = message;
    this.data = data;
    this.meta = meta;
    this.timestamp = timestamp;
  }

  static success(data = null, message = "Success", meta = null) {
    return new ApiResponse({ data, message, status: 200, success: true, meta });
  }

  static error(
    message = "An unexpected error occurred",
    status = 500,
    meta = null
  ) {
    return new ApiResponse({
      data: null,
      message:
        process.env.NODE_ENV === "development"
          ? message
          : "An unexpected error occurred. Please try again later.",
      status,
      success: false,
      meta,
    });
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      success: this.success,
      message: this.message,
      data: this.data,
      ...(this.meta && { meta: this.meta }),
      timestamp: this.timestamp,
    };
  }
}

export default ApiResponse;
