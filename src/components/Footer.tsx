import Link from "next/link";

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/tkforgeworks",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/TKForgeWorks",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Reddit",
    href: "https://reddit.com/user/tkForgeWorks",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm6.67-10.95a1.46 1.46 0 01-.46 2.66 5.82 5.82 0 01-2.88 2.44 8.48 8.48 0 01-3.33.66 8.48 8.48 0 01-3.33-.66 5.82 5.82 0 01-2.88-2.44 1.46 1.46 0 01-.46-2.66 1.46 1.46 0 011.86-.5c.83-.56 1.82-.92 2.88-1.06l.54-2.56a.5.5 0 01.6-.39l2.18.46a1.05 1.05 0 012 .5 1.05 1.05 0 01-1.05 1.05 1.05 1.05 0 01-1.01-.76l-1.72-.36-.42 2.01c1.06.14 2.05.5 2.88 1.06a1.46 1.46 0 011.6.5zM9.5 13.5a1 1 0 100-2 1 1 0 000 2zm5 0a1 1 0 100-2 1 1 0 000 2zm-4.44 2a.38.38 0 00-.06.53c.7.88 1.83 1.22 2.99 1.22s2.29-.34 2.99-1.22a.38.38 0 00-.06-.53.38.38 0 00-.53.06c-.53.66-1.42.94-2.4.94s-1.87-.28-2.4-.94a.38.38 0 00-.53-.06z" />
      </svg>
    ),
  },
  {
    label: "Discord",
    href: "https://discord.com/users/tkforgeworks",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 01.078-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.009c.12.099.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
  {
    label: "Itch.io",
    href: "https://tkforgeworks.itch.io",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M3.13 1.338C2.08 1.96.5 3.685.5 4.37v1.563c0 1.283.983 2.408 2.122 2.408 1.32 0 2.39-1.065 2.39-2.368 0 1.303 1.03 2.368 2.35 2.368 1.32 0 2.28-1.065 2.28-2.368 0 1.303 1.1 2.368 2.42 2.368h.001c1.32 0 2.42-1.065 2.42-2.368 0 1.303.96 2.368 2.28 2.368 1.32 0 2.35-1.065 2.35-2.368 0 1.303 1.07 2.368 2.39 2.368 1.14 0 2.122-1.125 2.122-2.408V4.37c0-.685-1.58-2.41-2.63-3.032C19.986 1.13 16.21.97 12.06.97c-4.15 0-7.926.16-8.93.368zM10 9.835c-.282.4-.63.705-1.04.88-.34.145-.593.175-1.286.175-.442 0-.686-.01-1.05-.055a3.743 3.743 0 01-.886-.307v7.873c0 .32.016.57.098.803.084.238.257.425.444.561.374.273.95.424 1.695.424.224 0 .463-.012.71-.04a9.69 9.69 0 001.267-.253c.357-.098.582-.17.748-.243v-3.29h2.6v3.29c.167.072.391.145.748.243.384.105.826.194 1.267.253.247.028.486.04.71.04.744 0 1.32-.15 1.695-.424.187-.136.36-.323.444-.561.082-.233.098-.483.098-.803v-7.873a3.743 3.743 0 01-.886.307c-.364.046-.608.055-1.05.055-.693 0-.947-.03-1.286-.176a2.46 2.46 0 01-1.04-.879A2.46 2.46 0 0112 10.18a2.46 2.46 0 01-1 .654v.001zm-1.756 3.39c.727 0 1.317.558 1.317 1.246 0 .688-.59 1.246-1.317 1.246-.727 0-1.317-.558-1.317-1.246 0-.688.59-1.246 1.317-1.246zm7.512 0c.727 0 1.317.558 1.317 1.246 0 .688-.59 1.246-1.317 1.246-.727 0-1.317-.558-1.317-1.246 0-.688.59-1.246 1.317-1.246z" />
      </svg>
    ),
  },
];

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
            <div className="mt-3 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary transition-colors hover:text-purple-primary"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          <nav className="flex flex-col items-center gap-2 md:flex-row md:gap-6">
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
