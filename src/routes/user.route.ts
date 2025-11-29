import {Router} from "express";
import {getMyProfile,updateProfile, changePassword,uploadImageProfile} from "../controllers/user.controller";
import { protect } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload";

const router=Router();
router.get("/me",protect,getMyProfile);
router.put("/update",protect,updateProfile);
router.put("/change-password",protect,changePassword);
router.put("/profile/image/",protect,upload.single("image"),uploadImageProfile);

export default router;