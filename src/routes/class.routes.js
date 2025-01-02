import { Router } from "express";
import classController from "../controllers/class.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

// Class Management
router.post("/create", verifyJWT ,classController.create); 
// router.post("/join", classController.joinClass); // Participant joins a class via invitation code/link
// router.get("/", classController.getAllClasses); // Get all classes the user is associated with
// router.get("/:id", classController.getClassDetails); // Get details of a specific class
// router.put("/:id", classController.updateClass); // Update a class (admin only)
// router.delete("/:id", classController.deleteClass); // Delete a class (admin only)

// // Participants Management
// router.get("/:id/participants", classController.getParticipants); // Get participants of a class
// router.post("/:id/remove-participant", classController.removeParticipant); // Remove a participant (admin only)

// // Sessions Management
// router.get("/:id/sessions", classController.getClassSessions); // Get all sessions in a class
// router.post("/:id/sessions", classController.createSession); // Create a new session in a class
// router.put("/:id/sessions/:sessionId", classController.updateSession); // Update details of a session
// router.delete("/:id/sessions/:sessionId", classController.deleteSession); // Delete a session

// // Attendance Management
// router.get("/:id/attendance", classController.getAttendanceLogs); // Get attendance logs for a class
// router.get("/:id/absent", classController.getAbsentStudents); // Get a list of absent students for a class

export default router;
