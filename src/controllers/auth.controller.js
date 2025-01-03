import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import prisma from "../lib/prisma.js";
import ApiError from "../utils/apiError.js";
import { registerSchema } from "../validators/auth.validator.js"; // Import the validation schema
import bcrypt from "bcrypt";
import { generateTokens, generateAccessToken } from "../utils/jwtUtils.js"; // Import JWT functions

const cookieOptions = {
  httpOnly: true,
  secure: true,
};
class AuthController {
  register = asyncHandler(async (req, res) => {
    // Validate the request body
    const validationResult = registerSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors.map(
        (err) => err.message,
      );
      throw ApiError.badRequest(errorMessages.join(", "));
    }

    const { email, username, password } = req.body;

    // Check if user already exists (either by email or username)
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
      },
    });

    if (existingUser) {
      throw ApiError.conflict("User already exists");
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        ...req.body,
        password: hashedPassword,
      },
    });

    // Generate JWT tokens
    const { accessToken, refreshToken } = await generateTokens(newUser.id);

    const filteredUser = { ...newUser, password: undefined };

    // Return the user data without the password
    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(201)
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json(ApiResponse.success(filteredUser, "User created successfully"));
  });

  login = asyncHandler(async (req, res) => {
    const { email, password, rememberForAMonth } = req.body;

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw ApiError.unauthorized("Invalid credentials");
    }

    // Generate JWT tokens
    const { accessToken, refreshToken } = await generateTokens(
      user.id,
      rememberForAMonth === true,
    );

    const filteredUser = {
      ...user,
      password: undefined,
      refreshToken: undefined,
    };

    // Return the user data without the password

    res
      .cookie("refreshToken", refreshToken, cookieOptions)
      .cookie("accessToken", accessToken, cookieOptions)
      .json(ApiResponse.success(filteredUser, "User logged in successfully"));
  });

  logout = asyncHandler(async (req, res) => {
    // Clear the cookies
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    res
      .status(204)
      .json(ApiResponse.success({}, "User logged out successfully", 204));
  });

  refreshToken = asyncHandler(async (req, res) => {
    // Get the refresh token from the cookie
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw ApiError.unauthorized("Not authenticated");
    // Generate a new access token
    const accessToken = await generateAccessToken(refreshToken);
    res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .json(ApiResponse.success({ accessToken }));
  });
}

export default new AuthController();
