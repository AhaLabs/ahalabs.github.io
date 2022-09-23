import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

export function remarkReadingTime() {
  return function (tree, { data }) {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);
    // readingTime.text will give us minutes read as a friendly string,
    // i.e. "3 min read"
    data.astro.frontmatter.readTime = readingTime.text;
  };
}

export function addLayoutToBlogPosts() {
  // All remark and rehype plugins return a separate function
  return function (tree, file) {
    file.data.astro.frontmatter.layout = '../../layouts/BlogPost.astro';
  }
}
