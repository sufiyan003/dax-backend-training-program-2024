// TODO: Implement OOP based routing (like assets.routes.ts)
import express, { NextFunction, Request, Response } from 'express';
import { authentication } from '../../shared/middleware/authentication';
import validateBody from '../../shared/middleware/validateBody';
import BlogController from './blog.controller';
import { updateBlogSchema } from './schema/update-blog.valdation';

// import { createBlogSchema } from './schema/create-blog.validator';


const router = express.Router();
const blogController = new BlogController(); // Create an instance

// Create a blog
router.post(
  '/',
  // Authentication
  // Authrization
  authentication,
  // validateBody(createBlogSchema),

  // blogController.createBlog,

  // BlogController.createBlog,
  async (req: Request, res: Response, next: NextFunction) => {

    try {
      await blogController.createBlog(req, res);
    } catch (err) {
      next(err);
    }
  }
);

// Get all blogs
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await blogController.getAllBlogs(req, res);
    } catch (err) {
      next(err);
    }
  }
);

// Get a single blog by ID
router.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await blogController.getBlogById(req, res);
    } catch (err) {
      next(err);
    }
  }
);

// Update a blog by ID
router.put(
  '/:id',
  validateBody(updateBlogSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await blogController.updateBlog(req, res);
    } catch (err) {
      next(err);
    }
  }
);

// Delete a blog by ID
router.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await blogController.deleteBlog(req, res);
    } catch (err) {
      next(err);
    }
  }
);

// Get blogs by category with pagination
router.get(
  '/category/:categoryId', // :categoryId is part of the route parameters
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Pass query parameters (page and limit) to the controller method
      await blogController.getBlogsByCategory(req, res);
    } catch (err) {
      next(err); // Pass error to the next middleware (error handler)
    }
  }
);

export default router;
