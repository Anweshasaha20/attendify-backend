import crypto from "crypto";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import prisma from "../lib/prisma.js";
import ApiError from "../utils/apiError.js";
import { classSchema } from "../validators/class.validator.js";

class ClassController {
  create = asyncHandler(async (req, res) => {
    const { error } = classSchema.safeParse(req.body);
    if (error) {
      throw new ApiError(400, error.message);
    }

    const { name, description } = req.body;
    const userId = req.user;

    const code = crypto.randomBytes(3).toString("hex").toUpperCase();

    const newClass = await prisma.class.create({
      data: {
        name,
        description,
        code,
        admins: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return res
      .status(201)
      .json(ApiResponse.success(newClass, "Class created successfully"));
  });

  requestToJoin = asyncHandler(async (req, res) => {
    const { code } = req.body;
    const userId = req.user;

    const classDetails = await prisma.class.findFirst({
      where: {
        code,
      },
    });

    if (!classDetails) {
      throw new ApiError(404, "Class not found");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // push request to join class in the joinRequest table
    await prisma.joinRequest.create({
      data: {
        classId: classDetails.id,
        userId,
      },
    });

    return res
      .status(200)
      .json(ApiResponse.success({}, "Request to join class sent"));
  });
}

export default new ClassController();
