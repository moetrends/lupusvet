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
      // Panel boş alanları null olarak yazabilir.
      service: z.string().nullish(),
      source: z.string().url().nullish(),
    }),
});

// Sayfa metinleri: yönetim panelindeki "Sayfalar" bölümü bu JSON dosyalarını düzenler.
const page = (name: string, schema: Parameters<typeof defineCollection>[0]['schema']) =>
  defineCollection({ loader: glob({ pattern: `${name}.json`, base: './src/content/pages' }), schema });

const seo = z.object({ title: z.string().min(10).max(70), description: z.string().min(50).max(170) });
const pic = (image: () => any) => z.object({ image: image(), alt: z.string() });

const anasayfa = page('anasayfa', ({ image }) =>
  z.object({
    seo,
    hero: z.object({ title: z.string(), lead: z.string(), image: image(), imageAlt: z.string(), caption: z.string(), inClinic: z.string() }),
    services: z.object({ title: z.string(), intro: z.string() }),
    vet: z.object({ image: image(), imageAlt: z.string(), text: z.string() }),
    wall: z.object({ title: z.string(), text: z.string() }),
    location: z.object({ image: image(), imageAlt: z.string() }),
  }),
);

const hakkimizda = page('hakkimizda', ({ image }) =>
  z.object({
    seo,
    title: z.string(),
    body: z.string(),
    image: image(),
    imageAlt: z.string(),
    equipmentTitle: z.string(),
    equipmentIntro: z.string(),
    highlights: z.array(pic(image).extend({ title: z.string(), text: z.string() })),
    roomImage: image(),
    roomImageAlt: z.string(),
  }),
);

const hekim = page('hekim', ({ image }) =>
  z.object({
    seo,
    subtitle: z.string(),
    bio: z.string(),
    portrait: image(),
    portraitAlt: z.string(),
    whyLupus: z.string(),
    drawing: image().optional(),
    drawingAlt: z.string().default(''),
    drawingCaption: z.string().default(''),
    gallery: z.array(pic(image)),
    examSteps: z.array(z.string()),
    examImage: image(),
    examImageAlt: z.string(),
  }),
);

const hastaDuvari = page('hasta-duvari', ({ image }) => z.object({ photos: z.array(pic(image)) }));

export const collections = { services, blog, anasayfa, hakkimizda, hekim, hastaDuvari };
