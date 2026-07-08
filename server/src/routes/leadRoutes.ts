import express from "express"
import { authMiddleware } from "../middleware/authMiddleware";
import { createLead, getLeadById, getLeads } from "../controllers/leadControllers";

const router = express.Router();

router.post("/", authMiddleware, createLead)
router.get("/", authMiddleware, getLeads)
router.get("/:id", authMiddleware, getLeadById)

export default router;