import express from "express"
import { authMiddleware } from "../middleware/authMiddleware";
import { createLead, deleteLead, getLeadById, getLeads, updateLead } from "../controllers/leadControllers";

const router = express.Router();

router.post("/", authMiddleware, createLead)
router.get("/", authMiddleware, getLeads)
router.get("/:id", authMiddleware, getLeadById)
router.patch("/:id", authMiddleware, updateLead)
router.delete("/:id", authMiddleware, deleteLead)

export default router;