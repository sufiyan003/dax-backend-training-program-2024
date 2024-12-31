import Blog, { IBlog } from './Blog.model';

class BlogRepository {
  // Create a new blog post
  async create(data: Omit<IBlog, 'createdAt' | 'updatedAt'>): Promise<IBlog> {
    const blog = new Blog(data);
    return await blog.save();
  }

  // Find all blog posts
  async findAll(): Promise<IBlog[]> {
    return await Blog.find();
  }

  // Find a blog post by its ID
  async findById(id: string): Promise<IBlog | null> {
    return await Blog.findById(id);
  }

  // Update a blog post by its ID
  async updateById(id: string, data: Partial<Omit<IBlog, 'createdAt' | 'updatedAt'>>): Promise<IBlog | null> {
    return await Blog.findByIdAndUpdate(
      id,
      { ...data, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
  }

  // Delete a blog post by its ID
  async deleteById(id: string): Promise<IBlog | null> {
    return await Blog.findByIdAndDelete(id);
  }
}

export default new BlogRepository();
