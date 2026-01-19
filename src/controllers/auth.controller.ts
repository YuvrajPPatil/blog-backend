import { Request, Response } from "express";
import User,{IUser} from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyTokenHash } from "../utils/invite.utils";
import Invite from "../models/invite.model";
import { auditLog } from "../services/audit.service";

export const register =async(req:Request, res:Response)=>{
    try{
         const {username, email, password,inviteToken}=req.body;
        
         if (!inviteToken) {
            return res.status(400).json({ message: "Invite token required" });
        } 
         const invite=await Invite.findOne({email}); 
        if(!invite)return res.status(400).json({message:"Invalid invite"});

        if(invite.used)return res.status(400).json({message:"Invite already used"});
        
        const isValid = await verifyTokenHash(inviteToken, invite.tokenHash);
        if (!isValid) {
            return res.status(400).json({ message: "Invalid invite token" });
        }

        if(invite.expireAt < new Date())
            return res.status(400).json({message:"Invite closed"});
 
         const existingUser=await User.findOne({email});
         if(existingUser) return res.status(400).json({message:"User Already Exists"});

         const hashPassword=await bcrypt.hash(password,10);
         const user=await User.create({username,email,password:hashPassword,role:invite.role});

         invite.used = true; 
        invite.usedAt=new Date();
         await invite.save();

         await auditLog({
            action: "INVITE_USED",
            resource: "Invite",
            resourceId: invite._id.toString(),
            metadata: { email: user.email },
        });
         res.status(200).json({message:"User registred successfully", user});

    }catch(error){
        res.status(500).json({message:"Error registering user"}); 
    }
};

export const login= async(req:Request,res:Response)=>{
    try{
        const {email, password}=req.body;
        //const user=User.findOne({email});
        const user: IUser | null = await User.findOne({ email }).exec();

        if(!user) return res.status(400).json({message:"Invalid Credentials"});

        const isMatch=await bcrypt.compare(password,user.password);
       
        if(!isMatch) return res.status(400).json({message:"Invalid Credentials"});

        const token=jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET as string,{expiresIn:"1h"} );
         
        res.cookie("access_token",token,{
            httpOnly:true,
           // secure:process.env.NODE_ENV === 'production',
           secure:false,
            sameSite:"lax",
            path: "/",  
            maxAge:60*60*1000, //1 hour

        });

        await auditLog({
            action: "LOGIN_SUCCESS",
            user,
            req,
        });
        res.status(200).json(
            {message:"Login successful",
                user:{
                    id:user._id,
                    name:user.username,
                    email:user.email
                }
            },
        );
    }catch(error){
        res.status(500).json({message:"Error logging in"});
    }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("access_token");
  return res.status(200).json({ message: "Logged out successfully" });
};

export const me = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.status(200).json({ user });
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};