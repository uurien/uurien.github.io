// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// Deployed via GitHub Pages under the custom domain www.ugaitz.info (see public/CNAME).
// No `base` is set because the site is served from the domain root, not a /repo-name path.
export default defineConfig({
  site: 'https://www.ugaitz.info',
  integrations: [mdx()],
});
