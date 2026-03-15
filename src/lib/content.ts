import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const contentDirectory = path.join(process.cwd(), "content");

export interface ProjectFrontmatter {
  title: string;
  status: "Active" | "Paused" | "Completed" | "Planning";
  excerpt: string;
  tech: string[];
  featured: boolean;
  images?: string[];
  github?: string;
  demo?: string;
}

export interface BlogFrontmatter {
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  status: "published" | "draft";
}

export function getContentSlugs(type: "projects" | "blog"): string[] {
  const dir = path.join(contentDirectory, type);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export function getContentBySlug<T>(
  type: "projects" | "blog" | "pages",
  slug: string
): { frontmatter: T; content: string } | null {
  const fullPath = path.join(contentDirectory, type, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    frontmatter: data as T,
    content,
  };
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

export function getAllContent<T>(
  type: "projects" | "blog"
): { slug: string; frontmatter: T; content: string }[] {
  const slugs = getContentSlugs(type);
  return slugs
    .map((slug) => {
      const data = getContentBySlug<T>(type, slug);
      if (!data) return null;
      return { slug, ...data };
    })
    .filter(Boolean) as { slug: string; frontmatter: T; content: string }[];
}

export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}
