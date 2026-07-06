import express from "express"
import { authMiddleware } from "../middleware/authMiddleware";
import { createLead } from "../controllers/leadControllers";

const router = express.Router();

router.post("/", authMiddleware, createLead)

export default router