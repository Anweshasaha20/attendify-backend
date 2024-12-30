import jwt from "jsonwebtoken";
import ApiResponse from "../utils/apiResponse.js";
import { JWT_SECRET } from "../secrets.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Middleware to verify and decode a JWT.
 * Attaches the decoded token data to `req.user` if valid.
 */
const verifyJWT = asyncHandler(async (req, res, next) => {
  // Extract the token from cookies or the Authorization header
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json(ApiResponse.error("Unauthorized - No token provided", 401));
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    // Attach user id data to the request object
    req.user = decodedToken.sub;
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json(ApiResponse.error("Unauthorized - Token has expired", 401));
    }

    // Generic error for invalid tokens
    return res
      .status(401)
      .json(ApiResponse.error("Unauthorized - Invalid token", 401));
  }
});

export default verifyJWT;
