import mongoose, { Document, Model, Schema } from "mongoose";

// Interface representing a document in MongoDB
export interface ICategory extends Document {
    name?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Define the schema for the Blog model
const categorySchema: Schema<ICategory> = new mongoose.Schema<ICategory>({
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Middleware to update `updatedAt` before saving the document
categorySchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.updatedAt = new Date();
    }
    next();
});

// Create the Blog model
const Category: Model<ICategory> = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
