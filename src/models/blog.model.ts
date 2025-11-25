import mongoose,{Schema, Document} from 'mongoose'
export interface IBlog extends Document{
    title: string;
    description:string;
    content:string;
    image?:string;
    author:mongoose.Types.ObjectId; 
    likes: mongoose.Types.ObjectId[];   
    createdAt:Date;

}

const blogSchema = new Schema<IBlog>(
    {
        title:{type:String,required:true},
        description:{type:String,required:true},
        content:{type:String,required:true},
        image:{type:String},
        author:{type:Schema.Types.ObjectId, ref:"User", required:true},
        likes:[{type:Schema.Types.ObjectId,ref:"User"}]
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IBlog>("Blog",blogSchema);