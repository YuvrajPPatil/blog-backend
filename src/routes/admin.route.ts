import { Router } from "express";
import { requireRole } from "../middlewares/role.middleware";
import { createInvite } from "../controllers/admin.controller";
import { protect } from "../middlewares/auth.middleware";
import { PERMISSIONS } from "../constants/permissions";
import { requirePermission } from "../middlewares/permissions.middleware";

const router= Router();

router.post("/invite", protect, requireRole(["admin"]), requirePermission(PERMISSIONS.INVITE_AUTHOR), createInvite);

export default router;