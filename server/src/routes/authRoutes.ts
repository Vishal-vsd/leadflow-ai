import express from "express";
import { getMe, loginUser, logoutUser, registerUser } from "../controllers/authcontrollers";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser)
router.get("/me", authMiddleware, getMe)
router.post("/logout", authMiddleware, logoutUser)

export default router;