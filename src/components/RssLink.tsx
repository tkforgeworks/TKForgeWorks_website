// Visible "subscribe" link for a page's own feed. Same icon as the footer's
// site-wide RSS link.
export default function RssLink({
  href,
  label,
  className = "",
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-1.5 font-sans text-sm text-purple-secondary no-underline hover:text-purple-primary ${className}`}
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M4 4a16 16 0 0 1 16 16h-3A13 13 0 0 0 4 7V4zm0 6a10 10 0 0 1 10 10h-3a7 7 0 0 0-7-7v-3zm0 7.5A2.5 2.5 0 1 1 4 22.5 2.5 2.5 0 0 1 4 17.5z" />
      </svg>
      {label}
    </a>
  );
}
