import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { remarkWikiVideo } from './src/plugins/remark-wiki-video.js';

export default defineConfig({
  devToolbar: { enabled: false },
  prefetch: true,
  site: 'https://hausofmatters-main.vercel.app/',
  integrations: [sitemap()],
  experimental: { svg: true },
  markdown: {
    remarkPlugins: [remarkWikiVideo],
  },
  vite: {
    optimizeDeps: {
      exclude: ['@astrojs/compiler']
    }
  }
});