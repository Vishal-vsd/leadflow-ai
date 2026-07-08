import express from "express"
import { authMiddleware } from "../middleware/authMiddleware";
import { createLead, getLeads } from "../controllers/leadControllers";

const router = express.Router();

router.post("/", authMiddleware, createLead)
router.get("/", authMiddleware, getLeads)

export default router