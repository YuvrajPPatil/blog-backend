import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { register,login,logout,me } from "../controllers/auth.controller";

const router=Router();

router.post("/register",register);
router.post("/login",login);
router.post("/logout",logout);
router.get("/me", protect, me);

export default router;
