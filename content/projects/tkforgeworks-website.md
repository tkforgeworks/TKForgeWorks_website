---
title: "This Website"
status: "Active"
excerpt: "The site you're currently looking at. Next.js, Tailwind, markdown content, and a full CI/CD pipeline for what is, at heart, a blog."
tech: ["Next.js", "TypeScript", "Tailwind CSS", "Cloudflare Pages"]
featured: false
github: "https://github.com/tkforgeworks/TKForgeWorks_website"
---

Yes, the website is also a project. It's a static site built with Next.js and Tailwind CSS, with all content managed as markdown files — including the very page you're reading, which means this card describes the thing rendering this card. We don't need to dwell on that.

## How it's built

Markdown files with YAML frontmatter become pages at build time; the whole site exports statically and deploys to Cloudflare Pages through a CI pipeline with linting, type checks, and preview deployments on every pull request. For a personal site, this is objectively too much process. It is also exactly the amount of process I wanted.

## Where it stands

The foundation, brand identity, and design system are in place, with light and dark modes that both got a proper QA pass. Ongoing work is content — blog posts, project pages, and resisting the urge to rebuild the whole thing every time a new framework trends.
