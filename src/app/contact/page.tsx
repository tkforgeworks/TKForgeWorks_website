import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Got an idea that's either brilliant or completely unhinged? Let's connect.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-sans text-3xl font-bold text-purple-primary md:text-4xl">
        Contact
      </h1>
      <p className="mt-4 max-w-2xl font-serif text-lg text-text-primary">
        Got an idea that&apos;s either brilliant or completely unhinged?
        Perfect&mdash;those are my favorite kind. Whether you&apos;re looking to
        collaborate on something equally ambitious, need a second pair of eyes on
        a technical challenge, or just want to commiserate about why your code
        worked yesterday but not today, drop me a line.
      </p>
      <p className="mt-4 font-serif text-text-secondary">
        I promise to respond faster than I finish my personal projects, which
        admittedly isn&apos;t setting the bar very high.
      </p>

      <div className="mt-10 rounded-lg border border-purple-tint bg-background-light p-8">
        <h2 className="font-sans text-xl font-semibold text-purple-primary">
          Get in Touch
        </h2>
        <p className="mt-2 font-serif text-sm text-text-secondary">
          Contact form coming soon. In the meantime, feel free to reach out
          through the channels below.
        </p>

        <div className="mt-6 space-y-4 font-serif text-text-primary">
          <div>
            <span className="font-sans text-sm font-medium text-purple-dark">
              Email
            </span>
            <p className="mt-1">info@tkforgeworks.com</p>
          </div>
          <div>
            <span className="font-sans text-sm font-medium text-purple-dark">
              Response Time
            </span>
            <p className="mt-1 text-text-secondary">
              Usually within 24-48 hours
            </p>
          </div>
          <div>
            <span className="font-sans text-sm font-medium text-purple-dark">
              Best Topics
            </span>
            <ul className="mt-1 list-inside list-disc text-text-secondary">
              <li>Technical collaboration</li>
              <li>Project consulting</li>
              <li>Game development discussions</li>
              <li>Engineering problem solving</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
