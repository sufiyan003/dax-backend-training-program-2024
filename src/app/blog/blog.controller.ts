import { Request, Response } from 'express';
import BlogService from './blog.service';

class BlogController {
    // Create a blog
    static async createBlog(req: Request, res: Response): Promise<Response> {
        try {
            const blog = await BlogService.createBlog(req.body);
            return res.status(201).json(blog);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    // Get all blogs
    static async getAllBlogs(_: Request, res: Response): Promise<Response> {  // Removed req as it's unused
        try {
            const blogs = await BlogService.getAllBlogs();
            return res.status(200).json(blogs);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Get a single blog by ID
    static async getBlogById(req: Request, res: Response): Promise<Response> {
        try {
            const blog = await BlogService.getBlogById(req.params.id);
            if (!blog) {
                return res.status(404).json({ error: 'Blog not found' });
            }
            return res.status(200).json(blog);
        } catch (error: any) {
            return res.status(404).json({ error: error.message });
        }
    }

    // Update a blog by ID
    static async updateBlog(req: Request, res: Response): Promise<Response> {
        try {
            const blog = await BlogService.updateBlog(req.params.id, req.body);
            if (!blog) {
                return res.status(404).json({ error: 'Blog not found' });
            }
            return res.status(200).json(blog);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    // Delete a blog by ID
    static async deleteBlog(req: Request, res: Response): Promise<Response> {
        try {
            const result = await BlogService.deleteBlog(req.params.id);
            if (!result) {
                return res.status(404).json({ error: 'Blog not found' });
            }
            return res.status(200).json({ message: 'Blog deleted successfully' });
        } catch (error: any) {
            return res.status(404).json({ error: error.message });
        }
    }
}

export default BlogController;
