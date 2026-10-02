import { getAllTags, getPostsForTag, getTag } from "@/lib/content";
import { buildFeed, tagFeedPath, tagPath } from "@/lib/feed";
import { SITE_NAME } from "@/lib/site";

// One feed per tag in content/tags.yml, written to
// out/blog/tags/<tag>/feed.xml at build time.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTags().map((t) => ({ tag: t.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tag: string }> }
) {
  const { tag: slug } = await params;
  const tag = getTag(slug)!;
  return buildFeed({
    title: `${tag.label} · ${SITE_NAME}`,
    description: tag.description,
    link: tagPath(slug),
    feedPath: tagFeedPath(slug),
    posts: getPostsForTag(slug),
  });
}
