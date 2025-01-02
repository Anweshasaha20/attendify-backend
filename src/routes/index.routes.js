import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import attendanceRoutes from "./attendance.routes.js";
import classRoutes from "./class.routes.js";
const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/class", classRoutes);
router.use("/attendance", attendanceRoutes);

export default router;
