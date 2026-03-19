import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  getContentBySlug,
  markdownToHtml,
  type ProjectFrontmatter,
} from "@/lib/content";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export async function generateStaticParams() {
  const fs = await import("fs");
  const path = await import("path");
  const dir = path.join(process.cwd(), "content", "projects");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file: string) => file.endsWith(".md"))
    .map((file: string) => ({ slug: file.replace(/\.md$/, "") }));
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

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/projects"
        className="font-sans text-sm text-purple-secondary no-underline hover:text-purple-primary"
      >
        &larr; Back to Projects
      </Link>

      {frontmatter.heroImage && (
        <div className="mt-6 overflow-hidden rounded-lg">
          <Image
            src={frontmatter.heroImage}
            alt={frontmatter.heroAlt || frontmatter.title}
            width={800}
            height={450}
            className="h-auto w-full object-cover"
            priority
          />
        </div>
      )}

      <h1 className="mt-6 font-sans text-3xl font-bold text-purple-primary md:text-4xl">
        {frontmatter.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span
          className={`rounded-full px-3 py-1 font-sans text-xs font-medium ${statusClasses(frontmatter.status)}`}
        >
          {frontmatter.status}
        </span>
        {frontmatter.github && (
          <a
            href={frontmatter.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-sm text-purple-secondary no-underline hover:text-purple-primary"
          >
            GitHub
          </a>
        )}
        {frontmatter.demo && (
          <a
            href={frontmatter.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-sm text-purple-secondary no-underline hover:text-purple-primary"
          >
            Live Demo
          </a>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {frontmatter.tech.map((t) => (
          <span
            key={t}
            className="rounded bg-purple-tint px-2 py-0.5 font-mono text-xs text-purple-dark"
          >
            {t}
          </span>
        ))}
      </div>

      <article
        className="prose prose-lg mt-8 max-w-none font-serif text-text-primary"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}

function statusClasses(status: string): string {
  switch (status) {
    case "Active":
      return "bg-success-light text-success";
    case "Completed":
      return "bg-success-light text-success";
    case "Paused":
      return "bg-warning-light text-warning";
    case "Planning":
      return "bg-info-light text-info";
    default:
      return "bg-purple-tint text-purple-dark";
  }
}
