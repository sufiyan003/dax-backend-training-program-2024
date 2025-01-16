import { blogLogger } from '../../shared/logger';
import CategoryRepository from '../categories/categories.repository';
import { IBlog } from './Blog.model';
import BlogRepository from './blog.repository';
import { CreateBlogBody } from './schema/create-blog.validator';
import { UpdateBlogBody } from './schema/update-blog.valdation';

class BlogService {

    // Create a blog
    async createBlog(data: CreateBlogBody): Promise<IBlog> {
        try {
            // Validate category existence
            const categoryExists = await CategoryRepository.findById(data.categoryId);
            if (!categoryExists) {
                throw new Error('Category not found');
            }
            return await BlogRepository.create(data);
        } catch (error: unknown) {
            blogLogger.error('Error creating blog:', error);
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('An unknown error occurred');
            }
        }
    }

    // Get all blogs
    async getAllBlogs(): Promise<IBlog[]> {
        try {
            return await BlogRepository.findAll();
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('An unknown error occurred');
            }
        }
    }

    // Get a single blog by ID
    async getBlogById(id: string): Promise<IBlog | null> {
        try {
            const blog = await BlogRepository.findById(id);
            if (!blog) throw new Error('Blog not found');
            return blog;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('An unknown error occurred');
            }
        }
    }

    // Update a blog by ID
    async updateBlog(id: string, data: UpdateBlogBody): Promise<IBlog | null> {
        try {
            const updatedBlog = await BlogRepository.updateById(id, data);
            if (!updatedBlog) throw new Error('Blog not found');
            return updatedBlog;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('An unknown error occurred');
            }
        }
    }

    // Delete a blog by ID
    async deleteBlog(id: string): Promise<IBlog | null> {
        try {
            const deletedBlog = await BlogRepository.deleteById(id);
            if (!deletedBlog) throw new Error('Blog not found');
            return deletedBlog;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('An unknown error occurred');
            }
        }
    }

    // Get blogs by category
    async getBlogsByCategory(categoryId: string, page: number, limit: number): Promise<{ blogs: IBlog[], total: number }> {
        try {
            const offset = (page - 1) * limit;
            const [blogs, total] = await Promise.all([
                BlogRepository.findByCategory(categoryId, offset, limit),
                BlogRepository.countByCategory(categoryId)
            ]);

            return { blogs, total };
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('An unknown error occurred');
            }
        }
    }
}

export default BlogService;
