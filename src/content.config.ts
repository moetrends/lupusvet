import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const services = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/services' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      seoTitle: z.string(),
      short: z.string().min(50).max(170),
      order: z.number(),
      hero: image(),
      heroAlt: z.string(),
      includes: z.array(z.string()),
      faq: z.array(z.object({ q: z.string(), a: z.string() })).min(3),
      related: z.array(z.string()).default([]),
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().min(50).max(170),
      date: z.coerce.date(),
      category: z.enum(['bilgi', 'vaka']),
      hero: image(),
      heroAlt: z.string(),
      service: z.string().optional(),
      source: z.string().url().optional(),
    }),
});

export const collections = { services, blog };
