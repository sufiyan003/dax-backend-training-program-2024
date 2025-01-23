import { Request, Response } from 'express';
import CategoryService from "./categories.service"
import { CreateCategoryBody } from "./schema/create-category.validator";
import { UpdateCategoryBody } from './schema/update-category.validator';

class CategoryController {
    private readonly service: CategoryService = new CategoryService()

    // Create a category
    async createCategory(req: Request, res: Response): Promise<Response> {
        try {
            const body = req.body as CreateCategoryBody;
            const category = await this.service.createCategory(body);
            return res.status(201).json(category);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    // Get All Categories
    async getAllCategories(_: Request, res: Response): Promise<Response> {
        try {
            const categories = await this.service.getAllCategories();
            return res.status(200).json(categories);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Get a single category by ID
    async getCategoryById(req: Request, res: Response): Promise<Response> {
        try {
            const category = await this.service.getCategoryById(req.params.id);
            if (!category) {
                return res.status(404).json({ error: 'category not found' });
            }
            return res.status(200).json(category);
        } catch (error: any) {
            return res.status(404).json({ error: error.message });
        }
    }

    // Update a category by ID
    async updateCategory(req: Request, res: Response): Promise<Response> {
        try {
            const body = req.body as UpdateCategoryBody;
            const category = await this.service.updateCategoryById(req.params.id, body);
            if (!category) {
                return res.status(404).json({ error: 'category not found' });
            }
            return res.status(200).json(category);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    // Delete a category by ID
    async deleteCategory(req: Request, res: Response): Promise<Response> {
        try {
            const result = await this.service.deleteCategory(req.params.id);
            if (!result) {
                return res.status(404).json({ error: 'Category not found' });
            }
            return res.status(200).json({ message: 'Category deleted successfully' });
        } catch (error: any) {
            return res.status(404).json({ error: error.message });
        }
    }
}

export default CategoryController