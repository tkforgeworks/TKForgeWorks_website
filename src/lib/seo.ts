import type { Metadata } from "next";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_AUTHOR,
  SITE_OG_IMAGE,
  SOCIAL_PROFILES,
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

const personId = `${SITE_URL}/#person`;
const websiteId = `${SITE_URL}/#website`;

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: SITE_AUTHOR,
        url: `${SITE_URL}/about/`,
        sameAs: SOCIAL_PROFILES,
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        description: SITE_DESCRIPTION,
        publisher: { "@id": personId },
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
}) {
  const url = `${SITE_URL}/blog/${post.slug}/`;
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
    author: { "@id": personId },
    publisher: { "@id": personId },
    image: `${SITE_URL}${SITE_OG_IMAGE}`,
    isPartOf: { "@id": websiteId },
  };
}
