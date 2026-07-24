import express from "express";

import { authMiddleware } from "../middleware/authMiddleware";
import { authorize } from "../middleware/authorize";

import {
    getAllLeads,
    getAllLeadStats,
    getAllSourceStats,
    getAllConversionStats,
    getAllUsers,
    updateUserRole,
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

router.patch("/users/:id/role", authMiddleware, authorize("admin"), updateUserRole)

export default router;