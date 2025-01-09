import { Router } from "express";
import classController from "../controllers/class.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

// Admin's Class Management
router.post("/create", verifyJWT, classController.createClass);
router.get("/:code", verifyJWT, classController.getClassDetails);
router.put("/:code", verifyJWT, classController.updateClass);
router.delete("/:code", verifyJWT, classController.deleteClass);
// Admin's Class Request Management
router.get("/requests/:code", verifyJWT, classController.getAllJoinRequests);
router.get("/:requestId/accept", verifyJWT, classController.acceptRequest);
router.get("/:requestId/reject", verifyJWT, classController.rejectRequest);
//router.get("/:requestId/block", verifyJWT, classController.blockRequest);
//router.get("/:requestId/unblock", verifyJWT, classController.unblockRequest);

// Participant's Class Management
router.get("/:code/joinReq", verifyJWT, classController.requestToJoin);
router.get("/:code/join", verifyJWT, classController.joinClass);
router.get("/:code/leave", verifyJWT, classController.leaveClass);

export default router;
