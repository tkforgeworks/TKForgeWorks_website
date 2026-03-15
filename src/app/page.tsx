import Link from "next/link";
import { getAllContent, type ProjectFrontmatter, type BlogFrontmatter } from "@/lib/content";

export default function Home() {
  const projects = getAllContent<ProjectFrontmatter>("projects").filter(
    (p) => p.frontmatter.featured
  );
  const posts = getAllContent<BlogFrontmatter>("blog")
    .filter((p) => p.frontmatter.status === "published")
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    )
    .slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-background-light py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="font-sans text-4xl font-bold text-purple-primary md:text-5xl">
            TK ForgeWorks
          </h1>
          <p className="mt-4 font-sans text-lg font-normal text-purple-secondary">
            Where problem-solving meets &quot;let&apos;s see what happens if I
            try <em>this</em>&quot;
          </p>
          <p className="mx-auto mt-6 max-w-2xl font-serif text-lg text-text-primary">
            Engineering solutions and creative projects through trial, error, and
            stubborn persistence.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/projects"
              className="rounded-lg bg-purple-primary px-6 py-3 font-sans text-sm font-medium text-white no-underline transition-colors hover:bg-purple-dark"
            >
              View Projects
            </Link>
            <Link
              href="/about"
              className="rounded-lg border border-purple-primary px-6 py-3 font-sans text-sm font-medium text-purple-primary no-underline transition-colors hover:bg-purple-tint"
            >
              Read About Me
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-sans text-2xl font-semibold text-purple-primary">
            Featured Projects
          </h2>
          {projects.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="group rounded-lg border border-purple-tint bg-white p-6 no-underline transition-shadow hover:shadow-md"
                >
                  <h3 className="font-sans text-lg font-semibold text-purple-primary group-hover:text-purple-secondary">
                    {project.frontmatter.title}
                  </h3>
                  <span
                    className={`mt-2 inline-block rounded-full px-3 py-1 font-sans text-xs font-medium ${statusClasses(project.frontmatter.status)}`}
                  >
                    {project.frontmatter.status}
                  </span>
                  <p className="mt-3 font-serif text-sm text-text-secondary">
                    {project.frontmatter.excerpt}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.frontmatter.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded bg-purple-tint px-2 py-0.5 font-mono text-xs text-purple-dark"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 font-serif text-text-secondary">
              Projects coming soon — check back shortly.
            </p>
          )}
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className="bg-background-light py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-sans text-2xl font-semibold text-purple-primary">
            Recent Posts
          </h2>
          {posts.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group rounded-lg border border-purple-tint bg-white p-6 no-underline transition-shadow hover:shadow-md"
                >
                  <time className="font-sans text-sm text-text-secondary">
                    {new Date(post.frontmatter.date).toLocaleDateString(
                      "en-US",
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                  </time>
                  <h3 className="mt-2 font-sans text-lg font-semibold text-purple-primary group-hover:text-purple-secondary">
                    {post.frontmatter.title}
                  </h3>
                  <p className="mt-2 font-serif text-sm text-text-secondary">
                    {post.frontmatter.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 font-serif text-text-secondary">
              Blog posts coming soon — stay tuned.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function statusClasses(status: string): string {
  switch (status) {
    case "Active":
      return "bg-success-light text-success";
    case "Completed":
      return "bg-success-light text-success";
    case "Paused":
      return "bg-warning-light text-warning";
    case "Planning":
      return "bg-info-light text-info";
    default:
      return "bg-purple-tint text-purple-dark";
  }
}
