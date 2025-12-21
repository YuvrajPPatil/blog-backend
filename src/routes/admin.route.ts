import { Router } from "express";
import { requireRole } from "../middlewares/role.middleware";
import { createInvite } from "../controllers/admin.controller";
const router= Router();

router.post("/invite", requireRole(["ADMIN"]), createInvite);

export default router;