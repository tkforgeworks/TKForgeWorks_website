import {
  getContentBySlug,
  getContentSlugs,
  getPostsForProject,
  type ProjectFrontmatter,
} from "@/lib/content";
import { buildFeed, projectFeedPath } from "@/lib/feed";
import { SITE_NAME } from "@/lib/site";

// One feed per project, written to out/projects/<slug>/feed.xml at build time.
// Every project gets one, even before its first post, so the URL is stable.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getContentSlugs("projects").map((slug) => ({ slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { title, excerpt } = getContentBySlug<ProjectFrontmatter>(
    "projects",
    slug
  )!.frontmatter;
  return buildFeed({
    title: `${title} · ${SITE_NAME}`,
    description: excerpt,
    link: `/projects/${slug}/`,
    feedPath: projectFeedPath(slug),
    posts: getPostsForProject(slug),
  });
}
