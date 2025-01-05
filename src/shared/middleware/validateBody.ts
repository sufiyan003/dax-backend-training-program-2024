import { Request, Response, NextFunction } from 'express';

const validateBody = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Perform schema validation
      schema.validateSync(req.body); // Example, adjust as per your validation logic
      next(); // If validation passes, proceed to next middleware
    } catch (err: unknown) {
      // Type assertion to 'any' or more specific error type
      res.status(400).json({ error: (err as any).errors });
    }
  };
};

export default validateBody;
