import fs from "fs";
import path from "path";
import matter from "gray-matter";
import yaml from "js-yaml";
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
  /** Tag slugs; each must be a key in content/tags.yml. */
  tags: string[];
  /** Project slugs (content/projects/ filenames without .md). The file may
   *  give a single string or a list; posts from getAllPosts() always have a
   *  list, empty when the post isn't about a specific project. */
  projects: string[];
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

// Per-app privacy policies (Google Play and the apps' About screens link to
// /privacy/<app-slug>/). Plain, dated policy text, not marketing copy.
export interface PrivacyFrontmatter {
  title: string;
  /** Product name as it appears in the store listing. */
  app: string;
  description: string;
  /** YYYY-MM-DD the policy last changed; shown on the page. */
  lastUpdated: string;
}

export function getContentSlugs(
  type: "projects" | "blog" | "privacy"
): string[] {
  const dir = path.join(contentDirectory, type);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export function getContentBySlug<T>(
  type: "projects" | "blog" | "pages" | "privacy",
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

// Blog posts go through getAllPosts() instead, which validates their tags and
// project links.
export function getAllContent<T>(
  type: "projects"
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

export interface Tag {
  slug: string;
  label: string;
  description: string;
}

export interface Post {
  slug: string;
  frontmatter: BlogFrontmatter;
  content: string;
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Blog URLs that a post filename would collide with.
const RESERVED_POST_SLUGS = new Set(["tags"]);

// Tags live in one hand-edited file so a typo can't quietly start a new tag.
// Read on every call rather than cached so edits show up in `next dev`.
export function getAllTags(): Tag[] {
  const file = path.join(contentDirectory, "tags.yml");
  if (!fs.existsSync(file)) return [];
  const raw = yaml.load(fs.readFileSync(file, "utf8")) ?? {};
  if (typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error(
      "content/tags.yml must map each tag slug to { label, description }."
    );
  }
  return Object.entries(raw as Record<string, unknown>)
    .map(([slug, value]) => {
      if (!SLUG_PATTERN.test(slug)) {
        throw new Error(
          `content/tags.yml: "${slug}" is not a valid tag slug. Use lowercase letters, numbers and hyphens.`
        );
      }
      const { label, description } = (value ?? {}) as Partial<Tag>;
      if (typeof label !== "string" || typeof description !== "string") {
        throw new Error(
          `content/tags.yml: tag "${slug}" needs both a label and a description.`
        );
      }
      return { slug, label, description };
    })
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function getTag(slug: string): Tag | undefined {
  return getAllTags().find((t) => t.slug === slug);
}

function toStringList(value: unknown, key: string, file: string): string[] {
  if (value === undefined || value === null) return [];
  if (typeof value === "string") return [value];
  if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
    return value;
  }
  throw new Error(`${file}: "${key}" must be a string or a list of strings.`);
}

// Checks a post's tags and project links against tags.yml and
// content/projects/ so a bad reference fails the build instead of silently
// dropping the post from a tag page, project page or feed.
function parsePostFrontmatter(
  slug: string,
  data: Record<string, unknown>,
  tagSlugs: Set<string>,
  projectSlugs: Set<string>
): BlogFrontmatter {
  const file = `content/blog/${slug}.md`;
  if (RESERVED_POST_SLUGS.has(slug)) {
    throw new Error(`${file}: "${slug}" is reserved by /blog/${slug}/. Rename the file.`);
  }

  // YAML keys are case-sensitive, so "Projects:" would otherwise be ignored.
  for (const key of ["tags", "projects"]) {
    const miscased = Object.keys(data).find(
      (k) => k !== key && k.toLowerCase() === key
    );
    if (miscased) {
      throw new Error(`${file}: frontmatter key "${miscased}" must be lowercase "${key}".`);
    }
  }

  const tags = toStringList(data.tags, "tags", file);
  for (const tag of tags) {
    if (!tagSlugs.has(tag)) {
      throw new Error(
        `${file}: tag "${tag}" is not defined in content/tags.yml. Add it there or fix the spelling.`
      );
    }
  }

  const projects = toStringList(data.projects, "projects", file);
  for (const project of projects) {
    if (!projectSlugs.has(project)) {
      throw new Error(
        `${file}: project "${project}" doesn't match a file in content/projects/. Expected one of: ${[...projectSlugs].join(", ")}.`
      );
    }
  }

  return { ...(data as unknown as BlogFrontmatter), tags, projects };
}

/** Every post, drafts included (drafts are still built for preview by URL). */
export function getAllPosts(): Post[] {
  const tagSlugs = new Set(getAllTags().map((t) => t.slug));
  const projectSlugs = new Set(getContentSlugs("projects"));
  return getContentSlugs("blog").map((slug) => {
    const { frontmatter, content } = getContentBySlug<Record<string, unknown>>(
      "blog",
      slug
    )!;
    return {
      slug,
      frontmatter: parsePostFrontmatter(slug, frontmatter, tagSlugs, projectSlugs),
      content,
    };
  });
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

/** Published posts, newest first. Drafts never appear in listings or feeds. */
export function getPublishedPosts(): Post[] {
  return getAllPosts()
    .filter((p) => p.frontmatter.status === "published")
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
}

export function getPostsForProject(projectSlug: string): Post[] {
  return getPublishedPosts().filter((p) =>
    p.frontmatter.projects.includes(projectSlug)
  );
}

export function getPostsForTag(tagSlug: string): Post[] {
  return getPublishedPosts().filter((p) => p.frontmatter.tags.includes(tagSlug));
}

export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}
