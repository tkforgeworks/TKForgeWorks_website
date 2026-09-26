import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getContentBySlug,
  getContentSlugs,
  markdownToHtml,
  type PrivacyFrontmatter,
} from "@/lib/content";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getContentSlugs("privacy").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = getContentBySlug<PrivacyFrontmatter>("privacy", slug);
  if (!data) return { title: "Privacy Policy Not Found" };
  return {
    title: data.frontmatter.title,
    description: data.frontmatter.description,
  };
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getContentBySlug<PrivacyFrontmatter>("privacy", slug);
  if (!data) notFound();

  const htmlContent = await markdownToHtml(data.content);
  const { frontmatter } = data;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-sans text-3xl font-bold text-purple-primary md:text-4xl">
        {frontmatter.title}
      </h1>
      <p className="mt-2 font-mono text-sm text-text-secondary">
        Last updated{" "}
        <time dateTime={frontmatter.lastUpdated}>
          {frontmatter.lastUpdated}
        </time>
      </p>

      <article
        className="prose prose-lg mt-8 max-w-none font-serif text-text-primary"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}
