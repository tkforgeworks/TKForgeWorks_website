// Canonical origin for the deployed site. Used for absolute URLs in the
// sitemap, robots.txt, <link rel="canonical">, Open Graph and JSON-LD.
// No trailing slash.
export const SITE_URL = "https://tkforgeworks.com";

export const SITE_NAME = "TK ForgeWorks";

export const SITE_DESCRIPTION =
  "Mechanical engineer turned creative problem solver. Building games, tools, and solutions through trial, error, and stubborn persistence.";

// Registered business details. LEGAL_NAME must match the NJ Certificate of
// Formation exactly: Google Play, Apple and D-U-N-S check it against the
// public record, as they do the address.
export const LEGAL_NAME = "TK ForgeWorks LLC";

export const BUSINESS_EMAIL = "info@tkforgeworks.com";

export const BUSINESS_ADDRESS = {
  street: "971 US Highway 202 N, Ste N #4605",
  city: "Branchburg",
  region: "NJ",
  postalCode: "08876",
  country: "US",
};

// Default author for article metadata and structured data. A post can
// override it with an "author" field in its frontmatter.
export const SITE_AUTHOR = "tkforgeworks";

// Default social card, 1200x630. Source SVG lives in scripts/og/.
export const SITE_OG_IMAGE = "/og-default.png";

// Public profiles, surfaced as sameAs links in the Organization JSON-LD so
// search engines can tie this site to those accounts.
export const SOCIAL_PROFILES = [
  "https://github.com/tkforgeworks",
  "https://instagram.com/TKForgeWorks",
  "https://reddit.com/user/tkForgeWorks",
  "https://tkforgeworks.itch.io",
];
