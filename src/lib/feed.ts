import { markdownToHtml, type Post } from "@/lib/content";
import { SITE_URL, SITE_AUTHOR } from "@/lib/site";

export const SITE_FEED_PATH = "/feed.xml";

export function projectFeedPath(projectSlug: string): string {
  return `/projects/${projectSlug}/feed.xml`;
}

export function tagPath(tagSlug: string): string {
  return `/blog/tags/${tagSlug}/`;
}

export function tagFeedPath(tagSlug: string): string {
  return `/blog/tags/${tagSlug}/feed.xml`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Feed readers resolve nothing relative to the site, so root-relative image
// and link targets in post HTML must become absolute.
function absolutizeUrls(html: string): string {
  return html.replace(/(src|href)="\/(?!\/)/g, `$1="${SITE_URL}/`);
}

// Shared by the site-wide, per-project and per-tag feeds. Each is rendered
// once at build time (the routes are force-static for output: "export").
export async function buildFeed({
  title,
  description,
  link,
  feedPath,
  posts,
}: {
  title: string;
  description: string;
  /** Root-relative URL of the page this feed mirrors. */
  link: string;
  /** Root-relative URL of the feed itself. */
  feedPath: string;
  /** Published posts, newest first. */
  posts: Post[];
}): Promise<Response> {
  const items = await Promise.all(
    posts.map(async (post) => {
      const { title, date, excerpt, tags, author } = post.frontmatter;
      const url = `${SITE_URL}/blog/${post.slug}/`;
      const html = absolutizeUrls(await markdownToHtml(post.content));
      return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(date).toUTCString()}</pubDate>
      <dc:creator>${escapeXml(author ?? SITE_AUTHOR)}</dc:creator>
      <description>${escapeXml(excerpt)}</description>
${tags.map((t) => `      <category>${escapeXml(t)}</category>`).join("\n")}
      <content:encoded><![CDATA[${html}]]></content:encoded>
    </item>`;
    })
  );

  const lastBuildDate = posts[0]
    ? new Date(posts[0].frontmatter.date).toUTCString()
    : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${SITE_URL}${link}</link>
    <atom:link href="${SITE_URL}${feedPath}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(description)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${items.join("\n")}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
