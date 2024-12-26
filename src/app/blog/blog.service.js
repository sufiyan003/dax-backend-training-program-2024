import Blog from './Blog.model.js';

class BlogService {
    static async createBlog(data) {
        try {
            const blog = new Blog(data);
            return await blog.save();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async getAllBlogs() {
        try {
            return await Blog.find();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async getBlogById(id) {
        try {
            const blog = await Blog.findById(id);
            if (!blog) throw new Error('Blog not found');
            return blog;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async updateBlog(id, data) {
        try {
            const updatedBlog = await Blog.findByIdAndUpdate(
                id,
                { ...data, updatedAt: Date.now() },
                { new: true, runValidators: true }
            );
            if (!updatedBlog) throw new Error('Blog not found');
            return updatedBlog;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static async deleteBlog(id) {
        try {
            const deletedBlog = await Blog.findByIdAndDelete(id);
            if (!deletedBlog) throw new Error('Blog not found');
            return deletedBlog;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default BlogService;
