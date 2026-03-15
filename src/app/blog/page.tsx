import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllContent,
  getReadingTime,
  type BlogFrontmatter,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Workshop notes documenting the journey from 'this will be easy' to 'why did I think this would be easy?'",
};

export default function BlogPage() {
  const posts = getAllContent<BlogFrontmatter>("blog")
    .filter((p) => p.frontmatter.status === "published")
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );

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

      {posts.length > 0 ? (
        <div className="mt-10 flex flex-col gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group border-b border-purple-tint pb-8 no-underline last:border-0"
            >
              <div className="flex items-center gap-3 font-sans text-sm text-text-secondary">
                <time>
                  {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span>&middot;</span>
                <span>{getReadingTime(post.content)} min read</span>
              </div>
              <h2 className="mt-2 font-sans text-xl font-semibold text-purple-primary group-hover:text-purple-secondary">
                {post.frontmatter.title}
              </h2>
              <p className="mt-2 font-serif text-text-secondary">
                {post.frontmatter.excerpt}
              </p>
              {post.frontmatter.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.frontmatter.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-purple-tint px-2 py-0.5 font-sans text-xs text-purple-dark"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-8 font-serif text-text-secondary">
          Blog posts coming soon — stay tuned.
        </p>
      )}
    </div>
  );
}
