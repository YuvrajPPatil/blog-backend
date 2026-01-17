import AuditLog from "../models/auditLog.models"

interface AuditParameter{
    action:string;
    user?: any;
    resource?: string;
    resourceId?: string;
    req?: any;
    metadata?: Record<string, any>;
}

export const auditLog=async({
    action,
    user,
    resource,
    resourceId,
    req,
    metadata,
}: AuditParameter)=>{
    try{
        await AuditLog.create({
            action,
            userId: user?.id,
            role: user?.role,
            resource,
            resourceId,
            ip: req?.ip,
            userAgent: req?.headers["user-agent"],
            metadata,
        });
    }catch(error)
    {
          console.error("Audit log failed:", error);
    }
}