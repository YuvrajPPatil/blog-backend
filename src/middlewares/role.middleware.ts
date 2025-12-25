import { Request,Response,NextFunction } from "express";

export const requireRole=(roles:string[])=>(req:Request & {user?:any}, res:Response,next:NextFunction)=>{
        const user=req.user;
      //  console.log(user);
        if(!user) return res.json({message: "Unauthorized"});
        if(!roles.includes(user.role)) return res.json({message: "forbidden"});

        next();
    }