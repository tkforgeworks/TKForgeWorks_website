// Canonical origin for the deployed site. Used for absolute URLs in the
// sitemap, robots.txt, <link rel="canonical">, Open Graph and JSON-LD.
// No trailing slash.
export const SITE_URL = "https://tkforgeworks.com";

export const SITE_NAME = "TK ForgeWorks";

export const SITE_DESCRIPTION =
  "Mechanical engineer turned creative problem solver. Building games, tools, and solutions through trial, error, and stubborn persistence.";

// Public author identity used in structured data and article metadata.
// Keep this to what the site itself already shows about you.
export const SITE_AUTHOR = "Tim";

// Default social card, 1200x630. Source SVG lives in scripts/og/.
export const SITE_OG_IMAGE = "/og-default.png";

// Public profiles, surfaced as sameAs links in the Person/WebSite JSON-LD so
// search engines can tie this site to those accounts.
export const SOCIAL_PROFILES = [
  "https://github.com/tkforgeworks",
  "https://instagram.com/TKForgeWorks",
  "https://reddit.com/user/tkForgeWorks",
  "https://tkforgeworks.itch.io",
];
