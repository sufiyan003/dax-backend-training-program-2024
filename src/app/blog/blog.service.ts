import { blogLogger } from '../../shared/logger';
import Blog, { IBlog } from './Blog.model';

// Defining the type for blog creation data
interface BlogCreateData {
  title: string;
  content: string;
  author: string;
}

// TODO: Implement the BlogRespository with Model calling
class BlogService {

  // Create a blog
  async createBlog(data: BlogCreateData): Promise<IBlog> {
    try {
      blogLogger.error('Creating blog...');
      blogLogger.info('Creating blog...');
      const blog = new Blog(data);
      blogLogger.info('Blog Created')
      return await blog.save();
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
  static async getAllBlogs(): Promise<IBlog[]> {
    try {
      return await Blog.find();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  }

  // Get a single blog by ID
  static async getBlogById(id: string): Promise<IBlog | null> {
    try {
      const blog = await Blog.findById(id);
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
  static async updateBlog(id: string, data: Partial<BlogCreateData>): Promise<IBlog | null> {
    try {
      const updatedBlog = await Blog.findByIdAndUpdate(
        id,
        { ...data, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
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
  static async deleteBlog(id: string): Promise<IBlog | null> {
    try {
      const deletedBlog = await Blog.findByIdAndDelete(id);
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
