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
  if (typeof data.title !== "string") {
    throw new Error(
      `Expected ${fileName} to specify "title" as a string in its frontmatter, got ${typeof data.title}`
    );
  }

  if (typeof data.date !== "string") {
    throw new Error(
      `Expected ${fileName} to specify "date" as a string in its frontmatter, got ${typeof data.date}`
    );
  }

  return data as FrontMatter;
}

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
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

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);

  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);
  const frontMatter = checkFrontMatter(id, matterResult.data);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id
  return {
    id,
    contentHtml,
    ...frontMatter,
  };
}
