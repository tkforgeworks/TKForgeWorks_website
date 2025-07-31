# TK ForgeWorks Website PRD

## Overview

### Product Vision

A professional static website that showcases TK ForgeWorks projects, shares technical insights through blog posts, and provides an approachable way for visitors to connect. The site should reflect the brand's personality of competent problem-solving with a touch of self-deprecating humor, while maintaining clean functionality and performance.

### Success Metrics

- Site loads in under 3 seconds on mobile
- Clean, accessible design that matches brand guidelines
- Functional contact form with email delivery
- Easy content management through markdown files
- Mobile-responsive across all devices
- Basic analytics tracking for visitor insights

---

## Technical Requirements

### Core Technology Stack

- **Framework:** Next.js 14+ with App Router
- **Styling:** Tailwind CSS with custom configuration for TK ForgeWorks color palette
- **Content:** Markdown with gray-matter for front matter parsing
- **Deployment:** Cloudflare Pages with GitHub Actions for CI/CD
- **Analytics:** Cloudflare Web Analytics (free tier)
- **Contact Form:** Cloudflare Workers for form handling and email delivery

### Architecture Overview

```other
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

---

## Content Structure & Front Matter

### Blog Posts (`/content/blog/`)

```yaml
---
title: "Why My Quick Weekend Project Has Been Sitting Unfinished"
date: "2024-07-30"
excerpt: "A cautionary tale about scope creep and optimistic timelines"
tags: ["project-management", "lessons-learned"]
status: "published" # or "draft"
---
```

### Projects (`/content/projects/`)

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

### Static Pages (`/content/pages/`)

```yaml
---
title: "About"
slug: "about"
description: "Problem-solving meets 'let's see what happens if I try this' - the story behind TK ForgeWorks"
lastUpdated: "2024-07-30"
layout: "page"
showInNav: true
navOrder: 1
metaTitle: "About TK ForgeWorks - Engineering Solutions & Creative Projects"
metaDescription: "Mechanical engineer by day, creative problem solver always. Learn about the journey from corporate transit systems to indie game development."
---
```

**Additional Static Page Examples:**

**FAQ Page (`/content/pages/faq.md`):**

```yaml
---
title: "FAQ"
slug: "faq" 
description: "The questions nobody's asked yet, but probably should"
lastUpdated: "2024-07-30"
layout: "faq"
showInNav: true
navOrder: 4
metaTitle: "FAQ - TK ForgeWorks"
metaDescription: "Preemptively answering questions about project timelines, technical choices, and why I thought I could make a game without art skills."
sections:
  - "Project Management & Process"
  - "Technical & Skills"
  - "Work & Life Balance"
  - "Business & Collaboration"
  - "Personal & Random"
---
```

**Contact Page (`/content/pages/contact.md`):**

```yaml
---
title: "Contact"
slug: "contact"
description: "Got an idea that's either brilliant or completely unhinged? Perfect—those are my favorite kind."
lastUpdated: "2024-07-30"
layout: "contact"
showInNav: true
navOrder: 5
metaTitle: "Contact TK ForgeWorks - Let's Build Something"
metaDescription: "Ready to collaborate on ambitious projects or need help solving technical challenges? Drop a line and let's see what we can build together."
contactInfo:
  email: "info@tkforgeworks.com"
  responseTime: "Usually within 24-48 hours"
  preferredTopics: 
    - "Technical collaboration"
    - "Project consulting"
    - "Game development discussions"
    - "Engineering problem solving"
---
```

**Home Page (`/content/pages/home.md`):**

```yaml
---
title: "TK ForgeWorks"
slug: "home"
description: "Where problem-solving meets 'let's see what happens if I try this'"
lastUpdated: "2024-07-30"
layout: "home"
showInNav: false
metaTitle: "TK ForgeWorks - Engineering Solutions & Creative Projects"
metaDescription: "Mechanical engineer turned creative problem solver. Building games, tools, and solutions through trial, error, and stubborn persistence."
hero:
  title: "TK ForgeWorks"
  tagline: "Where problem-solving meets 'let's see what happens if I try *this*'"
  subtitle: "Engineering solutions and creative projects through trial, error, and stubborn persistence"
featuredProjects: 
  - "aether-gears"
  - "mtg-tracker"
  - "modular-organizers"
callToAction:
  primary: "View Projects"
  secondary: "Read About Me"
---
```

---

## Page Specifications

### Home Page

**Purpose:** First impression that immediately communicates who you are and what you do

**Content:**

- Hero section with site title, tagline, and brief introduction
- Featured projects (2-3 most impressive/current)
- Recent blog posts (3 most recent)
- Call-to-action directing to projects or contact

**Typography:**

- Main title: Poppins 2.5rem/700 in Primary Purple
- Tagline: Poppins 1.1rem/400 in Secondary Purple
- Section headers: Poppins 1.8rem/600

### About Page

**Content:** Migration of current AboutMe.md with enhanced formatting
**Special Elements:**

- Professional photo placeholder
- Skills/technologies section
- Timeline of key projects/transitions

### Projects Page

**Overview Page:**

- Grid layout of project cards
- Filter by status (Active, Completed, Paused, Planning)
- Search functionality (future enhancement)

**Individual Project Pages:**

- Hero image/screenshot
- Project status badge with semantic colors
- Technical details and challenges
- Image gallery
- Links to demo/GitHub where applicable
- "What I learned" section for completed projects

### Blog Page

**Listing Page:**

- Chronological list of posts with excerpts
- Tag filtering (future enhancement)
- Pagination for posts beyond 10 per page

**Individual Post Pages:**

- Full markdown rendering with syntax highlighting
- Estimated reading time
- Navigation to previous/next posts
- Social sharing buttons (future enhancement)

### FAQ Page

**Content:** Migration of current FAQ.md content with accordion-style interface
**Enhancement:** Questions organized by category (Technical, Process, Personal, etc.)

### Contact Page

**Form Fields:**

- Name (required)
- Email (required)
- Subject (required)
- Message (required, textarea)
- Submit button with loading state

**Additional Content:**

- "Drop me a line" section with contact information
- Response time expectations
- Alternative contact methods

---

## Design System Implementation

### Color Application

- **Headers/Navigation:** Primary Purple (#6b46c1)
- **Body Text:** Text Primary (#334155)
- **Project Status Tags:** Semantic color system
  - Active: Success Green
  - Paused: Warning Yellow
  - Completed: Success Green with different styling
  - Planning: Info Blue

### Typography Scale

Implementation of complete font system from style guide:

- Poppins for all headers and UI elements
- Source Serif 4 for body text and reading content
- JetBrains Mono for code blocks and technical content

### Component Library

- ProjectCard component with status indicators
- BlogPostCard with date and reading time
- StatusBadge with semantic coloring
- ContactForm with validation and loading states
- AlertComponent for system messages

---

## Content Migration Plan

### Phase 1: Direct Migration

1. **AboutMe.md** → `/content/pages/about.md`
   - Add front matter with title and layout type
   - Maintain existing tone and content structure

2. **FAQ.md** → `/content/pages/faq.md`
   - Structure questions with proper markdown headers
   - Add expandable sections in component implementation

3. **Blog.md** + **Projects.md** → Template content
   - Convert descriptions to sample blog posts
   - Create placeholder project entries

### Phase 2: Content Enhancement

1. **Project Documentation:**
   - Create individual project markdown files
   - Add screenshots and technical details
   - Document current status and next steps

2. **Blog Content:**
   - Convert existing project updates to blog format
   - Create "lessons learned" posts from current projects
   - Technical deep-dives on interesting challenges

### Migration Checklist

- [ ] Set up content directory structure
- [ ] Migrate existing markdown files with proper front matter
- [ ] Create placeholder project images
- [ ] Test content rendering with new components
- [ ] Verify all internal links work correctly

---

## Technical Implementation

### Phase 1: Core Infrastructure (Week 1-2)

- [ ] Next.js project setup with TypeScript
- [ ] Tailwind configuration with TK ForgeWorks color system
- [ ] Basic routing and layout components
- [ ] Markdown processing pipeline
- [ ] Font integration (Google Fonts)

### Phase 2: Page Development (Week 3-4)

- [ ] Home page with featured content
- [ ] About page with enhanced formatting
- [ ] Projects listing and individual pages
- [ ] Blog functionality with markdown rendering
- [ ] FAQ page with accordion interface

### Phase 3: Contact & Forms (Week 5)

- [ ] Contact form component with validation
- [ ] Cloudflare Workers setup for form processing
- [ ] Email delivery integration
- [ ] Form success/error handling

### Phase 4: Polish & Deploy (Week 6)

- [ ] Mobile responsiveness testing
- [ ] Performance optimization
- [ ] SEO meta tags and Open Graph
- [ ] Cloudflare Pages deployment
- [ ] GitHub Actions CI/CD pipeline
- [ ] Analytics integration

---

## Deployment & CI/CD

### Cloudflare Pages Configuration

**Setup Steps:**

1. **Repository Connection:**
   - Connect GitHub repository to Cloudflare Pages
   - Configure automatic deployments from `main` branch
   - Set preview deployments for pull requests

2. **Build Configuration:**

   ```yaml
   # Cloudflare Pages build settings
   Build command: npm run build
   Build output directory: out
   Root directory: /
   Environment variables: Node.js version 18+
   ```

3. **Custom Domain Setup:**
   - Configure `tkforgeworks.com` to point to Cloudflare Pages
   - Enable automatic HTTPS with Cloudflare SSL
   - Set up www redirect to apex domain

### GitHub Actions CI/CD Pipeline

**Workflow File:** `.github/workflows/deploy.yml`

```yaml
name: Build and Deploy to Cloudflare Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout repository
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm run test
      
    - name: Check TypeScript
      run: npm run type-check
      
    - name: Lint code
      run: npm run lint
      
    - name: Build application
      run: npm run build
      env:
        NEXT_PUBLIC_SITE_URL: ${{ secrets.SITE_URL }}
        NEXT_PUBLIC_ANALYTICS_ID: ${{ secrets.ANALYTICS_ID }}
        
    - name: Deploy to Cloudflare Pages
      if: github.ref == 'refs/heads/main'
      uses: cloudflare/pages-action@v1
      with:
        apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        projectName: tkforgeworks
        directory: out
        gitHubToken: ${{ secrets.GITHUB_TOKEN }}
        
    - name: Purge Cloudflare Cache
      if: github.ref == 'refs/heads/main'
      run: |
        curl -X POST "https://api.cloudflare.com/client/v4/zones/${{ secrets.CLOUDFLARE_ZONE_ID }}/purge_cache" \
          -H "Authorization: Bearer ${{ secrets.CLOUDFLARE_API_TOKEN }}" \
          -H "Content-Type: application/json" \
          --data '{"purge_everything":true}'
```

### Contact Form Worker Deployment

**Worker Script:** `workers/contact-form.js`

```javascript
// Cloudflare Worker for handling contact form submissions
export default {
  async fetch(request) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': 'https://tkforgeworks.com',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method === 'POST') {
      try {
        const formData = await request.json();
        
        // Basic validation
        if (!formData.name || !formData.email || !formData.message) {
          return new Response('Missing required fields', { status: 400 });
        }

        // Send email using Cloudflare Email Workers or external service
        const emailResult = await fetch('https://api.mailgun.net/v3/your-domain/messages', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${base64Encode('api:' + MAILGUN_API_KEY)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            from: 'noreply@tkforgeworks.com',
            to: 'info@tkforgeworks.com',
            subject: `Contact Form: ${formData.subject}`,
            text: `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`,
          }),
        });

        return new Response('Message sent successfully', {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': 'https://tkforgeworks.com',
          },
        });
      } catch (error) {
        return new Response('Internal server error', { status: 500 });
      }
    }

    return new Response('Method not allowed', { status: 405 });
  },
};
```

**Worker Deployment:**

```bash
# Using Wrangler CLI
npx wrangler deploy workers/contact-form.js --name contact-form
npx wrangler secret put MAILGUN_API_KEY
```

### Environment Variables & Secrets

**GitHub Secrets Configuration:**

```yaml
# Required for Cloudflare Pages deployment
CLOUDFLARE_API_TOKEN: # API token with Pages:Edit permissions
CLOUDFLARE_ACCOUNT_ID: # Account ID from Cloudflare dashboard
CLOUDFLARE_ZONE_ID: # Zone ID for cache purging
SITE_URL: https://tkforgeworks.com
ANALYTICS_ID: # Cloudflare Analytics site ID

# For contact form worker
MAILGUN_API_KEY: # If using Mailgun for email delivery
MAILGUN_DOMAIN: # Your Mailgun domain
```

**Next.js Environment Variables:**

```bash
# .env.local (for local development)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
NEXT_PUBLIC_CONTACT_FORM_URL=https://contact-form.your-subdomain.workers.dev

# .env.production (set in Cloudflare Pages)
NEXT_PUBLIC_SITE_URL=https://tkforgeworks.com
NEXT_PUBLIC_ANALYTICS_ID=production-analytics-id
NEXT_PUBLIC_CONTACT_FORM_URL=https://contact-form.your-subdomain.workers.dev
```

### Next.js Configuration for Static Export

**next.config.js:**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  // Ensure static export works with dynamic routes
  generateStaticParams: async () => {
    // This will be implemented to generate static paths for blog posts and projects
    return [];
  },
};

module.exports = nextConfig;
```

### Deployment Pipeline Flow

**Development Workflow:**

1. **Local Development:**
   - `npm run dev` - Local development server
   - `npm run build` - Test static export locally
   - `npm run start` - Serve built static files

2. **Pull Request Process:**
   - GitHub Actions runs tests, linting, and type checking
   - Cloudflare Pages creates preview deployment
   - Review changes on preview URL
   - Merge to main after approval

3. **Production Deployment:**
   - GitHub Actions triggers on main branch push
   - Build process creates optimized static export
   - Automatic deployment to Cloudflare Pages
   - Cache purge ensures fresh content delivery
   - Health check verifies successful deployment

### Content Update Workflow

**Adding New Blog Posts:**

1. Create markdown file in `/content/blog/`
2. Add appropriate front matter with date, title, excerpt
3. Include any images in `/public/images/blog/`
4. Commit and push to main branch
5. GitHub Actions automatically rebuilds and deploys

**Adding New Projects:**

1. Create markdown file in `/content/projects/`
2. Add project images to `/public/images/projects/[project-name]/`
3. Update front matter with status, tech stack, links
4. Commit and push to trigger automatic deployment

### Monitoring & Alerts

**Deployment Monitoring:**

- GitHub Actions email notifications for failed builds
- Cloudflare Pages webhook notifications
- Basic uptime monitoring through Cloudflare Analytics

**Performance Monitoring:**

- Cloudflare Web Analytics for visitor tracking
- Core Web Vitals monitoring through Cloudflare
- Build time tracking in GitHub Actions

### Rollback Strategy

**Quick Rollback Options:**

1. **Git Revert:** Revert problematic commit and push
2. **Cloudflare Rollback:** Use Cloudflare Pages deployment history
3. **Manual Deploy:** Push previous working commit to trigger rebuild

**Emergency Procedures:**

- Keep previous build artifacts for 30 days
- Document rollback procedures in repository README
- Maintain staging environment for testing major changes

### Security Considerations

**API Token Security:**

- Use minimal permissions for Cloudflare API tokens
- Rotate tokens every 90 days
- Store all secrets in GitHub Secrets, never in code

**Content Security:**

- Enable Cloudflare security features (DDoS protection, WAF)
- Use HTTPS everywhere with automatic HTTPS redirects
- Implement CSP headers for additional security

### Estimated Setup Time

**Initial Configuration:** 4-6 hours

- Repository setup and GitHub Actions configuration
- Cloudflare Pages connection and domain setup
- Contact form worker deployment and testing
- Environment variables and secrets configuration

**Testing & Validation:** 2-3 hours

- End-to-end deployment testing
- Contact form functionality verification
- Performance testing and optimization
- Security configuration review

This deployment strategy provides automated, reliable updates while maintaining the flexibility to handle both content updates and feature development efficiently.

---

## Content Strategy

### Launch Content Requirements

- **About Page:** Complete migration with professional tone
- **3 Project Pages:** Aether Gears, MTG Tracker, plus one hardware project
- **3 Blog Posts:**
  - "Why I Started TK ForgeWorks"
  - "Lessons from My First Game Dev Project"
  - "The Joy of Overengineering Simple Problems"
- **Complete FAQ:** All sections from current draft

### Content Calendar (Post-Launch)

- **Weekly:** Project update posts during active development
- **Bi-weekly:** Technical deep-dives or problem-solving stories
- **Monthly:** "What I'm Learning" reflection posts
- **As-needed:** Project completion retrospectives

---

## Future Enhancements

### Phase 2 Features (3-6 months post-launch)

- Dark mode toggle with system preference detection
- Blog post search and tag filtering
- RSS feed generation
- Enhanced project filtering and sorting
- Social media integration

### Phase 3 Features (6+ months)

- Comment system for blog posts
- Project collaboration inquiries
- Newsletter signup
- Advanced analytics dashboard
- Performance monitoring

---

## Risk Assessment

### Technical Risks

- **Learning Curve:** First Next.js project may take longer than estimated
- **Mitigation:** Start with simple components, iterate based on learning

### Content Risks

- **Maintaining Update Frequency:** Balancing site updates with project development
- **Mitigation:** Batch content creation, focus on quality over quantity

### Timeline Risks

- **Scope Creep:** Adding features during development
- **Mitigation:** Strict MVP focus, document enhancement ideas for future phases

---

## Success Criteria

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

### 90-Day Goals

- [ ] Consistent weekly content publishing
- [ ] Evidence of visitor engagement (return visits, contact inquiries)
- [ ] At least one collaboration inquiry through the site
- [ ] Performance metrics consistently meeting targets

---

## Budget Considerations

### Domain & Hosting

- **Domain:** Already owned (tkforgeworks.com)
- **Cloudflare Pages:** Free tier sufficient for static site
- **Email Service:** Cloudflare Email Routing (free) or basic email hosting

### Development Tools

- **All development tools:** Free tier options available
- **Design Assets:** Utilize existing brand guidelines
- **Time Investment:** Estimated 40-50 hours over 6 weeks

---

This PRD balances ambition with pragmatism, providing a clear roadmap for creating a professional web presence that can grow with TK ForgeWorks while maintaining the authentic voice that makes the brand distinctive. The technical choices prioritize maintainability and performance while giving you the React-based control you wanted for future enhancements.
