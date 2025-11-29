import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const storage= new CloudinaryStorage({
    cloudinary,
    params:{
        folder:"blogapp/profile/",
        allowed_formats:["jpge","jpg","png"],
    }
});

export const upload=multer({storage});
