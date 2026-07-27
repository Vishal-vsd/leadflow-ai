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
    getDashboardData,
} from "../controllers/adminControllers";

const router = express.Router();

router.use(authMiddleware);
router.use(authorize("admin"))

// Lead Management
router.get(
    "/leads",
    getAllLeads
);

// Analytics
router.get(
    "/lead-stats",
    getAllLeadStats
);

router.get(
    "/source-stats",
    getAllSourceStats
);

router.get(
    "/conversion-stats",
    getAllConversionStats
);

// User Management
router.get(
    "/users",
    getAllUsers
);

router.patch("/users/:id/role", updateUserRole)

router.get(
    "/dashboard",
    getDashboardData
);

export default router;