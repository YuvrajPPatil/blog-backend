import mongoose,{Schema, Document} from "mongoose";
import { unique } from "next/dist/build/utils";

export interface ICatgSchema extends Document{
    name:string;
}
const categorySchema=new Schema({
    name:{type:String,required:true,unique:true}
},
{
    timestamps:true
}
);
export default mongoose.model<ICatgSchema>("Category",categorySchema);