import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

interface FrontMatter {
  title: string;
  date: string;
}

export type Post = FrontMatter & {
  id: string;
  contentHtml: string;
};

const postsDirectory = path.join(process.cwd(), "posts");

function checkFrontMatter(fileName: string, data: { [key: string]: any }) {
  ["title", "date"].forEach((attr) => {
    if (typeof data[attr] !== "string") {
      throw new Error(
        `Expected ${fileName} to specify "${attr}" as a string in its frontmatter, got ${typeof data[
          attr
        ]}`
      );
    }
  });

  return data as FrontMatter;
}

export function getPosts() {
  // Get file names under /posts
  let fileNames: string[];
  try {
    fileNames = fs.readdirSync(postsDirectory);
  } catch {
    fileNames = [];
  }
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the metadata section
    const matterResult = matter(fileContents);
    const frontMatter = checkFrontMatter(fileName, matterResult.data);

    // Combine the data with the id
    return {
      id,
      ...frontMatter,
    };
  });
  // Sort posts by date
  return allPostsData.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
}

export async function getPost(id: string): Promise<Post> {
  const fileName = `${id}.md`;
  const fullPath = path.join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse out the metadata section
  const matterResult = matter(fileContents);
  const frontMatter = checkFrontMatter(fileName, matterResult.data);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id
  return {
    id,
    ...frontMatter,
    contentHtml,
  };
}
