import type { Metadata } from "next";
import Link from "next/link";
import { getAllTags, getPostsForTag, getPublishedPosts } from "@/lib/content";
import { tagPath } from "@/lib/feed";
import PostList from "@/components/PostList";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Workshop notes documenting the journey from 'this will be easy' to 'why did I think this would be easy?'",
};

export default function BlogPage() {
  const posts = getPublishedPosts();
  // Only offer tags that have at least one published post behind them.
  const tags = getAllTags()
    .map((tag) => ({ ...tag, count: getPostsForTag(tag.slug).length }))
    .filter((tag) => tag.count > 0);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-sans text-3xl font-bold text-purple-primary md:text-4xl">
        Blog
      </h1>
      <p className="mt-2 max-w-2xl font-serif text-lg text-text-secondary">
        Welcome to my digital workshop notes, where I document the inevitable
        journey from &quot;this will be easy&quot; to &quot;why did I think this
        would be easy?&quot;
      </p>

      {tags.length > 0 && (
        <nav aria-label="Browse by tag" className="mt-6">
          <h2 className="font-sans text-sm font-medium text-text-secondary">
            Browse by tag
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag.slug}
                href={tagPath(tag.slug)}
                className="rounded bg-purple-tint px-2.5 py-1 font-sans text-sm text-purple-dark no-underline transition-colors hover:bg-purple-tint-hover"
              >
                {tag.label}{" "}
                <span className="text-text-secondary">({tag.count})</span>
              </Link>
            ))}
          </div>
        </nav>
      )}

      {posts.length > 0 ? (
        <div className="mt-10">
          <PostList posts={posts} />
        </div>
      ) : (
        <p className="mt-8 font-serif text-text-secondary">
          Blog posts coming soon — stay tuned.
        </p>
      )}
    </div>
  );
}
