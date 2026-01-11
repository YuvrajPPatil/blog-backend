import { Router } from "express";
import { requireRole } from "../middlewares/role.middleware";
import { createInvite } from "../controllers/admin.controller";
import { protect } from "../middlewares/auth.middleware";
import { PERMISSIONS } from "../constants/permissions";
import { requirePermission } from "../middlewares/permissions.middleware";
import AuditLog from "../models/auditLog.models";
const router= Router();

router.post("/invite", protect, requireRole(["admin"]), requirePermission(PERMISSIONS.INVITE_AUTHOR), createInvite);
router.get('/audit-logs',protect,requirePermission("VIEW_AUDIT_LOG"),async(req,res)=>{
        const logs=AuditLog.find().
        sort({createdAt:-1})
        .limit(100)

        res.json(logs);
    }
);

export default router;