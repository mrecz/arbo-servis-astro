// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://arbo-servis.cz',
  integrations: [
    react(),
    sitemap({
      filter: page => !page.includes('404'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
  output: 'static',
});
