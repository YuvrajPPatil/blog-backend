import mongoose from "mongoose";
import dotenv from "dotenv";
import dbConnect from "../utils/dbConnect"; 
import bcrypt from "bcrypt";
import User from "../models/user.model";

dotenv.config();
dbConnect();

const createAdmin = async()=>{
    try{
            const adminEmail='blogadmin@gmail.com';
            const existingAdmin=await User.findOne({email:adminEmail});
            if(existingAdmin)
            {
                console.log("admin email already in DB");
                process.exit(0);
            }
            
            const hashPassword=await bcrypt.hash("Admin@123",10);

            await User.create({
                username:"Admin",
                email:adminEmail,
                password:hashPassword,
                role:"admin",
            });

            console.log("admin cerated successfully");
             process.exit(0);

    }catch(error)
    {
        console.log({message:"Problem createing admin",error});
        process.exit(1);
    }
};

createAdmin();