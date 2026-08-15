import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  getContentBySlug,
  getContentSlugs,
  markdownToHtml,
  type ProjectFrontmatter,
} from "@/lib/content";
import { statusClasses } from "@/lib/status";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getContentSlugs("projects").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = getContentBySlug<ProjectFrontmatter>("projects", slug);
  if (!data) return { title: "Project Not Found" };
  return {
    title: data.frontmatter.title,
    description: data.frontmatter.excerpt,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getContentBySlug<ProjectFrontmatter>("projects", slug);
  if (!data) notFound();

  const htmlContent = await markdownToHtml(data.content);
  const { frontmatter } = data;
  const galleryImages = frontmatter.images ?? [];

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/projects"
        className="font-sans text-sm text-purple-secondary no-underline hover:text-purple-primary"
      >
        &larr; Back to Projects
      </Link>

      <h1 className="mt-6 font-sans text-3xl font-bold text-purple-primary md:text-4xl">
        {frontmatter.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span
          className={`inline-block rounded-full px-3 py-1 font-sans text-sm font-medium ${statusClasses(frontmatter.status)}`}
        >
          {frontmatter.status}
        </span>
        {frontmatter.github && (
          <a
            href={frontmatter.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-sm text-purple-secondary hover:text-purple-primary"
          >
            GitHub ↗
          </a>
        )}
        {frontmatter.demo && (
          <a
            href={frontmatter.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-sm text-purple-secondary hover:text-purple-primary"
          >
            Live Demo ↗
          </a>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {frontmatter.tech.map((t) => (
          <span
            key={t}
            className="rounded bg-purple-tint px-2 py-0.5 font-mono text-xs text-purple-dark"
          >
            {t}
          </span>
        ))}
      </div>

      {frontmatter.heroImage && (
        <div className="mt-8 overflow-hidden rounded-lg">
          <Image
            src={frontmatter.heroImage}
            alt={frontmatter.heroAlt ?? frontmatter.title}
            width={1200}
            height={675}
            className="h-auto w-full object-cover"
            priority
          />
        </div>
      )}

      <article
        className="prose prose-lg mt-8 max-w-none font-serif text-text-primary"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {galleryImages.length > 0 && (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {galleryImages.map((src) => (
            <div key={src} className="overflow-hidden rounded-lg">
              <Image
                src={src}
                alt={`${frontmatter.title} screenshot`}
                width={800}
                height={500}
                className="h-auto w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
