import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import gfm from "remark-gfm";
import html from "remark-html";
import { defaultSchema } from "hast-util-sanitize";
import type { Nodes, Root } from "mdast";

const contentDirectory = path.join(process.cwd(), "content");

export interface ProjectFrontmatter {
  title: string;
  /** Search-facing <title> (still gets the "| TK ForgeWorks" suffix). Use it
   *  when the display title alone says nothing about what the project is,
   *  e.g. "Anvil". Cards and the page heading keep using title. */
  metaTitle?: string;
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

// Blog posts open every link in a new tab so following one never pulls the
// reader out of the post. Same-page "#" anchors (footnotes, section jumps)
// are left alone. The arrow marker is added in CSS off a[target="_blank"].
function openLinksInNewTab() {
  const walk = (node: Nodes) => {
    if (
      (node.type === "link" && !node.url.startsWith("#")) ||
      node.type === "linkReference"
    ) {
      node.data = {
        ...node.data,
        hProperties: {
          ...node.data?.hProperties,
          target: "_blank",
          rel: ["noopener", "noreferrer"],
        },
      };
    }
    if ("children" in node) node.children.forEach(walk);
  };
  return (tree: Root) => walk(tree);
}

// remark-html sanitizes its output and the default schema drops target/rel
// from links, so allow just those two on <a>.
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    a: [...(defaultSchema.attributes?.a ?? []), "target", "rel"],
  },
};

// remark alone is CommonMark only, which has no strikethrough, tables, task
// lists or footnotes. remark-gfm adds them so authored markdown renders the
// same here as it does in GitHub/editor previews.
export async function markdownToHtml(
  markdown: string,
  { newTabLinks = false }: { newTabLinks?: boolean } = {}
): Promise<string> {
  const processor = remark().use(gfm).use(demoteTopLevelHeadings);
  if (newTabLinks) processor.use(openLinksInNewTab);
  const result = await processor
    .use(html, { sanitize: sanitizeSchema })
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
