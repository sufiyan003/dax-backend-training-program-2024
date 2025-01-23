import { Router, Request, Response, NextFunction } from 'express';
import { authentication } from '../../shared/middleware/authentication';
import validateBody from '../../shared/middleware/validateBody';
import BlogController from './blog.controller';
import { updateBlogSchema } from './schema/update-blog.valdation';
// import { authorization } from '../../shared/middleware/authorization';

// TODO: your-name/feature/soft-delete-blog
// TODO: Soft delete API
// TODO: Hard delete API
// TODO: Restore delete data API
// TODO: Get all trash data API

export class BlogRoutes {
  readonly router: Router = Router();
  private controller = new BlogController();

  constructor() {
    this.initRoutes();
  }

  private initRoutes(): void {
    console.log("Blog Routes initialized!");

    // Create a blog
    this.router.post(
      '/',
      // Authentication
      // Authrization,
      authentication,
      // authorization(['author', "admin"]),
      // validateBody(createBlogSchema),

      // blogController.createBlog,

      // BlogController.createBlog,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          //   @ts-ignore
          await this.controller.createBlog(req, res);
        } catch (err) {
          next(err);
        }
      }
    );

    // Get all blogs
    this.router.get(
      '/',
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          //   @ts-ignore
          await this.controller.getAllBlogs(req, res);
        } catch (err) {
          next(err);
        }
      }
    );

    // Get a single blog by ID
    this.router.get(
      '/:id',
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          await this.controller.getBlogById(req, res);
        } catch (err) {
          next(err);
        }
      }
    );

    // Update a blog by ID
    this.router.put(
      '/:id',
      validateBody(updateBlogSchema),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          await this.controller.updateBlog(req, res);
        } catch (err) {
          next(err);
        }
      }
    );

    // Delete a blog by ID
    this.router.delete(
      '/:id',
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          await this.controller.deleteBlog(req, res);
        } catch (err) {
          next(err);
        }
      }
    );

    // Get blogs by category with pagination
    this.router.get(
      '/category/:categoryId',
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          await this.controller.getBlogsByCategory(req, res);
        } catch (err) {
          next(err);
        }
      }
    );
  }
}

