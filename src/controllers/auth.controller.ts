import { Request, Response } from "express";
import User,{IUser} from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyTokenHash } from "../utils/invite.utils";
import Invite from "../models/invite.model";

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
        
        res.status(200).json(
            {message:"Login successful",
                token,
                user:{
                    id:user._id,
                    name:user.username,
                    email:user.email
                }
            }
        );
    }catch(error){
        res.status(500).json({message:"Error logging in"});
    }
};