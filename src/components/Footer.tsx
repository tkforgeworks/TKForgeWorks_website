import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background-light">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <Link
              href="/"
              className="font-sans text-lg font-semibold text-purple-primary no-underline"
            >
              TK ForgeWorks
            </Link>
            <p className="mt-1 font-serif text-sm text-text-secondary">
              Where problem-solving meets &quot;let&apos;s see what happens if I
              try this&quot;
            </p>
          </div>
          <nav className="flex gap-6">
            <Link
              href="/about"
              className="font-sans text-sm font-medium text-text-secondary no-underline transition-colors hover:text-purple-primary"
            >
              About
            </Link>
            <Link
              href="/projects"
              className="font-sans text-sm font-medium text-text-secondary no-underline transition-colors hover:text-purple-primary"
            >
              Projects
            </Link>
            <Link
              href="/blog"
              className="font-sans text-sm font-medium text-text-secondary no-underline transition-colors hover:text-purple-primary"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="font-sans text-sm font-medium text-text-secondary no-underline transition-colors hover:text-purple-primary"
            >
              Contact
            </Link>
          </nav>
        </div>
        <div className="mt-6 border-t border-border pt-4 text-center">
          <p className="font-serif text-sm text-text-secondary">
            &copy; {new Date().getFullYear()} TK ForgeWorks. Built with stubborn
            persistence.
          </p>
        </div>
      </div>
    </footer>
  );
}
