import type { Metadata } from "next";
import { getContentBySlug, markdownToHtml } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Problem-solving meets 'let's see what happens if I try this' - the story behind TK ForgeWorks.",
};

export default async function AboutPage() {
  const page = getContentBySlug("pages", "about");
  const htmlContent = page ? await markdownToHtml(page.content) : null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-sans text-3xl font-bold text-purple-primary md:text-4xl">
        About
      </h1>
      <p className="mt-2 font-sans text-lg text-purple-secondary">
        The story behind the forge
      </p>

      {htmlContent ? (
        <article
          className="prose prose-lg mt-8 max-w-none font-serif text-text-primary"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      ) : (
        <div className="mt-8 font-serif text-text-primary">
          <p>About content coming soon.</p>
        </div>
      )}
    </div>
  );
}
