import { categoryLogger } from "../../shared/logger";
import { ICategory } from "./categories.model";
import CategoryRepository from "./categories.repository";
import { CreateCategoryBody } from "./schema/create-category.validator";
import { UpdateCategoryBody } from "./schema/update-category.validator";

class CategoryService {
  // Create a category
  async createCategory(data: CreateCategoryBody): Promise<ICategory> {
    try {
      return await CategoryRepository.create(data);
    } catch (error: unknown) {
      categoryLogger.error('Error creating Category:', error);
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  }

  // Get all Categories
  async getAllCategories(): Promise<ICategory[]> {
    try {
      return await CategoryRepository.findAll();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  }

  // Get a single category by ID
  async getCategoryById(id: string): Promise<ICategory | null> {
    try {
      const category = await CategoryRepository.findById(id);
      if (!category) throw new Error('category not found');
      return category;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  }

  // Update single category by ID
  async updateCategoryById(id: string, data: UpdateCategoryBody): Promise<ICategory | null> {
    try {
      const updateCategory = await CategoryRepository.updateById(id, data);
      if (!updateCategory) throw new Error('Category not found');
      return updateCategory;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  }

  // Delete a blog by ID
  async deleteCategory(id: string): Promise<ICategory | null> {
    try {
      const deleteCategory = await CategoryRepository.deleteById(id);
      if (!deleteCategory) throw new Error('Category not found');
      return deleteCategory;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  }
}
export default CategoryService