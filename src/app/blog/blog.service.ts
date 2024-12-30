import Blog, { IBlog } from './Blog.model';

// Defining the type for blog creation data
interface BlogCreateData {
  title: string;
  content: string;
  author: string;
}

class BlogService {
  // Create a blog
  static async createBlog(data: BlogCreateData): Promise<IBlog> {
    try {
      const blog = new Blog(data);
      return await blog.save();
    } catch (error: unknown) {
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
