import { defineConfig } from 'astro/config';
import { siteConfig } from './src/data/site.mjs';

export default defineConfig({
  site: siteConfig.origin,
  base: siteConfig.base,
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
