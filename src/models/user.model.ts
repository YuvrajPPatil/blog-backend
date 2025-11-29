import mongoose,{Schema, Document} from "mongoose"
export interface IUser extends Document{
    username: string;
    email: string;
    password:string;
    avatar?:string;
    profileImage?:string;
}

const userSchema =new Schema<IUser>(
    {
         username: {type: String, required: true, unique:true},
         email:{type: String, required: true,unique:true},
         password:{type:String, required:true},
         avatar:{type:String},// Cloudinary URL
         profileImage:{type:String} // Cloudinary URL
    },
    {
        timestamps:true
    }
);

const User = mongoose.model<IUser>("User",userSchema);
export default User;