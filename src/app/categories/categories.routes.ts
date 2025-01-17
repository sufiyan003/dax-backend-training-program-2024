// TODO: Implement OOPs based routing (like assets.routes.ts)
import express, { NextFunction, Request, Response } from 'express';
import CategoryController from './categories.controller';

const router = express.Router();
const categoryController = new CategoryController()

// Create Category
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        await categoryController.createCategory(req, res)
    }
    catch (e) {
        next(e)
    }
})

// Get All Categories
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        await categoryController.getAllCategories(req, res)
    }
    catch (e) {
        next(e)
    }
})

// Get Category by ID
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        await categoryController.getCategoryById(req, res);
    }
    catch (e) {
        next(e)
    }
})

// Update Category by ID
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        await categoryController.updateCategory(req, res)
    }
    catch (e) {
        next(e)
    }
})

// Delete Category by ID
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        await categoryController.deleteCategory(req, res)
    }
    catch (e) {
        next(e)
    }
})

export default router;
