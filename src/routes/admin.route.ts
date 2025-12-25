import { Router } from "express";
import { requireRole } from "../middlewares/role.middleware";
import { createInvite } from "../controllers/admin.controller";
import { protect } from "../middlewares/auth.middleware";
const router= Router();

router.post("/invite",protect, requireRole(["admin"]), createInvite);

export default router;