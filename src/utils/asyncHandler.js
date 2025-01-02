import ApiResponse from "./apiResponse.js";

const asyncHandler = (asyncFn) => {
  return async (req, res, next) => {
    try {
      await asyncFn(req, res, next);
    } catch (error) {
      const errorDetails = {
        message: error.message || "An unexpected error occurred",
        statusCode: error.statusCode || 500,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        request: {
          method: req.method,
          url: req.originalUrl,
          headers: req.headers,
          body: req.body,
          query: req.query,
          params: req.params,
        },
        timestamp: new Date().toISOString(),
      };

      console.error(JSON.stringify(errorDetails, null, 2));

      return res
        .status(errorDetails.statusCode)
        .json(
          ApiResponse.error(
            errorDetails.message,
            errorDetails.statusCode,
            errorDetails.stack
          )
        );
    }
  };
};

export default asyncHandler;
