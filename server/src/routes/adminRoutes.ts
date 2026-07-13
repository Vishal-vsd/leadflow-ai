import express from "express"
import { authMiddleware } from "../middleware/authMiddleware";
import { authorize } from "../middleware/authorize";
import { getAllLeads } from "../controllers/adminControllers";

const router = express.Router();

router.get("/leads", authMiddleware, authorize("admin"), getAllLeads)

export default router;