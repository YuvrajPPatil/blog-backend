import {Router} from "express";
import {getMyProfile,updateProfile, changePassword} from "../controllers/user.controller";
import { protect } from "../middlewares/auth.middleware";


const router=Router();
router.get("/me",protect,getMyProfile);
router.put("/update",protect,updateProfile);
router.put("/change-password",protect,changePassword);

export default router;