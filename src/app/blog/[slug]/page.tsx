import type { Metadata } from "next";
import Link from "next/link";
import {
  getContentBySlug,
  getContentSlugs,
  markdownToHtml,
  getReadingTime,
  type BlogFrontmatter,
} from "@/lib/content";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getContentSlugs("blog").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = getContentBySlug<BlogFrontmatter>("blog", slug);
  if (!data) return { title: "Post Not Found" };
  return {
    title: data.frontmatter.title,
    description: data.frontmatter.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getContentBySlug<BlogFrontmatter>("blog", slug);
  if (!data) notFound();

  const htmlContent = await markdownToHtml(data.content);
  const { frontmatter } = data;
  const readingTime = getReadingTime(data.content);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
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
        <time>
          {new Date(frontmatter.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <span>&middot;</span>
        <span>{readingTime} min read</span>
      </div>

      {frontmatter.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {frontmatter.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-purple-tint px-2 py-0.5 font-sans text-xs text-purple-dark"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <article
        className="prose prose-lg mt-8 max-w-none font-serif text-text-primary"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}
