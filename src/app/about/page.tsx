import type { Metadata } from "next";
import Image from "next/image";
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

      {/* Example: Next.js Image component used directly in a page */}
      <div className="mt-8 overflow-hidden rounded-lg">
        <Image
          src="/images/mkv-supra.jpg"
          alt="Placeholder image — blue MkV Toyota Supra (replace with profile photo)"
          width={800}
          height={500}
          className="h-auto w-full object-cover"
          priority
        />
        <p className="mt-2 text-center font-sans text-sm text-text-secondary">
          Placeholder — swap this out for a real profile photo or workspace shot
        </p>
      </div>

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
