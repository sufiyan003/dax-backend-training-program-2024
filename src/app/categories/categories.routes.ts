// TODO: Implement OOPs based routing (like assets.routes.ts)
import express, { Router } from 'express';
import CategoryController from './categories.controller';

// c

class CategoryRoutes {
    public router: Router;
    private categoryController: CategoryController;
  
    constructor() {
      this.router = express.Router();
      this.categoryController = new CategoryController();
      this.initializeRoutes();
    }
  
    private initializeRoutes(): void {
      // Create Category
      this.router.post("/", this.wrapAsync(this.categoryController.createCategory.bind(this.categoryController)));
  
      // Get All Categories
      this.router.get("/", this.wrapAsync(this.categoryController.getAllCategories.bind(this.categoryController)));
  
      // Get Category by ID
      this.router.get("/:id", this.wrapAsync(this.categoryController.getCategoryById.bind(this.categoryController)));
  
      // Update Category by ID
      this.router.put("/:id", this.wrapAsync(this.categoryController.updateCategory.bind(this.categoryController)));
  
      // Delete Category by ID
      this.router.delete("/:id", this.wrapAsync(this.categoryController.deleteCategory.bind(this.categoryController)));
    }
  
    // Helper to handle async errors
    private wrapAsync(fn: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<any>) {
      return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        fn(req, res, next).catch(next);
      };
    }
  }
  
  export default new CategoryRoutes().router;
