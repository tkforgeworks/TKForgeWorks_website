import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Required by output: "export" so this route is rendered once at build time.
export const dynamic = "force-static";

// Written to out/robots.txt at build time. Cloudflare prepends its own
// "content signals" comment block in front of this on the live site; the
// directives below are what crawlers act on.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
