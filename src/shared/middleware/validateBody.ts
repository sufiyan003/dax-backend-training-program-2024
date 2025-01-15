import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

const validateBody = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body); // Correct method for Zod
      next(); // Proceed to next middleware if validation passes
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({ errors: err.errors }); // Send Zod validation errors
      } else {
        next(err); // Pass other errors to error-handling middleware
      }
    }
  };
};

export default validateBody;
