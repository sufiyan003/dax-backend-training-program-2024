import { Request, Response } from 'express';
import BlogService from './blog.service';
import { CreateBlogBody } from './schema/create-blog.validator';
import { UpdateBlogBody } from './schema/update-blog.valdation';
import CategoryService from '../categories/categories.service';

class BlogController {
    private readonly service: BlogService = new BlogService()
    private readonly catService: CategoryService = new CategoryService()

    // Create a blog
    async createBlog(req: Request, res: Response): Promise<Response> {
        try {
            const body = req.body as CreateBlogBody;
            const blog = await this.service.createBlog(body);
            return res.status(201).json(blog);
        } catch (error: any) {
            console.log("error=> ", error)
            return res.status(400).json({ error: error.message });
        }
    }

    // Get all blogs
    async getAllBlogs(_: Request, res: Response): Promise<Response> {  // Removed req as it's unused
        try {
            const blogs = await this.service.getAllBlogs();
            return res.status(200).json(blogs);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Get a single blog by ID
    async getBlogById(req: Request, res: Response): Promise<Response> {
        try {
            const blog = await this.service.getBlogById(req.params.id);
            if (!blog) {
                return res.status(404).json({ error: 'Blog not found' });
            }
            return res.status(200).json(blog);
        } catch (error: any) {
            return res.status(404).json({ error: error.message });
        }
    }

    // Update a blog by ID
    async updateBlog(req: Request, res: Response): Promise<Response> {
        try {
            const body = req.body as UpdateBlogBody;
            const blog = await this.service.updateBlog(req.params.id, body);
            if (!blog) {
                return res.status(404).json({ error: 'Blog not found' });
            }
            return res.status(200).json(blog);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    // Delete a blog by ID
    async deleteBlog(req: Request, res: Response): Promise<Response> {
        try {
            const result = await this.service.deleteBlog(req.params.id);
            if (!result) {
                return res.status(404).json({ error: 'Blog not found' });
            }
            return res.status(200).json({ message: 'Blog deleted successfully' });
        } catch (error: any) {
            return res.status(404).json({ error: error.message });
        }
    }

    // Get blogs by category with pagination
    async getBlogsByCategory(req: Request, res: Response): Promise<Response> {
        try {
            const categoryId = req.params.categoryId;
            const category = await this.catService.getCategoryById(categoryId);

            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }

            // Extract the page and limit query parameters
            const page = parseInt(req.query.page as string) || 1; // Default to page 1
            const limit = 4; // Default to 4 blogs per page

            // Fetch blogs by category with pagination
            const { blogs, total } = await this.service.getBlogsByCategory(categoryId, page, limit);

            if (blogs.length === 0) {
                return res.status(404).json({ message: 'Blogs not found' });
            }

            return res.status(200).json({ category, blogs, total });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default BlogController;
