import mongoose from "mongoose";
import { z } from "zod";

const blogValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  author: z.string().min(1, "Author is required"),
});

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

blogSchema.pre("save", async function (next) {
  try {
    await blogValidationSchema.parse(this.toObject());
    next();
  } catch (err) {
    next(err);
  }
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
