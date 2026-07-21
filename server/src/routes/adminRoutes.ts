import express from "express";

import { authMiddleware } from "../middleware/authMiddleware";
import { authorize } from "../middleware/authorize";

import {
  getAllLeads,
  getAllLeadStats,
  getAllSourceStats,
  getAllConversionStats,
  getAllUsers,
} from "../controllers/adminControllers";

const router = express.Router();

// Lead Management
router.get(
  "/leads",
  authMiddleware,
  authorize("admin"),
  getAllLeads
);

// Analytics
router.get(
  "/lead-stats",
  authMiddleware,
  authorize("admin"),
  getAllLeadStats
);

router.get(
  "/source-stats",
  authMiddleware,
  authorize("admin"),
  getAllSourceStats
);

router.get(
  "/conversion-stats",
  authMiddleware,
  authorize("admin"),
  getAllConversionStats
);

// User Management
router.get(
  "/users",
  authMiddleware,
  authorize("admin"),
  getAllUsers
);

export default router;