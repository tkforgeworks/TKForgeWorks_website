import type { Metadata } from "next";
import { Poppins, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import ThemeProvider from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_OG_IMAGE,
} from "@/lib/site";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  // Absolute base for every relative URL in metadata. The "./" canonical
  // resolves per page against the current pathname, so each route declares
  // itself (with trailing slash) as the canonical URL. This is what
  // collapses www/apex and any query-string variants down to one indexed
  // copy of each page.
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "./",
    types: { "application/rss+xml": `${SITE_URL}/feed.xml` },
  },
  title: {
    default: `${SITE_NAME} - Engineering Solutions & Creative Projects`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  // Site-wide social card. Next replaces the whole openGraph object when a
  // page defines its own, so pages that need article fields build theirs
  // with openGraphFor() in src/lib/seo.ts to keep siteName and the image.
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: "./",
    images: [
      {
        url: SITE_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} logo and tagline`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

// Inline script to set theme before first paint, preventing flash
const themeScript = `
  (function() {
    var theme = localStorage.getItem('theme') || 'system';
    var resolved = theme;
    if (theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.classList.add(resolved);
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${poppins.variable} ${sourceSerif.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-F2FJ799L5V" />
    </html>
  );
}
