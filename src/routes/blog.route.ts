import { Router } from "express";
import { createBlog,getBlogById,getBlogs,updateBlog,deleteBlog, toggleLikes } from "../controllers/blog.controller";
import { addComment, getCommentsByBlog } from "../controllers/comment.controller";
import { protect } from "../middlewares/auth.middleware";

const router=Router();
router.post("/",protect, createBlog);
router.get("/", getBlogs);
router.get("/:id",getBlogById);
router.put("/:id",protect,updateBlog);
router.delete("/:id", protect, deleteBlog);

// comments nested routes
router.get("/:id/comments", getCommentsByBlog);
router.post("/:id/comments", protect, addComment);
router.put("/:id/like",protect,toggleLikes);

export default router;