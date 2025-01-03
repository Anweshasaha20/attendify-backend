import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import attendanceRoutes from "./attendance.routes.js";
import classRoutes from "./class.routes.js";
import ApiResponse from "../utils/apiResponse.js";
const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/class", classRoutes);
router.use("/attendance", attendanceRoutes);

router.get("/", (req, res) => {
  //to test if the server is up and running
  return res
    .status(200)
    .json(
      ApiResponse.success({ message: "🧑‍💻 Attendify server is running..." }),
    );
});

export default router;
