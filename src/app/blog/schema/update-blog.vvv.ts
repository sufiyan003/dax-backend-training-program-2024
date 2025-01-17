// TODO: Update blog schema (all fields are optional)

import * as z from 'zod';

export const createBlogSchema = z.object({
  title: z.string(),
  content: z.string(),
  author: z.string(),
});

export type CreateBlogBody = z.infer<typeof createBlogSchema>;