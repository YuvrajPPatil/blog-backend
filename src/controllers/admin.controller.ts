import { Request, Response } from "express";
import Invite from "../models/invite.model";
import { generateInviteToken,getInviteExpiry,hashInviteToken } from "../utils/invite.utils";
import { INVITE_EXPIRY_DAYS,FRONTEND_URL } from "../config";
import emailQueue from "../queues/email.queue";

export const createInvite= async(req:Request,res:Response)=>{

    try{ 
    const {email, role="author",expireDays}=req.body;
    const days=Number(expireDays || INVITE_EXPIRY_DAYS);

    //generate token and hash
    const token=generateInviteToken();
    const tokenHash=await hashInviteToken(token);

    const expireAt=getInviteExpiry(5);

    const invite= await Invite.create({
        email,
        role,
        tokenHash,
        expireAt,
        createdBy:req.user?.id,       
    });

    //send token to user via email
    const inviteUrl=`${process.env.FRONTEND_URL}/register?token=${token}`;

        await emailQueue.add("send-invite-email",{
                to:email,
            subject:"You're invited to write on our blog",
                html:`You are invited as <b>${role}</b></p>
                    <p><a href="${inviteUrl}">Register Here </a></p>
                    <p>Link expires in ${INVITE_EXPIRY_DAYS} days.</p>`,
        });

        res.status(200).json({message:'Invite sent successfully"'});
    }catch(error)
    {
         console.error("Invite error:", error);
        return res.status(500).json({ message: "Failed to send invite" });
    }
};