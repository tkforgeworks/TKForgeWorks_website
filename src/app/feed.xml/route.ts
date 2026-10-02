import { getPublishedPosts } from "@/lib/content";
import { buildFeed, SITE_FEED_PATH } from "@/lib/feed";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

// Rendered once at build time to out/feed.xml (required by output: "export").
export const dynamic = "force-static";

export async function GET() {
  return buildFeed({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    link: "/",
    feedPath: SITE_FEED_PATH,
    posts: getPublishedPosts(),
  });
}
