import { toString } from "mdast-util-to-string";

export function addLayoutToBlogPosts() {
  // All remark and rehype plugins return a separate function
  return function (tree, file) {
    if (!file.data.astro.frontmatter.layout) {
      file.data.astro.frontmatter.layout = "../../layouts/BlogPost.astro";
    }
  };
}
