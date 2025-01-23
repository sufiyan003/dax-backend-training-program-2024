
import * as z from 'zod';

export const createBlogSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  author: z.string().optional(),
});

export type CreateBlogBody = z.infer<typeof createBlogSchema>;