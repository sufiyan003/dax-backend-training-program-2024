import Blog, { IBlog } from './Blog.model';

class BlogRepository {
  async create(data: Omit<IBlog, 'createdAt' | 'updatedAt'>) {
    const blog = new Blog(data);
    return await blog.save();
  }

  async findAll() {
    return await Blog.find();
  }

  async findById(id) {
    return await Blog.findById(id);
  }

  async updateById(id, data) {
    return await Blog.findByIdAndUpdate(
      id,
      { ...data, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
  }

  async deleteById(id) {
    return await Blog.findByIdAndDelete(id);
  }
}

export default new BlogRepository();
