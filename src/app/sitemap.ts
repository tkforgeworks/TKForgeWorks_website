import type { MetadataRoute } from "next";
import {
  getAllContent,
  getAllTags,
  getContentSlugs,
  getPublishedPosts,
  type ProjectFrontmatter,
} from "@/lib/content";
import { tagPath } from "@/lib/feed";
import { SITE_URL } from "@/lib/site";

// Required by output: "export" so this route is rendered once at build time.
export const dynamic = "force-static";

// Generated at build time and written to out/sitemap.xml. Every URL ends in a
// slash to match next.config's trailingSlash setting, so the sitemap entries
// are byte-identical to the canonical URLs Next emits on each page.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about/`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/projects/`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/blog/`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/faq/`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact/`, changeFrequency: "yearly", priority: 0.4 },
  ];

  const projects: MetadataRoute.Sitemap = getAllContent<ProjectFrontmatter>(
    "projects"
  ).map((p) => ({
    url: `${SITE_URL}/projects/${p.slug}/`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Drafts are built as pages (so they can be previewed by URL) but are
  // noindex and must stay out of the sitemap.
  const posts: MetadataRoute.Sitemap = getPublishedPosts().map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}/`,
    lastModified: new Date(p.frontmatter.updated ?? p.frontmatter.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const privacy: MetadataRoute.Sitemap = getContentSlugs("privacy").map(
    (slug) => ({
      url: `${SITE_URL}/privacy/${slug}/`,
      changeFrequency: "yearly",
      priority: 0.3,
    })
  );

  const tags: MetadataRoute.Sitemap = getAllTags().map((t) => ({
    url: `${SITE_URL}${tagPath(t.slug)}`,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticPages, ...projects, ...posts, ...tags, ...privacy];
}
