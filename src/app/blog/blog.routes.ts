import express, { NextFunction, Request, Response } from 'express';
import validateBody from '../../shared/middleware/validateBody';
import BlogController from './blog.controller';
import { updateBlogSchema } from './schema/update-blog.valdation';

const router = express.Router();

// Create a blog
router.post(
  '/',
  // Authentication
  // Authrization
  // async (req: Request, _res: Response, next: NextFunction) => {
  //   if (!req.headers.authorization) {
  //     throw new Error("Your are not auth")
  //   }
  //   const bearerToken = req.headers.authorization.split('Bearer ')[1]
  //   console.log({ bearerToken });

  //   await JwtService.validate(bearerToken);
  //   next();
  // },
  // validateBody(createBlogSchema),
  // BlogController.createBlog,
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
  validateBody(updateBlogSchema),
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
