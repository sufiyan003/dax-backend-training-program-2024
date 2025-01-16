import * as z from 'zod';

export const createBlogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  author: z.string().min(1, 'Author is required'),
  categoryId: z.string().min(1, 'Category Id is required')
});

export type CreateBlogBody = z.infer<typeof createBlogSchema>;