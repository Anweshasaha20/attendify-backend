import rateLimit from "express-rate-limit";
import { ApiError } from "../utils/apiError.js";

// Define the rate limiter
const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `windowMs`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: ApiError.rateLimitExceeded(),
});

export { apiRateLimiter };