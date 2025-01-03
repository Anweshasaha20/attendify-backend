import ApiError from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import prisma from "../lib/prisma";
import { sessionSchema } from "../validators/session.validator";
class sessionController {
  getClassSessions = asyncHandler(async (req, res) => {
    const { classId } = req.params;
    const userId = req.user;
    // validate
    if (!classId) throw ApiError.badRequest("Class ID is required");
    if (!userId) throw ApiError.unauthorized("Login to create a session");

    // check if user is admin of the class
    const classAdmin = await prisma.class.findFirst({
      where: {
        id: classId,
        include: {
          admins: {
            where: {
              userId,
            },
          },
        },
      },
    });

    if (!classAdmin)
      throw ApiError.unauthorized("You are not an admin of this class");

    // get sessions
    const sessions = await prisma.session.findMany({
      where: {
        classId,
      },
    });

    return res.status(200).json(ApiResponse.success(res, sessions));
  });

  createSession = asyncHandler(async (req, res) => {
    const { classId } = req.params;
    const userId = req.user;
    if (!classId) throw ApiError.badRequest("Class ID is required");
    if (!userId) throw ApiError.unauthorized("Login to create a session");

    // check if user is admin of the class
    const classAdmin = await prisma.class.findFirst({
      where: {
        id: classId,
        include: {
          admins: {
            where: {
              userId,
            },
          },
        },
      },
    });

    if (!classAdmin)
      throw ApiError.unauthorized("You are not an admin of this class");

    // validate request
    const { error } = sessionSchema.validate(req.body);
    if (error) throw ApiError.badRequest(error.message);

    const response = await prisma.session.create({
      data: {
        ...req.body,
        endTime: new Date(now()+req.body.duration * 60000),
        class: {
          connect: {
            id: classId,
          },
        },
      },
    });

    return res
      .status(201)
      .json(ApiResponse.success(response, "Session created successfully"));
  });

  updateSession = asyncHandler(async (req, res) => {
    const { classId, sessionId } = req.params;
    const userId = req.user;
    if (!classId) throw ApiError.badRequest("Class ID is required");
    if (!userId) throw ApiError.unauthorized("Login to create a session");

    // check if user is admin of the class
    const classAdmin = await prisma.class.findFirst({
      where: {
        id: classId,
        include: {
          admins: {
            where: {
              userId,
            },
          },
        },
      },
    });

    if (!classAdmin)
      throw ApiError.unauthorized("You are not an admin of this class");

    // validate request
    const { error } = sessionSchema.validate(req.body);
    if (error) throw ApiError.badRequest(error.message);

    const response = await prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        ...req.body,
      },
    });

    return res
      .status(200)
      .json(ApiResponse.success(response, "Session updated successfully"));
  });

  deleteSession = asyncHandler(async (req, res) => {
    const { classId, sessionId } = req.params;
    const userId = req.user;
    if (!classId) throw ApiError.badRequest("Class ID is required");
    if (!userId) throw ApiError.unauthorized("Login to create a session");

    // check if user is admin of the class
    const classAdmin = await prisma.class.findFirst({
      where: {
        id: classId,
        include: {
          admins: {
            where: {
              userId,
            },
          },
        },
      },
    });

    if (!classAdmin)
      throw ApiError.unauthorized("You are not an admin of this class");

    const response = await prisma.session.delete({
      where: {
        id: sessionId,
      },
    });

    return res
      .status(200)
      .json(ApiResponse.success(response, "Session deleted successfully"));
  });
}

export default new sessionController();
