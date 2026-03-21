# TK ForgeWorks Website

A static website built with Next.js, Tailwind CSS, and markdown-based content. Deployed to Cloudflare Pages.

## Quick Start (Development)

```bash
git clone git@github.com:tkforgeworks/TKForgeWorks_website.git
cd TKForgeWorks_website
npm install
npm run dev       # Start dev server at http://localhost:3000
npm run build     # Build static site to out/
npm run lint      # Run ESLint
```

## Technology Stack

- **Framework**: Next.js 15 (App Router, static export)
- **Styling**: Tailwind CSS 4 with custom color palette
- **Content**: Markdown files with YAML frontmatter (parsed by gray-matter, rendered by remark)
- **Fonts**: Poppins (headers), Source Serif 4 (body), JetBrains Mono (code)
- **Deployment**: Cloudflare Pages (static output from `out/` directory)

---

## Content Management Guide

All site content lives in the `content/` directory as markdown files. No code changes are required to add or update content — just create or edit a `.md` file and commit it.

### Directory Structure

```
content/
├── blog/               # Blog posts (listed at /blog, detail at /blog/:slug)
│   └── my-post.md
├── projects/            # Project pages (listed at /projects, detail at /projects/:slug)
│   └── my-project.md
└── pages/               # Static pages (rendered at their own routes)
    ├── about.md          # /about
    └── faq.md            # /faq

public/
└── images/              # All images referenced by content
    ├── blog/
    ├── projects/
    └── general/
```

### How Content Becomes Pages

1. You add a markdown file to `content/blog/`, `content/projects/`, or `content/pages/`
2. At build time, Next.js reads every `.md` file, parses the frontmatter, and converts markdown to HTML
3. The **filename** (minus `.md`) becomes the **URL slug** — e.g., `content/blog/my-first-post.md` becomes `/blog/my-first-post/`
4. The static site is generated into the `out/` directory and deployed to Cloudflare Pages

**Important**: Since this is a static site, content changes require a new build and deploy. Pushing to the appropriate branch triggers this automatically via Cloudflare Pages.

---

## Adding a Blog Post

Create a new file at `content/blog/<your-slug>.md`:

```markdown
---
title: "Your Post Title"
date: "2026-03-20"
excerpt: "A one or two sentence summary shown on the blog listing page"
tags: ["topic-one", "topic-two"]
status: "draft"
---

Your markdown content goes here.

You can use **bold**, *italic*, `inline code`, and all standard markdown.

![Alt text for the image](/images/blog/your-image.jpg)

## Subheadings work as expected

- Bullet lists
- Work fine

1. Numbered lists
2. Also work
```

### Blog Frontmatter Reference

| Field      | Required | Type     | Description |
|------------|----------|----------|-------------|
| `title`    | Yes      | string   | Post title, displayed as the page heading |
| `date`     | Yes      | string   | Publication date in `YYYY-MM-DD` format, used for sorting |
| `excerpt`  | Yes      | string   | Short summary shown on the `/blog` listing page |
| `tags`     | Yes      | string[] | Array of topic tags displayed as badges |
| `status`   | Yes      | string   | `"published"` or `"draft"` |

### Blog Behavior

- Posts with `status: "draft"` are **excluded** from the blog listing and homepage — use this to stage content before publishing
- Posts are sorted by `date` descending (newest first) on the listing page
- The 3 most recent published posts appear on the homepage
- Reading time is calculated automatically (~200 words per minute)

---

## Adding a Project

Create a new file at `content/projects/<your-slug>.md`:

```markdown
---
title: "Project Name"
status: "Active"
excerpt: "Brief description shown on the projects listing page"
tech: ["Python", "Docker", "PostgreSQL"]
featured: true
heroImage: "/images/projects/project-hero.jpg"
heroAlt: "Description of the hero image"
github: "https://github.com/username/repo"
demo: "https://demo-url.com"
---

Detailed project description in markdown.

Include whatever context, technical details, or narrative you want.

![Screenshot or diagram](/images/projects/screenshot.png)
```

### Project Frontmatter Reference

| Field       | Required | Type     | Description |
|-------------|----------|----------|-------------|
| `title`     | Yes      | string   | Project name |
| `status`    | Yes      | string   | One of: `"Active"`, `"Paused"`, `"Completed"`, `"Planning"` |
| `excerpt`   | Yes      | string   | Short description for the listing page |
| `tech`      | Yes      | string[] | Technologies used, displayed as badges |
| `featured`  | Yes      | boolean  | `true` to show on the homepage |
| `heroImage` | No       | string   | Path to hero image (e.g., `"/images/projects/hero.jpg"`) |
| `heroAlt`   | No       | string   | Alt text for the hero image |
| `github`    | No       | string   | GitHub repository URL (renders as a link) |
| `demo`      | No       | string   | Live demo URL (renders as a link) |

### Project Behavior

- All projects appear on the `/projects` listing page regardless of status
- Only projects with `featured: true` appear on the homepage
- The `status` field controls the color of the status badge:
  - **Active** / **Completed** — green
  - **Paused** — amber
  - **Planning** — blue
- Hero images display at the top of the project detail page if provided

---

## Editing Static Pages

The About and FAQ pages pull content from markdown files in `content/pages/`. Edit them directly:

- **About page**: `content/pages/about.md` (renders at `/about`)
- **FAQ page**: `content/pages/faq.md` (renders at `/faq`)

The Contact page (`/contact`) is currently hardcoded in `src/app/contact/page.tsx` — editing it requires changing the React component directly.

### Pages Frontmatter Reference

| Field             | Required | Type    | Description |
|-------------------|----------|---------|-------------|
| `title`           | Yes      | string  | Page title |
| `slug`            | Yes      | string  | URL path segment |
| `description`     | Yes      | string  | Short page description |
| `lastUpdated`     | No       | string  | Date in `YYYY-MM-DD` format |
| `metaTitle`       | No       | string  | SEO title (falls back to `title`) |
| `metaDescription` | No       | string  | SEO description (falls back to `description`) |

---

## Working with Images

Images are served from the `public/` directory. Any file in `public/` is available at the site root.

### Adding Images

1. Place your image file in the appropriate subdirectory under `public/images/`:
   ```
   public/images/blog/my-post-screenshot.png
   public/images/projects/my-project-hero.jpg
   ```

2. Reference it in your markdown or frontmatter using the path from the site root (omit `public`):
   ```markdown
   ![Screenshot of the dashboard](/images/blog/my-post-screenshot.png)
   ```
   Or in project frontmatter:
   ```yaml
   heroImage: "/images/projects/my-project-hero.jpg"
   ```

### Image Guidelines

- **Formats**: Use `.jpg` for photos, `.png` for screenshots/diagrams, `.svg` for icons/logos
- **Size**: Keep images under 500KB where possible — optimize before committing (tools: [Squoosh](https://squoosh.app), ImageOptim, etc.)
- **Dimensions**: Hero images work best at roughly 800x450px (16:9 aspect ratio)
- **Alt text**: Always provide descriptive alt text for accessibility
- **Naming**: Use lowercase, hyphen-separated filenames (e.g., `my-project-hero.jpg`)
- Images are **not** processed by Next.js Image optimization (static export mode uses unoptimized images)

---

## Content Workflow

### Branching Strategy

All content changes follow the same Git workflow as code changes:

```
main          ← production (live site at tkforgeworks.com)
  └── staging ← staging environment (preview behind Cloudflare Access)
        └── feature/add-blog-post-name  ← your working branch
```

### Step-by-Step: Publishing New Content

1. **Create a branch** from `staging`:
   ```bash
   git checkout staging
   git pull origin staging
   git checkout -b content/add-new-blog-post
   ```

2. **Add your content**:
   - Create the markdown file in the appropriate `content/` subdirectory
   - Add any images to `public/images/`
   - For blog posts, set `status: "draft"` initially if you want an extra safety net

3. **Preview locally**:
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` and navigate to your new content.

4. **Verify the build**:
   ```bash
   npm run build
   ```
   This generates the static site to `out/`. If the build fails, check for frontmatter issues or missing required fields.

5. **Commit and push**:
   ```bash
   git add content/blog/your-post.md public/images/blog/your-image.jpg
   git commit -m "Add blog post: Your Post Title"
   git push -u origin content/add-new-blog-post
   ```

6. **Open a Pull Request** into `staging`:
   - Cloudflare Pages will generate a **preview deployment** with a unique URL
   - Use the preview URL to verify the content looks correct

7. **Merge to staging**:
   - Once the PR is approved/reviewed, merge into `staging`
   - The staging environment updates automatically
   - Verify at the staging URL (protected behind Cloudflare Access authentication)

8. **Promote to production**:
   - When staging looks good, open a PR from `staging` → `main`
   - Merging to `main` triggers the production deployment to the live site

### Staging Environment

The staging environment provides a way to verify content changes before they go live:

- **Staging branch**: `staging` — deploys automatically to a staging URL on Cloudflare Pages
- **Access control**: Protected behind Cloudflare Access (requires authentication to view)
- **Purpose**: Final verification of content, layout, and images before promoting to production
- **Preview deployments**: Every PR also gets its own unique preview URL from Cloudflare Pages for per-change review

---

## Markdown Reference

The site supports standard markdown syntax. Here's a quick reference for common patterns:

### Text Formatting

```markdown
**Bold text**
*Italic text*
`Inline code`
[Link text](https://example.com)
```

### Headings

```markdown
## Section Heading (h2)
### Subsection (h3)
#### Minor heading (h4)
```

> Use `##` (h2) as your top-level heading within content — the page title (`h1`) is rendered automatically from the frontmatter `title` field.

### Lists

```markdown
- Unordered item
- Another item

1. Ordered item
2. Another item
```

### Images

```markdown
![Descriptive alt text](/images/blog/filename.jpg)
```

### Code Blocks

````markdown
```python
def hello():
    print("Hello from TK ForgeWorks")
```
````

### Blockquotes

```markdown
> This is a blockquote. Use it for callouts or emphasis.
```

---

## Project Structure Reference

```
├── content/                  # Markdown content (blog, projects, pages)
├── public/images/            # Static images referenced by content
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── layout.tsx        # Root layout (fonts, theme, header/footer)
│   │   ├── page.tsx          # Homepage
│   │   ├── about/page.tsx    # About (reads content/pages/about.md)
│   │   ├── blog/             # Blog listing + [slug] detail
│   │   ├── contact/page.tsx  # Contact (hardcoded JSX)
│   │   ├── faq/page.tsx      # FAQ (reads content/pages/faq.md)
│   │   └── projects/         # Projects listing + [slug] detail
│   ├── components/           # Header, Footer, ThemeToggle, ThemeProvider
│   └── lib/content.ts        # Content loading, markdown parsing, utilities
├── zz-project-documentation/ # Internal design docs, drafts, style guide
├── next.config.mjs           # Static export config
├── package.json
└── tsconfig.json
```

## Design System

### Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| Purple Primary | `#6b46c1` | `#a855f7` | Headers, brand accents |
| Purple Secondary | `#7c3aed` | `#8b5cf6` | Interactive elements, links |
| Text Primary | `#334155` | `#e2e8f0` | Body text |
| Text Secondary | `#64748b` | `#cbd5e1` | Subtitles, captions |

### Typography

- **Poppins** — Headers, navigation, UI labels
- **Source Serif 4** — Body text, markdown prose
- **JetBrains Mono** — Code blocks and inline code

---

## Troubleshooting

### Build fails after adding content

- Check that all **required frontmatter fields** are present (see reference tables above)
- Verify frontmatter uses valid YAML syntax (strings in quotes, arrays in brackets)
- Make sure the `---` delimiters are on their own lines with no extra whitespace

### Images not showing

- Confirm the file exists in `public/images/` at the exact path you referenced
- Remember to omit `public` from the path — use `/images/...` not `public/images/...`
- Check for case-sensitivity in filenames (Linux/Cloudflare are case-sensitive)

### New page not appearing

- The filename determines the URL slug — check for typos
- For blog posts, verify `status` is set to `"published"` (drafts are hidden from listings)
- Run `npm run build` to confirm the route is generated (check `out/` directory)

### Content not updating on the live site

- Confirm your changes were merged to the correct branch (`staging` or `main`)
- Check the Cloudflare Pages dashboard for build status and any build errors
