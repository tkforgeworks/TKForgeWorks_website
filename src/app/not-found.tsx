import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "That page doesn't exist, or it moved while nobody was looking.",
  // Next already emits noindex for not-found pages. Suppress the layout's
  // "./" canonical, which would otherwise resolve to the internal
  // /_not-found/ path.
  alternates: { canonical: null },
};

// Static export writes this to out/404.html, which Cloudflare Pages serves
// automatically for any unknown path with a real 404 status.
export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <p className="font-mono text-sm text-purple-secondary">404</p>
      <h1 className="mt-2 font-sans text-3xl font-bold text-purple-primary md:text-4xl">
        Page Not Found
      </h1>
      <p className="mx-auto mt-4 max-w-xl font-serif text-lg text-text-primary">
        Either this page never existed, or it got refactored out of existence
        and nobody updated the link. Both are plausible around here.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
        <Link
          href="/"
          className="rounded-lg bg-purple-primary px-6 py-3 font-sans text-base font-medium text-white no-underline transition-colors hover:bg-purple-dark dark:text-background"
        >
          Back to Home
        </Link>
        <Link
          href="/blog"
          className="rounded-lg border border-purple-primary bg-purple-tint px-6 py-3 font-sans text-base font-medium text-purple-primary no-underline transition-colors hover:bg-purple-tint-hover"
        >
          Browse the Blog
        </Link>
        <Link
          href="/projects"
          className="rounded-lg border border-purple-primary bg-purple-tint px-6 py-3 font-sans text-base font-medium text-purple-primary no-underline transition-colors hover:bg-purple-tint-hover"
        >
          See Projects
        </Link>
      </div>
    </div>
  );
}
