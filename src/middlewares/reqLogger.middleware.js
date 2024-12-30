import os from "os";

const reqLogger = (req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    // Attach the request time to the request object
    req.requestTime = new Date().toLocaleString();

    // Structure the detailed request report
    const requestReport = {
      request: {
        timestamp: req.requestTime,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      },
      details: {
        headers: req.headers,
        queryParameters: req.query,
        routeParameters: req.params,
        body: req.body,
      },
      server: {
        hostname: os.hostname(),
        environment: process.env.NODE_ENV || "development",
      },
    };

    // Log the structured request report
    console.log("========== Incoming Request ==========");
    console.log(JSON.stringify(requestReport, null, 2));
    console.log("======================================");
  }

  // Proceed to the next middleware or route handler
  next();
};

export default reqLogger;