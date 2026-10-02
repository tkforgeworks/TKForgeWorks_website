import Link from "next/link";
import type { Tag } from "@/lib/content";
import { tagPath } from "@/lib/feed";

// Tag chips that link to each tag's page. Takes the post's tag slugs plus the
// tags.yml entries so it can show labels rather than slugs.
export default function TagList({
  slugs,
  tags,
  className = "",
}: {
  slugs: string[];
  tags: Tag[];
  className?: string;
}) {
  if (slugs.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {slugs.map((slug) => (
        <Link
          key={slug}
          href={tagPath(slug)}
          className="relative z-10 rounded bg-purple-tint px-2 py-0.5 font-sans text-xs text-purple-dark no-underline transition-colors hover:bg-purple-tint-hover"
        >
          {tags.find((t) => t.slug === slug)?.label ?? slug}
        </Link>
      ))}
    </div>
  );
}
