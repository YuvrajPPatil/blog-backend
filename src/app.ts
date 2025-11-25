import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import dbConnect from "./utils/dbConnect";
import blogRoutes from "./routes/blog.route";
import authRoutes from  "./routes/auth.route";
dotenv.config();
dbConnect();


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/blogs", blogRoutes);
app.use("/api/auth", authRoutes);

  
// Test Route
app.get("/", (req, res) => {
  res.send("🚀 Blog Backend API is running...");
});

export default app;
