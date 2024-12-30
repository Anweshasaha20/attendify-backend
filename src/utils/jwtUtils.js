import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import ApiError from "./apiError.js";
import { JWT_SECRET, JWT_REFRESH_SECRET } from "../secrets.js";

export const generateTokens = async (userId, rememberForAMonth = false) => {
  try {
    const accessToken = jwt.sign({ sub: userId }, JWT_SECRET, {
      expiresIn: "1d",
    });

    if (!rememberForAMonth) {
      return { accessToken };
    }

    const refreshToken = jwt.sign({ sub: userId }, JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });

    // save the refresh token in the database
    const result = await prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });

    return { accessToken, refreshToken };
  } catch (err) {
    console.error("Error in the generateTokens function: ", err.message);
    throw ApiError.internalError("Token generation failed");
  }
};

export const generateAccessToken = async (refreshToken) => {
  try {
    const { sub: userId } = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    if (!userId) {
      throw ApiError.unauthorized("Invalid refresh token");
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw ApiError.unauthorized("Invalid refresh token found");
    }

    const accessToken = jwt.sign({ sub: userId }, JWT_SECRET, {
      expiresIn: "1d",
    });

    return accessToken;
  } catch (err) {
    console.error("Error in the generateAccessToken function: ", err.message);
    throw ApiError.unauthorized("Invalid refresh token");
  }
};
