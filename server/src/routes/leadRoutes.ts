import express from "express"
import { authMiddleware } from "../middleware/authMiddleware";
import { analyzeLead, createLead, deleteLead, getLeadById, getLeads, getLeadStats, updateLead } from "../controllers/leadControllers";

const router = express.Router();

router.post("/", authMiddleware, createLead)
router.get("/", authMiddleware, getLeads)
router.get("/stats", authMiddleware, getLeadStats)
router.post("/:id/analyze", authMiddleware, analyzeLead)
router.get("/:id", authMiddleware, getLeadById)
router.patch("/:id", authMiddleware, updateLead)
router.delete("/:id", authMiddleware, deleteLead)

export default router;