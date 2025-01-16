// C-TODO: Update blog schema (all fields are optional)
import * as z from 'zod';

// Define the schema for updating a blog
export const updateBlogSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  author: z.string().min(1, 'Author is required').optional(),
});

// Infer the type for the update blog body
export type UpdateBlogBody = z.infer<typeof updateBlogSchema>;
