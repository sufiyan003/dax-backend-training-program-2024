import { IBlog } from './Blog.model';
import BlogRepository from './blog.repository';
import { CreateBlogBody } from './schema/create-blog.validator';
import { UpdateBlogBody } from './schema/update-blog.valdation';


// Defining the type for blog creation data

// TODO: Implement the BlogRespository with Model calling
class BlogService {
  // Create a blog
  async createBlog(data: CreateBlogBody): Promise<IBlog> {
    try {
      return await BlogRepository.create(data);
    } catch (error: unknown) {
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
}

export default BlogService;
