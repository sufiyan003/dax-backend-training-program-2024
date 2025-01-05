import User, { IUser } from './User';

export class UserRepository {
    // Create a new blog post
    async create(data: Omit<IUser, 'createdAt' | 'updatedAt'>): Promise<IUser> {
        const blog = new User(data);
        return await blog.save();
    }

    // Find all blog posts
    async findAll(): Promise<IUser[]> {
        return await User.find();
    }

    // Find a blog post by its ID
    async findById(id: string): Promise<IUser | null> {
        return await User.findById(id);
    }

    // Promise<IUserDocument | null>
    async findByEmail(email: string) {
        return User.findOne({ email });
    }

    // Update a blog post by its ID
    async updateById(id: string, data: Partial<Omit<IUser, 'createdAt' | 'updatedAt'>>): Promise<IUser | null> {
        return await User.findByIdAndUpdate(
            id,
            { ...data, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
    }

    // Delete a blog post by its ID
    async deleteById(id: string): Promise<IUser | null> {
        return await User.findByIdAndDelete(id);
    }
}
