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

// Apps with optional accounts, by privacy slug. Each has a web deletion page
// at /privacy/<slug>/delete-account/ (src/app/privacy/<slug>/delete-account/),
// listed in the sitemap, and an entry in functions/api/delete-account.ts.
export const ACCOUNT_APPS = ["cheesy-scribe"] as const;

// Cloudflare Turnstile site key for the account-deletion forms
// (/privacy/<app>/delete-account/). Site keys are public and ship in the
// page; this one is read at build time from the Pages variable
// NEXT_PUBLIC_TURNSTILE_SITE_KEY (set it for Production and Preview). Without
// it, Cloudflare's always-passing test key renders so the form works in local
// dev; a deploy that lacks the variable fails every submission server-side.
export const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "1x00000000000000000000AA";

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

// Android apps whose sign-in mail links are App Links on this site: the app
// redirects Supabase's confirmation and reset mails to /apps/<slug>/auth/,
// Android opens the app for that path because public/.well-known/
// assetlinks.json vouches for the package, and src/app/apps/<slug>/auth/
// is the page anyone without the app sees. Package names here must match
// that file.
export const ANDROID_APPS = {
  "cheesy-scribe": {
    name: "Cheesy Scribe",
    packageName: "com.tkforgeworks.cheesy_scribe",
  },
} as const;

export function playStoreUrl(packageName: string): string {
  return `https://play.google.com/store/apps/details?id=${packageName}`;
}
