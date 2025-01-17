import Blog, { IBlog } from './Blog.model';

type BlogRepoData = Pick<IBlog, 'title' | 'content' | 'author' | 'categoryId'>;

interface UpdatedRepoData {
  title?: string | undefined;
  content?: string | undefined;
  author?: string | undefined;
}

class BlogRepository {
  // Create a new blog post
  static async create(data: BlogRepoData): Promise<IBlog> {
    const blog = new Blog(data);
    return await blog.save();
  }

  // Find all blog posts
  static async findAll(): Promise<IBlog[]> {
    return await Blog.find();
  }

  // Find a blog post by its ID
  static async findById(id: string): Promise<IBlog | null> {
    return await Blog.findById(id);
  }

  // Update a blog post by its ID
  static async updateById(id: string, data: UpdatedRepoData): Promise<IBlog | null> {
    return await Blog.findByIdAndUpdate(
      id,
      { ...data, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
  }

  // Delete a blog post by its ID
  static async deleteById(id: string): Promise<IBlog | null> {
    return await Blog.findByIdAndDelete(id);
  }

  // Find blog posts by category with pagination
  static async findByCategory(categoryId: string, offset: number, limit: number): Promise<IBlog[]> {
    return await Blog.find({ categoryId })
      .skip(offset)
      .limit(limit)
      .exec();
  }

  // Count blog posts by category
  static async countByCategory(categoryId: string): Promise<number> {
    return await Blog.countDocuments({ categoryId }).exec();
  }
}

export default BlogRepository;
