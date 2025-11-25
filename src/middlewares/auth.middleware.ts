import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request{
    user?:any;
}

export const protect=(req: AuthRequest, res:Response,next:NextFunction)=>{
    try{
            const token=req.headers.authorization?.split(" ")[1];
            if(!token) return res.status(401).json({message:"No token, authorization denied"});

            const decoded=jwt.verify(token,process.env.JWT_SECRET as string);
            req.user=decoded;
            next();
    }catch(error){
            res.status(401).json({ message: "Token is not valid" });
    }
};