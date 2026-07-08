import express from "express"
import { authMiddleware } from "../middleware/authMiddleware";
import { createLead, getLeadById, getLeads, updateLead } from "../controllers/leadControllers";

const router = express.Router();

router.post("/", authMiddleware, createLead)
router.get("/", authMiddleware, getLeads)
router.get("/:id", authMiddleware, getLeadById)
router.patch("/:id", authMiddleware, updateLead)

export default router;