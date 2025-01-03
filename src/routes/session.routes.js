import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import sessionController from "../controllers/session.controller.js";

const router = Router();

// Sessions Management
router.get("/:classId/sessions",verifyJWT, sessionController.getClassSessions); // Get all sessions in a class
router.post("/:id/session",verifyJWT, sessionController.createSession); // Create a new session in a class
router.put("/:id/sessions/:sessionId",verifyJWT, sessionController.updateSession); // Update details of a session
router.delete("/:id/sessions/:sessionId",verifyJWT, sessionController.deleteSession); // Delete a session

// // Attendance Management
// router.get("/:id/attendance", classController.getAttendanceLogs); // Get attendance logs for a class
// router.get("/:id/absent", classController.getAbsentStudents); // Get a list of absent students for a class

export default router;
