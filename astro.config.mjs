import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://lupusveteriner.com',
  trailingSlash: 'never',
  build: { format: 'directory' },
  // Sayfalar statik üretilir; yalnızca /keystatic yönetim paneli sunucuda çalışır.
  adapter: vercel(),
  integrations: [
    mdx(),
    react(),
    keystatic(),
    sitemap({
      filter: (page) => !page.includes('/404') && !page.includes('/keystatic'),
      i18n: { defaultLocale: 'tr', locales: { tr: 'tr-TR' } },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
