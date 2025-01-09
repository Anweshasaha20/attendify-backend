import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import sessionController from "../controllers/session.controller.js";

const router = Router();

// Sessions Management
router.get("/:classId", verifyJWT, sessionController.getClassSessions); // Get all sessions in a class
router.post(
  "/:classId/createSession",
  verifyJWT,
  sessionController.createSession
); // Create a session
router.put(
  "/:classId/updateSession/:sessionId",
  verifyJWT,
  sessionController.updateSession
); // Update details of a session
router.delete(
  "/:classId/deleteSession/:sessionId",
  verifyJWT,
  sessionController.deleteSession
); // Delete a session
router.post(
  "/:classId/createOTP/:sessionId/",
  verifyJWT,
  sessionController.createOTP
); // Create OTP for attendance
router.post(
  "/:classId/verifyOTP/:sessionId/",
  verifyJWT,
  sessionController.verifyOTP
); // Insert OTP for attendance

// router.get("/user/upcoming", sessionController.getUpcomingSessionsForUser); // Get upcoming sessions for a user

// // Attendance Management
// router.get("/:id/attendance", classController.getAttendanceLogs); // Get attendance logs for a class
// router.get("/:id/absent", classController.getAbsentStudents); // Get a list of absent students for a class

export default router;
