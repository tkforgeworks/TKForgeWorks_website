import type { Metadata } from "next";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_AUTHOR,
  SITE_OG_IMAGE,
  SOCIAL_PROFILES,
  LEGAL_NAME,
  BUSINESS_EMAIL,
  BUSINESS_ADDRESS,
} from "@/lib/site";

type OpenGraph = NonNullable<Metadata["openGraph"]>;

// Next replaces a layout's openGraph object wholesale when a page sets its
// own, so every page-level openGraph must restate siteName and the default
// image. This keeps that in one place.
export function openGraphFor(overrides: OpenGraph): OpenGraph {
  return {
    siteName: SITE_NAME,
    locale: "en_US",
    images: [
      {
        url: SITE_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} logo and tagline`,
      },
    ],
    ...overrides,
  };
}

type Alternates = NonNullable<Metadata["alternates"]>;

// Same problem as openGraph: a page-level alternates object replaces the
// layout's wholesale, dropping its canonical link and site feed. Pages that
// advertise their own feed (project and tag pages) restate both here.
export function alternatesWithFeed(feed: {
  path: string;
  title: string;
}): Alternates {
  return {
    canonical: "./",
    types: {
      "application/rss+xml": [
        { url: `${SITE_URL}${feed.path}`, title: feed.title },
        { url: `${SITE_URL}/feed.xml`, title: `${SITE_NAME} (all posts)` },
      ],
    },
  };
}

const organizationId =`${SITE_URL}/#organization`;
const personId = `${SITE_URL}/#person`;
const websiteId = `${SITE_URL}/#website`;

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: SITE_NAME,
        legalName: LEGAL_NAME,
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/logo-mark.svg`,
        email: BUSINESS_EMAIL,
        address: {
          "@type": "PostalAddress",
          streetAddress: BUSINESS_ADDRESS.street,
          addressLocality: BUSINESS_ADDRESS.city,
          addressRegion: BUSINESS_ADDRESS.region,
          postalCode: BUSINESS_ADDRESS.postalCode,
          addressCountry: BUSINESS_ADDRESS.country,
        },
        sameAs: SOCIAL_PROFILES,
      },
      {
        "@type": "Person",
        "@id": personId,
        name: SITE_AUTHOR,
        url: `${SITE_URL}/about/`,
        worksFor: { "@id": organizationId },
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        description: SITE_DESCRIPTION,
        publisher: { "@id": organizationId },
      },
    ],
  };
}

export function blogPostingJsonLd(post: {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  updated?: string;
  tags: string[];
  author?: string;
}) {
  const url = `${SITE_URL}/blog/${post.slug}/`;
  // Refer to the site-level Person node unless this post names a different
  // author.
  const author =
    post.author && post.author !== SITE_AUTHOR
      ? { "@type": "Person", name: post.author }
      : { "@id": personId };
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": url,
    mainEntityOfPage: url,
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    keywords: post.tags,
    author,
    publisher: { "@id": organizationId },
    image: `${SITE_URL}${SITE_OG_IMAGE}`,
    isPartOf: { "@id": websiteId },
  };
}
