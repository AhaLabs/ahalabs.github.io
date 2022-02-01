import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

interface FrontMatter {
  title: string;
  date: string;
}

export type Update = FrontMatter & {
  id: string;
  contentHtml: string;
};

const updatesDirectory = path.join(process.cwd(), "updates");

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

export function getUpdates() {
  // Get file names under /updates
  const fileNames = fs.readdirSync(updatesDirectory);
  const allUpdatesData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(updatesDirectory, fileName);
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
  // Sort updates by date
  return allUpdatesData.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
}

export async function getUpdate(date: string) {
  const updates = getUpdates();
  const update = updates.find((p) => p.date === date);
  if (!update) {
    throw new Error(
      `No update with date "${date}" found. Valid dates: ${updates
        .map((p) => p.date)
        .join("\n  - ")}`
    );
  }

  const fullPath = path.join(updatesDirectory, `${update.id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse out the metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id
  return {
    ...update,
    contentHtml,
  };
}
