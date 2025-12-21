import mongoose,{Schema, Document} from 'mongoose'
export interface IBlog extends Document{
    title: string;
    description:string;
    content:string;
    category:string;
    image?:string; 
    author:mongoose.Types.ObjectId; 
    likes: mongoose.Types.ObjectId[]; 
    status:string,  
    createdAt:Date;

}

const blogSchema = new Schema<IBlog>(
    {
        title:{type:String,required:true},
        description:{type:String,required:true},
        content:{type:String,required:true}, 
        image:{type:String},
        author:{type:Schema.Types.ObjectId, ref:"User", required:true},
        likes:[{type:Schema.Types.ObjectId,ref:"User"}],

        category:{
            type:String,
            enum:["technology","educational","health","business","social","political","agriculture","others"],
            required:true
        },

        status:{
            type:String,
            enum:["pending","published","rejected"],
            default:"pending"
        },
    },
    
    {
        timestamps: true
    }
);

export default mongoose.model<IBlog>("Blog",blogSchema);