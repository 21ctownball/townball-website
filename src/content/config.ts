import { defineCollection, z } from 'astro:content';

const general = defineCollection({ type: 'content' });

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    author: z.string().default('Anonymous'),
    date: z.date(),
    thumbnail: z.string().optional(),
  }),
});

export const collection = {
  general,
  posts,
};
