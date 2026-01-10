import { Request,Response, NextFunction } from "express";
import { ROLE_PERMISSIONS } from "../config/rbac";
 
export const requirePermission= (permission:string)=>{
    return(req:Request & {user?:any},res:Response,next:NextFunction)=>{
        const user=req.user;
        if(!user){
            return res.status(401).json({message:'unauthorized'});
        }

        const permissions=ROLE_PERMISSIONS[user.role] || [];
         if (!permissions.includes(permission)) {
        return res.status(403).json({ message: "Forbidden" });
        } 
        next();
    };
};