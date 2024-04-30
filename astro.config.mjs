import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { mermaid } from "./src/plugins/mermaid";
import {
  addLayoutToBlogPosts,
  remarkReadingTime,
} from "./markdown-extensions.mjs";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://ahalabs.dev",
  integrations: [mdx(), sitemap()],
  markdown: {
    remarkPlugins: [addLayoutToBlogPosts, remarkReadingTime, mermaid],
    extendDefaultPlugins: true,
  },
});
