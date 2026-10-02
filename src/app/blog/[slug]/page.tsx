import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllPosts,
  getAllTags,
  getContentBySlug,
  getPost,
  markdownToHtml,
  getReadingTime,
  type ProjectFrontmatter,
} from "@/lib/content";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { openGraphFor, blogPostingJsonLd } from "@/lib/seo";
import { SITE_AUTHOR } from "@/lib/site";
import TagList from "@/components/TagList";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = getPost(slug);
  if (!data) return { title: "Post Not Found" };
  const { title, excerpt, date, updated, tags, status, author } =
    data.frontmatter;
  return {
    title,
    description: excerpt,
    openGraph: openGraphFor({
      type: "article",
      url: `/blog/${slug}/`,
      publishedTime: date,
      modifiedTime: updated ?? date,
      authors: [author ?? SITE_AUTHOR],
      tags,
    }),
    // Drafts are still built so they can be previewed by URL, but they are
    // hidden from listings and the sitemap, and must not be indexed if a
    // crawler stumbles onto one.
    robots:
      status === "draft" ? { index: false, follow: false } : undefined,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getPost(slug);
  if (!data) notFound();

  const htmlContent = await markdownToHtml(data.content, {
    newTabLinks: true,
  });
  const { frontmatter } = data;
  const readingTime = getReadingTime(data.content);
  const projects = frontmatter.projects.map((projectSlug) => ({
    slug: projectSlug,
    title: getContentBySlug<ProjectFrontmatter>("projects", projectSlug)!
      .frontmatter.title,
  }));

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      {frontmatter.status === "published" && (
        <JsonLd data={blogPostingJsonLd({ slug, ...frontmatter })} />
      )}
      <Link
        href="/blog"
        className="font-sans text-sm text-purple-secondary no-underline hover:text-purple-primary"
      >
        &larr; Back to Blog
      </Link>

      <h1 className="mt-6 font-sans text-3xl font-bold text-purple-primary md:text-4xl">
        {frontmatter.title}
      </h1>

      <div className="mt-4 flex items-center gap-3 font-sans text-sm text-text-secondary">
        <time dateTime={frontmatter.date}>
          {new Date(frontmatter.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <span>&middot;</span>
        <span>{readingTime} min read</span>
      </div>

      <TagList slugs={frontmatter.tags} tags={getAllTags()} className="mt-3" />

      {projects.length > 0 && (
        <p className="mt-3 font-sans text-sm text-text-secondary">
          Part of:{" "}
          {projects.map((project, i) => (
            <span key={project.slug}>
              {i > 0 && ", "}
              <Link
                href={`/projects/${project.slug}`}
                className="text-purple-secondary hover:text-purple-primary"
              >
                {project.title}
              </Link>
            </span>
          ))}
        </p>
      )}

      <article
        className="prose prose-lg mt-8 max-w-none font-serif text-text-primary"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}
