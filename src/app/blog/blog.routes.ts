import express, { Request, Response, NextFunction } from 'express';
import BlogController from './blog.controller';
import validateBody from '../../shared/middleware/validateBody';
import { createBlogSchema } from './schema/create-blog.validator';

const router = express.Router();

// Create a blog
router.post(
  '/',
  validateBody(createBlogSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await BlogController.createBlog(req, res);
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
      await BlogController.getAllBlogs(req, res);
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
      await BlogController.getBlogById(req, res);
    } catch (err) {
      next(err);
    }
  }
);

// Update a blog by ID
router.put(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await BlogController.updateBlog(req, res);
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
      await BlogController.deleteBlog(req, res);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
