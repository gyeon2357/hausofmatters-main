import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  devToolbar: { enabled: false },
  prefetch: true,
  site: 'https://hausofmatters-main.vercel.app/',
  integrations: [sitemap()],
  experimental: { svg: true },
  vite: {
    optimizeDeps: {
      exclude: ['@astrojs/compiler']
    }
  }
});