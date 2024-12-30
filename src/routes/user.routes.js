import { Router } from "express";
import userController from "../controllers/user.controller.js";

const router = Router();

router.get("/", userController.getAllUsers);
router.get("/profile", userController.getProfile);
router.put("/profile", userController.updateProfile);
router.delete("/:id", userController.deleteUser);

export default router;
