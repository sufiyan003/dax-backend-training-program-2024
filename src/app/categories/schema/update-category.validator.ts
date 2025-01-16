import * as z from 'zod';

// Define the schema for updating a category
export const updateCategorySchema = z.object({
    name: z.string().min(1, 'Name is required').optional(),
});

// Infer the type for the update category body
export type UpdateCategoryBody = z.infer<typeof updateCategorySchema>;
