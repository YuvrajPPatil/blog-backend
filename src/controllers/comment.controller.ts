import { Request, Response } from "express";
import Comment from "../models/comment.model";
import Blog from "../models/blog.model";
import { request } from "http";

type AuthRequest= Request & {user?:{id:string}};

// POST /api/blogs/:id/comments
export const addComment=async (req:Request,res:Response)=>{
    try{
        const blogId=req.params.id;
        const { content}=req.body;
        if(!content || !content.trim()) return res.status(400).json({message:"Comment required"});

        //ensure blog exists
        const blogExist= await Blog.findById(blogId).select("_id");
        if(!blogExist) return res.status(400).json({message:"Blog not found"});

        const comment= await Comment.create({
            blog:blogId,
            author:req.user!.id,
            content:content.trim(),
        });
        // optional: populate author fields for response
        await comment.populate("author","name email");
        res.status(201).json({message:"Comment added",comment});
    }catch(error){
        return res.json({message:"Error"});
    }
}

// GET /api/blogs/:id/comments?page=1&limit=10
export const getCommentsByBlog=async (req:Request,res:Response)=>{
    try{
        const blogId=req.params.id;
        const page=Math.max(Number(req.query.page) || 1,1);
        const limit=Math.min(Number(req.query.limit) || 10,100);
        const skip=(page-1)*limit;

        const [comments,total]= await Promise.all([
            Comment.find({blog:blogId})
            .sort({createdAt:-1})
            .skip(skip)
            .limit(limit)
            .populate("author","name email")
            .lean(),
            Comment.countDocuments({blog: blogId}),
        ]);

        res.json({
            data:comments,
            meta:{total,page,limit,pages:Math.ceil(total/limit)},
        });

    }catch(error){
        console.error("getCommentsByBlog error:", error);
        res.status(500).json({ message: "Server error" });
    }
}