import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { addLayoutToBlogPosts, remarkReadingTime } from './markdown-extensions.mjs';
import sitemap from '@astrojs/sitemap';

import image from "@astrojs/image";

// https://astro.build/config
export default defineConfig({
  site: 'https://ahalabs.dev',
	integrations: [mdx(), sitemap(), image({
		serviceEntryPoint: '@astrojs/image/sharp',
	})],
  markdown: {
    remarkPlugins: [addLayoutToBlogPosts, remarkReadingTime],
    extendDefaultPlugins: true
  }
});
