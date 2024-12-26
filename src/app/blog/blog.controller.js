import BlogService from './blog.service.js';

class BlogController {
    static async createBlog(req, res) {
        try {
            const blog = await BlogService.createBlog(req.body);
            res.status(201).json(blog);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getAllBlogs(req, res) {
        console.log('====================================');
        console.log(process.env.MONGODB_URI);
        console.log('====================================');
        try {
            const blogs = await BlogService.getAllBlogs();
            res.status(200).json(blogs);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getBlogById(req, res) {
        try {
            const blog = await BlogService.getBlogById(req.params.id);
            res.status(200).json(blog);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    static async updateBlog(req, res) {
        try {
            const blog = await BlogService.updateBlog(req.params.id, req.body);
            res.status(200).json(blog);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async deleteBlog(req, res) {
        try {
            await BlogService.deleteBlog(req.params.id);
            res.status(200).json({ message: 'Blog deleted successfully' });
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}

export default BlogController;
