import mongoose,{ Schema, Document } from "mongoose";

export interface INVS extends Document{
    email:string;
    tokenHash:string;
    role:"admin"|"author";
    used:boolean;
    usedAt:Date;
    expireAt:Date; 
    createdBy: mongoose.Types.ObjectId;
}


const inviteSchema= new Schema<INVS>({
        email:{type:String, required:true,lowercase:true,trim:true,index:true},
        tokenHash:{type:String, required:true},
        role:{type:String,enum:["admin","author"], default:"author"},
        used:{type:Boolean,default:false},
        usedAt:{type:Date},
        expireAt:{type:Date,required:true},
        createdBy:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    },
    {
        timestamps:true
    }
);

// TTL index: Mongo will automatically remove expired invites
inviteSchema.index({expireAt:1},{expireAfterSeconds:0});

export default mongoose.model<INVS>("Invite", inviteSchema);
