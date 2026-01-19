import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayload{
    id: string; role: string
}  

export const protect=(req: Request, res:Response,next:NextFunction):void=>{
    try{
          //  const token=req.headers.authorization?.split(" ")[1];
              const token = req.cookies?.access_token;

            if(!token)  
              {
                res.status(401).json({message:"No token, authorization denied"});
                return;
              }

            const decoded=jwt.verify(
              token,
              process.env.JWT_SECRET as string) as JwtPayload ;
              req.user=decoded;
            next();
    }catch(error){
            res.status(401).json({ message: "Token is not valid" });
    }
};