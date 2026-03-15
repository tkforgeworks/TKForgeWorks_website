import type { Metadata } from "next";
import { getContentBySlug, markdownToHtml } from "@/lib/content";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "The questions nobody's asked yet, but probably should.",
};

export default async function FAQPage() {
  const page = getContentBySlug("pages", "faq");
  const htmlContent = page ? await markdownToHtml(page.content) : null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-sans text-3xl font-bold text-purple-primary md:text-4xl">
        FAQ
      </h1>
      <p className="mt-2 font-serif text-lg text-text-secondary">
        The questions nobody&apos;s asked yet, but probably should. Part FAQ,
        part therapy session, part warning label.
      </p>

      {htmlContent ? (
        <article
          className="prose prose-lg mt-8 max-w-none font-serif text-text-primary"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      ) : (
        <p className="mt-8 font-serif text-text-secondary">
          FAQ content coming soon.
        </p>
      )}
    </div>
  );
}
