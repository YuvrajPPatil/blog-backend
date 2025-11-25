import { error } from "console";
import mongoose from "mongoose";

const dbConnect= async()=>{
    try{
        if(!process.env.MONGO_URI) throw new Error("Mongo URI not defined");
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected");
    }catch(error){
        console.error("MongoDB connection error:", error);
        process.exit(1); 
    }
};
export default dbConnect;