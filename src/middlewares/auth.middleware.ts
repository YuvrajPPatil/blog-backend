import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayload{
    id: string; role: string
}  

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const protect=(req: AuthRequest, res:Response,next:NextFunction)=>{
    try{
            const token=req.headers.authorization?.split(" ")[1];
            if(!token) return res.status(401).json({message:"No token, authorization denied"});

            const decoded=jwt.verify(token,process.env.JWT_SECRET as string) as JwtPayload ;
            req.user=decoded;
            next();
    }catch(error){
            res.status(401).json({ message: "Token is not valid" });
    }
};