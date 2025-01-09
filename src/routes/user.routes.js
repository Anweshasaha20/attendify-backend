import { Router } from "express";
import userController from "../controllers/user.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
const router = Router();

router.get("/profile", verifyJWT, userController.getProfile);
router.put("/profile", verifyJWT, userController.updateProfile);
router.delete("/profile", verifyJWT, userController.deleteUser);
router.put("/password", verifyJWT, userController.changePassword);
router.get("/all", verifyJWT, userController.getAllUsers);
router.get("/upcoming", verifyJWT, userController.getUpcomingSessions);

export default router;
