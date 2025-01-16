import mongoose, { Document, Model, Schema } from "mongoose";

// Interface representing a document in MongoDB
export interface IBlog extends Document {
  title: string;
  content: string;
  author: string;
  categoryId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the schema for the Blog model
const blogSchema: Schema<IBlog> = new mongoose.Schema<IBlog>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  categoryId: { type: String, ref: 'Category', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to update `updatedAt` before saving the document
blogSchema.pre('save', function (next) {
  if (this.isModified('content') || this.isModified('title') || this.isModified('author')) {
    this.updatedAt = new Date();
  }
  next();
});

// Create the Blog model
const Blog: Model<IBlog> = mongoose.model<IBlog>("Blog", blogSchema);

export default Blog;
