import { Post } from "@/interfaces/post";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { join } from "path";

// export function getPostSlugs() {
//   return fs.readdirSync(postsDirectory);
// }

const POST_DIRECTORY = join(process.cwd(), "_posts");

function getPostDir(directory: string) {
  let mdFiles: string[] = [];

  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);

    if (fs.statSync(filePath).isDirectory()) {
      mdFiles = mdFiles.concat(getPostDir(filePath));
    } else {
      if (path.extname(filePath) === ".md") {
        mdFiles.push(filePath);
      }
    }
  }

  return mdFiles;
}

export function getPostSlugs() {
  const mdFiles = getPostDir(POST_DIRECTORY);
  return mdFiles.map((f) =>
    f.replace(POST_DIRECTORY, "").slice(1).replace(/\.md$/, "")
  );
}

export function getPostBySlug(slug: string) {
  const fullPath = join(POST_DIRECTORY, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return { ...data, slug, content } as Post;
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((s) => s.publish)
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
