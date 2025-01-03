import { Router } from "express";
import classController from "../controllers/class.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

// Admin's Class Management
router.post("/create", verifyJWT, classController.createClass);
router.get("/:code", verifyJWT, classController.getClassDetails);
router.put("/:code", verifyJWT, classController.updateClass);
router.delete("/:code", verifyJWT, classController.deleteClass);

router.get("/requests/:code", verifyJWT, classController.getAllJoinRequests);
router.get("/:requestId/accept", verifyJWT, classController.acceptRequest);
router.get("/:requestId/reject", verifyJWT, classController.rejectRequest);
//router.get("/:requestId/block", verifyJWT, classController.blockRequest);
//router.get("/:requestId/unblock", verifyJWT, classController.unblockRequest);

// Participant's Class Management
router.get("/:userId/joinReq", verifyJWT, classController.requestToJoin);
router.get("/:code/join", verifyJWT, classController.joinClass);
router.get("/:code/leave", verifyJWT, classController.leaveClass);

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
