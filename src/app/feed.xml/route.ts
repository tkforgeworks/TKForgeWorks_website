import { getAllContent, markdownToHtml, type BlogFrontmatter } from "@/lib/content";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_AUTHOR } from "@/lib/site";

// Rendered once at build time to out/feed.xml (required by output: "export").
export const dynamic = "force-static";

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

export async function GET() {
  const posts = getAllContent<BlogFrontmatter>("blog")
    .filter((p) => p.frontmatter.status === "published")
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );

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
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}/</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
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
