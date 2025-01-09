import crypto from "crypto";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import prisma from "../lib/prisma.js";
import { sessionSchema } from "../validators/session.validator.js";
import { time } from "console";
import { start } from "repl";
class sessionController {
  getClassSessions = asyncHandler(async (req, res) => {
    const { classId } = req.params;
    const userId = req.user;
    // validate
    if (!classId) throw ApiError.badRequest("Class ID is required");
    if (!userId) throw ApiError.unauthorized("Login to create a session");

    // check if user is admin of the class
    const classDetails = await prisma.class.findFirst({
      where: {
        id: classId,
      },
      include: {
        admins: true,
      },
    });

    if (!classDetails) {
      throw ApiError.notFound("Class not found");
    }

    //check if user is an admin of the class
    const isAdmin = classDetails.admins.find((admin) => admin.id === userId);
    console.log(userId);
    console.log(isAdmin);

    if (!isAdmin)
      throw ApiError.unauthorized("You are not an admin of this class");

    // get sessions
    const sessions = await prisma.session.findMany({
      where: {
        classId,
      },
    });

    return res
      .status(200)
      .json(ApiResponse.success(sessions, `${sessions.length} Sessions found`));
  });

  createSession = asyncHandler(async (req, res) => {
    const { classId } = req.params;
    const userId = req.user;
    if (!classId) throw ApiError.badRequest("Class ID is required");
    if (!userId) throw ApiError.unauthorized("Login to create a session");

    // check if user is admin of the class
    const classDetails = await prisma.class.findFirst({
      where: {
        id: classId,
      },
      include: {
        admins: true,
      },
    });

    if (!classDetails) {
      throw ApiError.notFound("Class not found");
    }

    const isAdmin = classDetails.admins.find((admin) => admin.id === userId);
    console.log(userId);
    console.log(isAdmin);

    if (!isAdmin)
      throw ApiError.unauthorized("You are not an admin of this class");

    // validate request
    const parsed = sessionSchema.safeParse(req.body);
    if (!parsed.success) throw ApiError.badRequest(parsed.error.message);

    // Set default startTime to now if not provided
    const { startTime, duration, ...rest } = req.body;
    const currentStartTime = startTime ? new Date(startTime) : new Date();
    const response = await prisma.session.create({
      data: {
        ...rest,
        startTime: currentStartTime,
        duration: duration,
        endTime: new Date(
          new Date(currentStartTime).getTime() + duration * 60000
        ),

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
    const classDetails = await prisma.class.findFirst({
      where: {
        id: classId,
      },
      include: {
        admins: true,
      },
    });

    if (!classDetails) {
      throw ApiError.notFound("Class not found");
    }

    const isAdmin = classDetails.admins.find((admin) => admin.id === userId);
    console.log(userId);
    console.log(isAdmin);

    if (!isAdmin)
      throw ApiError.unauthorized("You are not an admin of this class");

    // validate request
    const { error } = sessionSchema.safeParse(req.body);
    if (error) throw ApiError.badRequest(error.message);

    const { startTime } = req.body; //checking if startTime is provided

    const response = await prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        ...req.body,

        endTime:
          startTime &&
          new Date(
            new Date(req.body.startTime).getTime() + req.body.duration * 60000
          ),
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
    const classDetails = await prisma.class.findFirst({
      where: {
        id: classId,
      },
      include: {
        admins: true,
      },
    });

    if (!classDetails) {
      throw ApiError.notFound("Class not found");
    }

    const isAdmin = classDetails.admins.find((admin) => admin.id === userId);
    console.log(userId);
    console.log(isAdmin);

    if (!isAdmin)
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

  // Create OTP for attendance
  createOTP = asyncHandler(async (req, res) => {
    const { classId, sessionId } = req.params;
    const userId = req.user;
    console.log(userId);

    if (!classId || !sessionId)
      throw ApiError.badRequest("Class ID and Session ID are required");
    if (!userId) throw ApiError.unauthorized("Login to create an OTP");

    // Check if user is an admin of the class
    const classAdmin = await prisma.class.findFirst({
      where: {
        id: classId,
        admins: {
          some: { id: userId },
        },
      },
    });

    if (!classAdmin)
      throw ApiError.unauthorized("You are not an admin of this class");

    // Generate OTP
    const otp = crypto.randomBytes(2).toString("hex").toUpperCase(); // 4-character OTP

    const attendanceValidity = 5; // OTP valid for 5 minutes

    // Update session with attendance start time and OTP validity
    const session = await prisma.session.update({
      where: { id: sessionId },
      data: {
        AttendanceStart: new Date(),
        AttendanceValidity: attendanceValidity,
        AttendanceEnd: new Date(Date.now() + attendanceValidity * 60000),
        OTP: otp,
      },
    });

    // if (!session)
    //   throw ApiError.notFound("Session not found or could not be updated");

    console.log(otp);

    // Send OTP as response
    return res
      .status(201)
      .json(ApiResponse.success(session, "OTP created successfully"));
  });

  verifyOTP = asyncHandler(async (req, res) => {
    const { classId, sessionId } = req.params;
    const { otp } = req.body;
    const userId = req.user;

    if (!classId || !sessionId) {
      throw ApiError.badRequest("Class ID and Session ID are required");
    }
    if (!otp) {
      throw ApiError.badRequest("OTP is required");
    }
    if (!userId) {
      throw ApiError.unauthorized("Login to mark attendance");
    }

    // Check if session exists and validate OTP
    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        classId,
        OTP: otp,
      },
    });

    if (!session) {
      throw ApiError.badRequest("Invalid OTP or Session not found");
    }

    // Check OTP validity duration

    if (new Date() > session.AttendanceEnd) {
      throw ApiError.badRequest("OTP has expired");
    }

    // Check if user has already marked attendance for this session
    const existingAttendance = await prisma.attendanceLog.findFirst({
      where: {
        attendeeId: userId,
        sessionId,
      },
    });

    if (existingAttendance) {
      throw ApiError.badRequest("Attendance already marked for this session");
    }

    // Mark attendance
    const attendanceLog = await prisma.attendanceLog.create({
      data: {
        attendeeId: userId,
        sessionId,
        timestamp: new Date(),
      },
    });

    return res
      .status(200)
      .json(
        ApiResponse.success(attendanceLog, "Attendance marked successfully")
      );
  });
}

export default new sessionController();
