import express from 'express';
import BlogController from './blog.controller.js';
import validateBody from '../../shared/middlwear/validateBody.js';
import { createBlogSchema } from './schema/create-blog.validator.js';

const router = express.Router();

// Create a blog
router.post('/', validateBody(createBlogSchema), BlogController.createBlog);

// Get all blogs
router.get('/', BlogController.getAllBlogs);

// Get a single blog by ID
router.get('/:id', BlogController.getBlogById);

// Update a blog by ID
router.put('/:id', BlogController.updateBlog);

// Delete a blog by ID
router.delete('/:id', BlogController.deleteBlog);

export default router;
