import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllTags, getPostsForTag, getTag } from "@/lib/content";
import { tagFeedPath } from "@/lib/feed";
import { alternatesWithFeed } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";
import PostList from "@/components/PostList";
import RssLink from "@/components/RssLink";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllTags().map((t) => ({ tag: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag: slug } = await params;
  const tag = getTag(slug);
  if (!tag) return { title: "Tag Not Found" };
  return {
    title: `Posts tagged “${tag.label}”`,
    description: tag.description,
    alternates: alternatesWithFeed({
      path: tagFeedPath(slug),
      title: `${tag.label} · ${SITE_NAME}`,
    }),
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag: slug } = await params;
  const tag = getTag(slug);
  if (!tag) notFound();
  const posts = getPostsForTag(slug);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/blog"
        className="font-sans text-sm text-purple-secondary no-underline hover:text-purple-primary"
      >
        &larr; Back to Blog
      </Link>

      <h1 className="mt-6 font-sans text-3xl font-bold text-purple-primary md:text-4xl">
        {tag.label}
      </h1>
      <p className="mt-2 max-w-2xl font-serif text-lg text-text-secondary">
        {tag.description}
      </p>
      <RssLink
        href={tagFeedPath(slug)}
        label={`Subscribe to ${tag.label} posts`}
        className="mt-4"
      />

      {posts.length > 0 ? (
        <div className="mt-10">
          <PostList posts={posts} />
        </div>
      ) : (
        <p className="mt-8 font-serif text-text-secondary">
          Nothing tagged {tag.label} yet. Subscribe above and you&apos;ll hear
          about it first.
        </p>
      )}
    </div>
  );
}
