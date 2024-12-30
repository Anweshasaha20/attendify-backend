import jwt from "jsonwebtoken";
import ApiResponse from "../utils/apiResponse.js";
import { JWT_SECRET } from "../secrets.js";
import asyncHandler from "../utils/asyncHandler.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
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
    req.user = decodedToken;
    next();
  } catch (error) {
    return res
      .status(401)
      .json(ApiResponse.error("Unauthorized - Invalid token", 401));
  }
});

export { verifyJWT };
