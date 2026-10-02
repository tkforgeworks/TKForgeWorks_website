import Link from "next/link";
import { getAllTags, getReadingTime, type Post } from "@/lib/content";
import TagList from "@/components/TagList";

// Post summaries for the blog index, tag pages and project pages. The title
// link is stretched over the whole entry (after:inset-0) so the entry stays
// clickable, while the tag links sit above it; nesting the tag links inside
// one big <a> would be invalid HTML.
export default function PostList({
  posts,
  headingLevel = "h2",
}: {
  posts: Post[];
  headingLevel?: "h2" | "h3";
}) {
  const tags = getAllTags();
  const Heading = headingLevel;
  return (
    <div className="flex flex-col gap-8">
      {posts.map((post) => (
        <article
          key={post.slug}
          className="group relative border-b border-purple-tint pb-8 last:border-0"
        >
          <div className="flex items-center gap-3 font-sans text-sm text-text-secondary">
            <time dateTime={post.frontmatter.date}>
              {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>&middot;</span>
            <span>{getReadingTime(post.content)} min read</span>
          </div>
          <Heading className="mt-2 font-sans text-xl font-semibold">
            <Link
              href={`/blog/${post.slug}`}
              className="text-purple-primary no-underline after:absolute after:inset-0 group-hover:text-purple-secondary"
            >
              {post.frontmatter.title}
            </Link>
          </Heading>
          <p className="mt-2 font-serif text-text-secondary">
            {post.frontmatter.excerpt}
          </p>
          <TagList
            slugs={post.frontmatter.tags}
            tags={tags}
            className="mt-3"
          />
        </article>
      ))}
    </div>
  );
}
