import type { Metadata } from "next";
import Link from "next/link";
import { getAllContent, type ProjectFrontmatter } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Current and future projects - where good intentions meet reality checks.",
};

export default function ProjectsPage() {
  const projects = getAllContent<ProjectFrontmatter>("projects");

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-sans text-3xl font-bold text-purple-primary md:text-4xl">
        Projects
      </h1>
      <p className="mt-2 max-w-2xl font-serif text-lg text-text-secondary">
        This is where good intentions meet reality checks. A mix of
        &quot;definitely finishing this&quot; and &quot;seemed like a good idea
        at 3 AM&quot; projects.
      </p>

      {projects.length > 0 ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group rounded-lg border border-purple-tint bg-background p-6 no-underline transition-shadow hover:shadow-md"
            >
              <h2 className="font-sans text-lg font-semibold text-purple-primary group-hover:text-purple-secondary">
                {project.frontmatter.title}
              </h2>
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
        <p className="mt-8 font-serif text-text-secondary">
          Projects are being documented — check back soon.
        </p>
      )}
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
