import User from "../models/user.model";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

export const getMyProfile= async (req: Request, res : Response )=>{
    try{
         if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
        }
        const user=await User.findById(req.user.id).select("-password");
        res.json(user);

    }catch(error){
        return res.status(500).json({message:'Error fetching profile'});
    }
}

export const updateProfile=async (req:Request,res:Response)=>{
     try{
            const {username}=req.body;
            const updated= await User.findByIdAndUpdate(
                req.user?.id,
                {username},
                {new:true}
            ).select("-password");
             res.json(updated);
     } catch(error){
        return res.status(500).json({message:'Error fetching profile'});
    }
}

export const changePassword=async (req:Request,res:Response)=>{ 
    
    try{
            const {oldPassword,newPassword}=req.body;
            const user= await User.findById(req.user.id);
 
            if(!user) return res.status(404).json({ message: "User not found" });

            const isMatch= await bcrypt.compare(oldPassword,user.password);
            if(!isMatch) return res.status(400).json({ message: "Old password incorrect" });

            user.password= await bcrypt.hash(newPassword,10);
            await user.save();
            return res.json({ message: "Password updated successfully" });

    }catch(error){
        console.error("Controller error:", error);
        return res.status(500).json({message:'Error change password.'});
    }
}

export const uploadImageProfile=async(req:Request,res:Response)=>{
    try{
            const userId=(req as any).user.id;
            const imageUrl=(req.file as any).path;

            const updatedUser=await User.findByIdAndUpdate(
                userId,
                {profileImage:imageUrl},
                {new:true}
            );
            res.json({
            message: "Profile image updated successfully",
            user: updatedUser
            });    

    }catch(error){
            console.error("Controller error:", error);
            return res.status(500).json({message:'Image upload error.'});
 
    }
}