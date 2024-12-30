import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

class UserController {
  getAllUsers = asyncHandler(async (req, res) => {
    // TODO: Implement get all users logic
    //send meta data
    // if(!req.user){
    //   throw new ApiError(401, "Unauthorized");
    // }
    return res.json(
      ApiResponse.success(
        { users: [{ user: "admin", email: "admin@123" }] },
        "Users retrieved successfully",
        { total: 1 }
      )
    );
  });

  getProfile = asyncHandler(async (req, res) => {
    // TODO: Implement get profile logic
    // Example: Fetch user profile from database using req.user.id
    return res
      .status(200)
      .json(ApiResponse({ user: {} }, "Profile retrieved successfully"));
  });

  updateProfile = asyncHandler(async (req, res) => {
    // TODO: Implement update profile logic
    // Example: Update user profile in database using req.user.id and req.body
    return res
      .status(200)
      .json(ApiResponse({ user: {} }, "Profile updated successfully"));
  });

  deleteUser = asyncHandler(async (req, res) => {
    // TODO: Implement delete user logic
    // Example: Delete user from database using req.user.id
    return res.status(200).json(ApiResponse(null, "User deleted successfully"));
  });
}

export default new UserController();
