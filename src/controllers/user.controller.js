import prisma from "../lib/prisma.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";

class UserController {
  getProfile = asyncHandler(async (req, res) => {
    const userId = req.user;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    const filteredUser = {
      ...user,
      password: undefined,
      refreshToken: undefined,
    };
    return res
      .status(200)
      .json(
        ApiResponse.success(filteredUser, "User profile fetched successfully")
      );
  });

  updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user;
    const { id, password, email, ...rest } = req.body;
    if (id || password || email)
      throw ApiError.badRequest("Invalid update fields");
    const user = await prisma.user.update({
      where: { id: userId },
      data: rest,
    });
    const filteredUser = {
      ...user,
      password: undefined,
      refreshToken: undefined,
    };
    return res
      .status(200)
      .json(
        ApiResponse.success(filteredUser, "User profile updated successfully")
      );
  });

  deleteUser = asyncHandler(async (req, res) => {
    const userId = req.user;
    await prisma.user.delete({
      where: { id: userId },
    });
    return res
      .status(200)
      .json(ApiResponse.success({}, "User deleted successfully"));
  });

  changePassword = asyncHandler(async (req, res) => {
    const userId = req.user;
    const { oldPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
      throw ApiError.unauthorized("Incorrect old password");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
    return res
      .status(204)
      .json(ApiResponse.success({}, "Password changed successfully"));
  });

  getAllUsers = asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany();
    const filteredUsers = users.map((user) => ({
      ...user,
      password: undefined,
      refreshToken: undefined,
    }));
    return res
      .status(200)
      .json(
        ApiResponse.success(filteredUsers, "All users fetched successfully")
      );
  });
}

export default new UserController();
