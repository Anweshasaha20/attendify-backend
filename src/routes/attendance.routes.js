import { Router } from "express";
import attendanceController from "../controllers/attendance.controller.js";

const router = Router();

router.post("/check-in", attendanceController.checkIn);
router.post("/check-out", attendanceController.checkOut);
router.get("/history", attendanceController.getHistory);
router.get("/stats", attendanceController.getStats);

export default router;
