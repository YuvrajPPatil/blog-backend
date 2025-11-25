import mongoose, { Document,Schema } from "mongoose";
import { Interface } from "readline";

export interface IComment extends Document{
    blog:mongoose.Types.ObjectId;
    author:mongoose.Types.ObjectId;
    content:string;
    createdAt:Date;
    updatedAt:Date;

}

 const commentSchema=new Schema<IComment>(
    {
        blog:{type:Schema.Types.ObjectId,ref:"Blog", required:true,index:true},
        author:{type:Schema.Types.ObjectId,ref:"User",required:true},
        content:{type:String,required:true, trim:true},
    },
    {timestamps:true}
 );

 export default mongoose.model<IComment>("Comment", commentSchema);