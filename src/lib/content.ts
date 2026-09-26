import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import gfm from "remark-gfm";
import html from "remark-html";
import type { Root } from "mdast";

const contentDirectory = path.join(process.cwd(), "content");

export interface ProjectFrontmatter {
  title: string;
  status: "Active" | "Paused" | "Completed" | "Planning";
  excerpt: string;
  tech: string[];
  featured: boolean;
  heroImage?: string;
  heroAlt?: string;
  images?: string[];
  github?: string;
  demo?: string;
}

export interface BlogFrontmatter {
  title: string;
  date: string;
  /** Optional YYYY-MM-DD of the last substantive edit. Feeds the sitemap
   *  lastmod, article:modified_time and JSON-LD dateModified. */
  updated?: string;
  excerpt: string;
  tags: string[];
  status: "published" | "draft";
  /** Optional byline override for this post's article metadata and JSON-LD.
   *  Defaults to SITE_AUTHOR in src/lib/site.ts. */
  author?: string;
}

export interface PageFrontmatter {
  title: string;
  description?: string;
  /** Overrides the <title> completely (no "| TK ForgeWorks" suffix). */
  metaTitle?: string;
  /** Overrides the meta description shown in search results. */
  metaDescription?: string;
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

// Every page already renders its frontmatter title as the <h1>, so a "# "
// heading in markdown produces a second h1 and muddles the page outline for
// search engines. Rather than fail the build, demote any h1 in content to h2
// (and shift nothing else) so the page keeps exactly one h1.
function demoteTopLevelHeadings() {
  return (tree: Root) => {
    for (const node of tree.children) {
      if (node.type === "heading" && node.depth === 1) node.depth = 2;
    }
  };
}

// remark alone is CommonMark only, which has no strikethrough, tables, task
// lists or footnotes. remark-gfm adds them so authored markdown renders the
// same here as it does in GitHub/editor previews.
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(gfm)
    .use(demoteTopLevelHeadings)
    .use(html)
    .process(markdown);
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
