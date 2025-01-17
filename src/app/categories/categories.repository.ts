import Category, { ICategory } from './categories.model';

type CategoryRepoData = Pick<ICategory, 'name'>

interface UpdatedRepoData {
    name?: string | undefined;
}

class CategoryRepository {
    // Create a new category post
    static async create(data: CategoryRepoData): Promise<ICategory> {
        const category = new Category(data);
        return await category.save();
    }

    // Find all category posts
    static async findAll(): Promise<ICategory[]> {
        return await Category.find();
    }

    // Find a category post by its ID
    static async findById(id: string): Promise<ICategory | null> {
        return await Category.findById(id);
    }

    // Update a category post by its ID
    static async updateById(id: string, data: UpdatedRepoData): Promise<ICategory | null> {
        return await Category.findByIdAndUpdate(
            id,
            { ...data, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
    }

    // Delete a category post by its ID
    static async deleteById(id: string): Promise<ICategory | null> {
        return await Category.findByIdAndDelete(id);
    }

    static async findByName(name: string): Promise<ICategory | null> {
        return await Category.findOne({ name });
    }
}

export default CategoryRepository;
