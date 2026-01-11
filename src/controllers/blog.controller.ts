import { Request, Response } from "express";
import Blog from "../models/blog.model";
import Comment from "../models/comment.model"
import { request } from "http";
import { auditLog } from "../services/audit.service";

export const createBlog= async(req:Request, res:Response)=>{
    try{
        const {title,description,content,category, image}=req.body;
        const blog=await Blog.create({
            title,
            description,
            content,
            category, 
            image,
            author : req.user.id, //from jwt
            status:"pending",
        });
       await auditLog({
            action: "BLOG_CREATED",
            user: req.user,
            resource: "Blog",
            resourceId: blog._id.toString(),
            req,
        });
       return  res.status(201).json(blog);

    }catch(error){
       return  res.status(500).json({message:'Error creating Blog :', error});
    }
};

export const getBlogs= async(req:Request,res:Response)=>{
    try{
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip  =   (page-1)*limit;

            const search=req.query.search ? (req.query.search as string) : "";
            const {category,status}=req.query; 
            
            const filter:any={}; //// Build MongoDB filter object

                // Add search filter
                if (search) {
                    filter.$or = [
                        { title: { $regex: search, $options: "i" } },
                        { description: { $regex: search, $options: "i" } }
                    ];
                }

                if (category) {
                    filter.category = category;
                }

                 // Add status filter (default: published)
                filter.status = status || "published";

        //const blogs=await Blog.find().populate("author","username email");
            const blogs=await Blog.find(filter)
                .populate("author","username email")
                .skip(skip)
                .limit(limit)
                .sort({createdAt:-1});

             const total = await Blog.countDocuments(filter);

            res.json({
                page,
                totalPages: Math.ceil(total / limit),
                totalBlogs: total,
                blogs,
            });
        
    }catch(error)
    {
        return res.status(500).json({message:'Error fetching blogs'});
    }
};

export const getBlogById=async(req:Request,res:Response)=>{
    try{
        const blog=await Blog.findById(req.params.id).populate("author","username email");
        if(!blog) return res.status(404).json({message:'Blog not found'});
      return  res.json(blog);

    }catch(error){
        return res.status(500).json({message:'Error fetching blog'});
    }
};

export const updateBlog=async(req:Request,res:Response)=>{
    try{
        const blogId =req.params.id;
        const blog= await Blog.findById(blogId);

        if(!blog)
        {
          return  res.status(400).json({message:"Blog not found"});
        }
        
        //if(blog.author.toString() !== req.user.id)
        if(!req.user || !blog.author.equals(req.user.id))
        {
            return res.status(400).json({message:"Unauthorized to Update"});
        }

        const { title, description, content,category, image } = req.body;

        const updatedBlog= await  Blog.findByIdAndUpdate(blogId,
            {
                    title,description, content,category, image
            },
            {
                    new:true,
                    runValidators:true,
            }
        );

        return res.json({ message: "Blog updated", updatedBlog });
    }catch(error){
        return res.status(500).json({message:'Error updating blog'});
    }
};

export const deleteBlog= async(req:Request,res:Response)=>{

        const blogId  =req.params.id;
        const blog=await Blog.findById(blogId);

        if(!blog)
        {
           return res.status(404).json({message:"Not found"});
        }
       // if(blog.author.toString()!==req.user.id)
            if(!req.user || !blog.author.equals(req.user.id))
        {
          return res.status(403).json({ message: "Unauthorized to delete" }); 
        }

       await Blog.findByIdAndDelete(blogId);

         return res.status(200).json({ message: "Blog deleted" });
};

export const toggleLikes= async(req:Request,res:Response)=>{
    try{
        const blog = await Blog.findById(req.params.id).exec();

        if(!blog ) return res.status(400).json({message:"Blog Not Found"});

        const userId=req.user.id;
       // const isLiked = blog.likes.includes(userId);
        const isLiked = blog.likes.some((id: any) => id.toString() === userId);
        
        if(isLiked){
            blog.likes=blog.likes.filter((id:any)=>id.toString()!==userId);
            await blog.save();
            return res.json({ message: "Blog unliked" });
        }else{
            blog.likes.push(userId);
            await blog.save();
            return res.json({ message: "Blog liked" });
        }
    }catch(error){
        res.status(500).json({ message: "Error while liking blog" });

    }
}

export const approvBlog=async(req:Request,res:Response)=>{
    await Blog.findByIdAndUpdate(req.params.id,{status:"published"});
    return res.json({message:"Blog Approved"});
}

export const rejectBlog=async(req:Request,res:Response)=>{
        await Blog.findByIdAndUpdate(req.params.id, {status:"rejected"});
        return res.json({message:"Blog Rejcted"});
}
