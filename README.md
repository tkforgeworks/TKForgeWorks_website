# TK ForgeWorks Website

## Overview

A professional static website that showcases TK ForgeWorks projects, shares technical insights through blog posts, and provides an approachable way for visitors to connect. The site reflects the brand's personality of competent problem-solving with a touch of self-deprecating humor, while maintaining clean functionality and performance.

## Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS with custom TK ForgeWorks color palette
- **Content**: Markdown with gray-matter for front matter parsing
- **Deployment**: Cloudflare Pages with GitHub Actions CI/CD
- **Analytics**: Cloudflare Web Analytics (free tier)
- **Contact Form**: Cloudflare Workers for form handling and email delivery

## Architecture Overview

```
/
├── app/
│   ├── layout.tsx          # Root layout with typography/color system
│   ├── page.tsx            # Home page
│   ├── about/page.tsx      # About page
│   ├── projects/
│   │   ├── page.tsx        # Projects overview
│   │   └── [slug]/page.tsx # Individual project pages
│   ├── blog/
│   │   ├── page.tsx        # Blog listing
│   │   └── [slug]/page.tsx # Individual blog posts
│   ├── faq/page.tsx        # FAQ page
│   └── contact/page.tsx    # Contact page
├── content/
│   ├── projects/           # Project markdown files
│   ├── blog/              # Blog post markdown files
│   └── pages/             # Static page content
├── public/
│   └── images/            # Project images and assets
└── components/            # Reusable React components
```

## Design System

### Typography
- **Headers & Navigation**: Poppins
- **Body Text**: Source Serif 4
- **Code**: JetBrains Mono

### Color Palette
- **Primary Purple**: #6b46c1 (headers, main accents, brand identity)
- **Secondary Purple**: #7c3aed (interactive elements, taglines)
- **Text Primary**: #334155 (body text, readable content)
- **Text Secondary**: #64748b (subtitles, captions)

### Semantic Colors
- **Error Red**: #dc2626 (build failures, critical bugs)
- **Success Green**: #16a34a (completions, successful deployments)
- **Warning Yellow**: #d97706 (scope creep, timeline warnings)
- **Info Blue**: #0284c7 (documentation, technical updates)

### Brand Voice
Professional competence with self-deprecating humor - "Where problem-solving meets 'let's see what happens if I try this'"

## Performance Goals

- Site loads in under 3 seconds on mobile
- Clean, accessible design that matches brand guidelines
- Mobile-responsive across all devices
- Basic analytics tracking for visitor insights
- WCAG AA accessibility compliance

## Content Structure

### Home Page
- Hero section with site title, tagline, and brief introduction
- Featured projects (2-3 most impressive/current)
- Recent blog posts (3 most recent)
- Call-to-action directing to projects or contact

### About Page
- Professional background and personality
- Skills/technologies section
- Timeline of key projects/transitions

### Projects Page
- **Overview**: Grid layout with status filtering (Active, Paused, Completed, Planning)
- **Individual Pages**: Hero images, status badges, technical details, image galleries, GitHub/demo links

### Blog Page
- **Listing**: Chronological posts with excerpts and tag filtering
- **Individual Posts**: Full markdown rendering with syntax highlighting, reading time, navigation

### FAQ Page
- Questions organized by category with accordion-style interface
- Categories: Project Management, Technical & Skills, Work & Life Balance, Business & Collaboration

### Contact Page
- Functional contact form with validation and loading states
- Contact information and response time expectations
- Alternative contact methods

## Content Front Matter Examples

### Blog Posts
```yaml
---
title: "Why My Quick Weekend Project Has Been Sitting Unfinished"
date: "2024-07-30"
excerpt: "A cautionary tale about scope creep and optimistic timelines"
tags: ["project-management", "lessons-learned"]
status: "published" # or "draft"
---
```

### Projects
```yaml
---
title: "Aether Gears"
status: "Active" # Active, Paused, Completed, Planning
excerpt: "Action RPG about corporate greed and resource exploitation"
tech: ["Unity", "C#", "Game Development"]
featured: true
images:
  - "aether-gears-screenshot-1.jpg"
  - "aether-gears-concept-art.png"
github: "https://github.com/username/aether-gears" # optional
demo: "https://demo-link.com" # optional
---
```

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Build for production: `npm run build`
5. Test static export: `npm run start`

## Deployment

- **Primary**: Cloudflare Pages with automatic deployments from `main` branch
- **CI/CD**: GitHub Actions for testing, linting, and deployment
- **Domain**: tkforgeworks.com with automatic HTTPS
- **Contact Form**: Cloudflare Workers for form processing and email delivery

## Success Metrics

### Launch Criteria (MVP)
- [ ] All core pages functional and mobile-responsive
- [ ] Content successfully migrated and enhanced
- [ ] Contact form working with email delivery
- [ ] Site performance meets target metrics
- [ ] Analytics tracking implemented
- [ ] No critical accessibility issues

### 30-Day Post-Launch
- [ ] At least 5 blog posts published
- [ ] All current projects documented with individual pages
- [ ] Contact form receiving and processing inquiries
- [ ] Site analytics showing engagement metrics

## Project Status

Currently in development phase focusing on:
- Core infrastructure setup
- Content migration from existing documentation
- Component library development
- Design system implementation

For detailed technical requirements and implementation plan, see `zz-project-documentation/v1-prd.md` and `zz-project-documentation/v1-style-guide.md`.
