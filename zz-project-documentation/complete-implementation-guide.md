# TK ForgeWorks Website Implementation Guide

Complete guide for building a markdown-based Next.js website with automatic content processing, SEO optimization, and brand styling.

## Overview

This system transforms simple markdown files into professional, fast-loading web pages with automatic SEO optimization, social media integration, and consistent brand styling. You write content in markdown, and the system handles everything else.

**Key Benefits:**

- Write in markdown, get professional web pages
- Automatic SEO optimization and social media cards
- Lightning-fast static site performance
- Consistent brand styling across all content
- Easy content management without databases

## Technology Stack

- **Framework:** Next.js 14+ with App Router
- **Styling:** Tailwind CSS with custom TK ForgeWorks design system
- **Content Processing:** Markdown with gray-matter and remark
- **Deployment:** Cloudflare Pages with GitHub Actions CI/CD
- **Contact Forms:** Cloudflare Workers
- **Analytics:** Cloudflare Web Analytics

## Project Structure

```default
tkforgeworks-website/
├── app/                           # Next.js App Router
│   ├── layout.tsx                 # Root layout with fonts/styling
│   ├── page.tsx                   # Home page
│   ├── about/page.tsx             # About page
│   ├── projects/
│   │   ├── page.tsx               # Projects listing
│   │   └── [slug]/page.tsx        # Individual project pages
│   ├── blog/
│   │   ├── page.tsx               # Blog listing
│   │   └── [slug]/page.tsx        # Individual blog posts
│   ├── faq/page.tsx               # FAQ page
│   └── contact/page.tsx           # Contact page
├── components/                    # Reusable React components
│   ├── BlogPostLayout.tsx         # Blog post template
│   ├── ProjectLayout.tsx          # Project page template
│   ├── StatusBadge.tsx           # Project status indicators
│   ├── TableOfContents.tsx       # Auto-generated TOC
│   └── SEOHead.tsx               # SEO metadata component
├── content/                       # Markdown content files
│   ├── blog/                     # Blog posts
│   ├── projects/                 # Project documentation
│   └── pages/                    # Static pages (about, faq, etc.)
├── lib/                          # Utility functions
│   ├── content.ts                # Content processing pipeline
│   ├── seo-utils.ts              # SEO metadata generation
│   └── content-extensions.ts     # Advanced features (TOC, related content)
├── public/
│   ├── images/
│   │   ├── blog/                 # Blog post images
│   │   ├── projects/             # Project screenshots
│   │   └── og-default.png        # Default social media image
├── scripts/                      # Content creation helpers
│   ├── new-post.js               # Create new blog post
│   └── new-project.js            # Create new project
├── styles/                       # Global CSS
├── tailwind.config.js            # Tailwind with TK ForgeWorks colors
├── next.config.js                # Next.js configuration
└── package.json                  # Dependencies and scripts
```

## Installation and Setup

### 1. Initialize Next.js Project

```bash
npx create-next-app@latest tkforgeworks-website --typescript --tailwind --eslint --app
cd tkforgeworks-website
```

### 2. Install Required Dependencies

```bash
npm install gray-matter remark remark-html remark-gfm remark-prism lucide-react
npm install -D @tailwindcss/typography @tailwindcss/forms
```

### 3. Package.json Scripts

```json
{
  "name": "tkforgeworks-website",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "new:post": "node scripts/new-post.js",
    "new:project": "node scripts/new-project.js",
    "preview": "npm run build && npm run start"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18",
    "react-dom": "^18",
    "gray-matter": "^4.0.3",
    "remark": "^15.0.1",
    "remark-html": "^16.0.1",
    "remark-gfm": "^4.0.0",
    "remark-prism": "^1.3.6",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@tailwindcss/typography": "^0.5.10",
    "@tailwindcss/forms": "^0.5.6",
    "autoprefixer": "^10",
    "eslint": "^8",
    "eslint-config-next": "14.0.0",
    "postcss": "^8",
    "tailwindcss": "^3.3.0",
    "typescript": "^5"
  }
}
```

## Core Implementation Files

### Content Processing System

**File: `lib/content.ts`**

```typescript
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import remarkPrism from 'remark-prism';

const contentDirectory = path.join(process.cwd(), 'content');

export interface ContentItem {
  slug: string;
  content: string;
  data: any;
  excerpt?: string;
  readingTime?: number;
}

// Generic content loader that works for any content type
export async function getContentItems(contentType: string): Promise<ContentItem[]> {
  const contentPath = path.join(contentDirectory, contentType);
  
  if (!fs.existsSync(contentPath)) {
    return [];
  }

  const fileNames = fs.readdirSync(contentPath)
    .filter(name => name.endsWith('.md'));

  const items = await Promise.all(
    fileNames.map(async (fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      return await getContentItem(contentType, slug);
    })
  );

  // Sort by date for blog posts, by featured status for projects
  return items.filter(Boolean).sort((a, b) => {
    if (contentType === 'blog') {
      return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
    }
    if (contentType === 'projects') {
      // Featured projects first, then by status priority
      if (a.data.featured !== b.data.featured) {
        return b.data.featured ? 1 : -1;
      }
      const statusPriority = { 'Active': 0, 'Planning': 1, 'Paused': 2, 'Completed': 3 };
      return statusPriority[a.data.status] - statusPriority[b.data.status];
    }
    return 0;
  });
}

export async function getContentItem(contentType: string, slug: string): Promise<ContentItem | null> {
  try {
    const fullPath = path.join(contentDirectory, contentType, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Process markdown to HTML
    const processedContent = await remark()
      .use(remarkGfm) // GitHub Flavored Markdown (tables, task lists, etc.)
      .use(remarkPrism, { 
        plugins: ['line-numbers', 'show-language'] 
      }) // Syntax highlighting
      .use(remarkHtml, { sanitize: false })
      .process(content);

    // Calculate reading time (rough estimate: 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    // Generate excerpt if not provided
    let excerpt = data.excerpt;
    if (!excerpt && contentType === 'blog') {
      // Take first paragraph or first 150 characters
      const firstParagraph = content.split('\n\n')[0];
      excerpt = firstParagraph.length > 150 
        ? firstParagraph.substring(0, 150) + '...'
        : firstParagraph;
    }

    return {
      slug,
      content: processedContent.toString(),
      data: {
        ...data,
        slug, // Ensure slug is available in data
      },
      excerpt,
      readingTime,
    };
  } catch (error) {
    console.error(`Error loading content item: ${contentType}/${slug}`, error);
    return null;
  }
}

// Get all slugs for static generation
export function getContentSlugs(contentType: string): string[] {
  const contentPath = path.join(contentDirectory, contentType);
  
  if (!fs.existsSync(contentPath)) {
    return [];
  }

  return fs.readdirSync(contentPath)
    .filter(name => name.endsWith('.md'))
    .map(name => name.replace(/\.md$/, ''));
}

// Helper to get featured content for homepage
export async function getFeaturedContent() {
  const [projects, posts] = await Promise.all([
    getContentItems('projects'),
    getContentItems('blog')
  ]);

  return {
    featuredProjects: projects.filter(p => p.data.featured).slice(0, 3),
    recentPosts: posts.filter(p => p.data.status === 'published').slice(0, 3),
  };
}
```

### SEO and Metadata System

**File: `lib/seo-utils.ts`**

```typescript
import { ContentItem } from './content';

// Generate comprehensive metadata for any content type
export function generateMetadata(item: ContentItem, type: 'blog' | 'project' | 'page') {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tkforgeworks.com';
  const defaultImage = '/images/og-default.png';
  
  // Smart title generation
  const title = item.data.metaTitle || 
    (type === 'blog' ? `${item.data.title} | TK ForgeWorks Blog` :
     type === 'project' ? `${item.data.title} | TK ForgeWorks Projects` :
     `${item.data.title} | TK ForgeWorks`);
  
  // Smart description generation
  const description = item.data.metaDescription || 
    item.excerpt || 
    item.data.description ||
    "Engineering solutions and creative projects through trial, error, and stubborn persistence.";
  
  // Image selection
  const image = item.data.images?.[0] 
    ? `${baseUrl}/images/${type}s/${item.slug}/${item.data.images[0]}`
    : `${baseUrl}${defaultImage}`;
  
  const url = `${baseUrl}/${type === 'page' ? '' : type + '/'}${item.slug}`;
  
  return {
    title,
    description,
    keywords: item.data.tags?.join(', '),
    openGraph: {
      title: item.data.title,
      description,
      url,
      siteName: 'TK ForgeWorks',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: item.data.title,
        },
      ],
      locale: 'en_US',
      type: type === 'blog' ? 'article' : 'website',
      ...(type === 'blog' && {
        publishedTime: item.data.date,
        authors: ['TK ForgeWorks'],
        section: 'Technology',
        tags: item.data.tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: item.data.title,
      description,
      creator: '@tkforgeworks', // Update with your handle
      images: [image],
    },
    robots: {
      index: item.data.status !== 'draft',
      follow: true,
      googleBot: {
        index: item.data.status !== 'draft',
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: url,
    },
  };
}

// Generate JSON-LD structured data
export function generateStructuredData(item: ContentItem, type: 'blog' | 'project' | 'page') {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tkforgeworks.com';
  
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': type === 'blog' ? 'BlogPosting' : 'CreativeWork',
    headline: item.data.title,
    description: item.excerpt || item.data.description,
    url: `${baseUrl}/${type === 'page' ? '' : type + '/'}${item.slug}`,
    author: {
      '@type': 'Person',
      name: 'TK ForgeWorks',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'TK ForgeWorks',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo.png`,
      },
    },
  };
  
  if (type === 'blog') {
    return {
      ...baseStructuredData,
      datePublished: item.data.date,
      dateModified: item.data.lastUpdated || item.data.date,
      keywords: item.data.tags?.join(', '),
      articleSection: 'Technology',
      wordCount: item.content.split(/\s+/).length,
      timeRequired: `PT${item.readingTime || 5}M`,
    };
  }
  
  if (type === 'project') {
    return {
      ...baseStructuredData,
      '@type': 'SoftwareApplication',
      name: item.data.title,
      applicationCategory: 'DeveloperApplication',
      programmingLanguage: item.data.tech,
      codeRepository: item.data.github,
      ...(item.data.demo && { url: item.data.demo }),
    };
  }
  
  return baseStructuredData;
}
```

### Tailwind Configuration

**File: `tailwind.config.js`**

```javascript
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        header: ['Poppins', ...fontFamily.sans],
        body: ['Source Serif 4', ...fontFamily.serif],
        code: ['JetBrains Mono', ...fontFamily.mono],
      },
      colors: {
        // TK ForgeWorks color system
        'purple-primary': '#6b46c1',
        'purple-secondary': '#7c3aed',
        'purple-dark': '#553c9a',
        'purple-tint': '#ede9fe',
        'text-primary': '#334155',
        'text-secondary': '#64748b',
        'background-light': '#f8fafc',
        // Semantic colors
        'success-primary': '#16a34a',
        'success-light': '#f0fdf4',
        'warning-primary': '#d97706',
        'warning-light': '#fffbeb',
        'error-primary': '#dc2626',
        'error-light': '#fef2f2',
        'info-primary': '#0284c7',
        'info-light': '#f0f9ff',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.text-primary'),
            fontFamily: theme('fontFamily.body').join(', '),
            lineHeight: '1.75',
            
            'h1, h2, h3, h4, h5, h6': {
              fontFamily: theme('fontFamily.header').join(', '),
              color: theme('colors.purple-primary'),
              fontWeight: '600',
            },
            h1: {
              fontSize: '2.25rem',
              lineHeight: '2.5rem',
              marginTop: '0',
              marginBottom: '2rem',
            },
            h2: {
              fontSize: '1.875rem',
              lineHeight: '2.25rem',
              marginTop: '3rem',
              marginBottom: '1.5rem',
            },
            h3: {
              fontSize: '1.5rem',
              lineHeight: '2rem',
              marginTop: '2.5rem',
              marginBottom: '1rem',
            },
            
            a: {
              color: theme('colors.purple-secondary'),
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': {
                textDecoration: 'underline',
                color: theme('colors.purple-dark'),
              },
            },
            
            code: {
              fontFamily: theme('fontFamily.code').join(', '),
              backgroundColor: theme('colors.purple-tint'),
              color: theme('colors.purple-primary'),
              padding: '0.25rem 0.5rem',
              borderRadius: '0.375rem',
              fontSize: '0.875em',
              fontWeight: '500',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            
            pre: {
              backgroundColor: theme('colors.gray.900'),
              color: theme('colors.gray.100'),
              padding: '1.5rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              lineHeight: '1.5',
              overflow: 'auto',
            },
            'pre code': {
              backgroundColor: 'transparent',
              color: 'inherit',
              padding: '0',
              borderRadius: '0',
              fontSize: 'inherit',
              fontWeight: '400',
            },
            
            blockquote: {
              borderLeftColor: theme('colors.purple-primary'),
              borderLeftWidth: '4px',
              backgroundColor: theme('colors.purple-tint') + '30',
              padding: '1rem 1.5rem',
              margin: '2rem 0',
              fontStyle: 'italic',
              quotes: '"\\201C""\\201D""\\2018""\\2019"',
            },
            
            'ul, ol': {
              fontFamily: theme('fontFamily.body').join(', '),
              paddingLeft: '1.5rem',
            },
            'ul > li::marker': {
              color: theme('colors.purple-primary'),
            },
            'ol > li::marker': {
              color: theme('colors.purple-primary'),
              fontWeight: '600',
            },
            
            table: {
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '2rem',
              marginBottom: '2rem',
            },
            'th, td': {
              border: `1px solid ${theme('colors.gray.300')}`,
              padding: '0.75rem 1rem',
              textAlign: 'left',
            },
            th: {
              backgroundColor: theme('colors.purple-tint'),
              color: theme('colors.purple-primary'),
              fontWeight: '600',
              fontFamily: theme('fontFamily.header').join(', '),
            },
            'tbody tr:nth-child(even)': {
              backgroundColor: theme('colors.background-light'),
            },
            
            img: {
              borderRadius: '0.5rem',
              marginTop: '2rem',
              marginBottom: '2rem',
            },
            
            strong: {
              color: theme('colors.text-primary'),
              fontWeight: '600',
            },
            
            hr: {
              borderColor: theme('colors.gray.300'),
              marginTop: '3rem',
              marginBottom: '3rem',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};
```

### Dynamic Page Components

**File: `app/blog/[slug]/page.tsx`**

```typescript
import { getContentItem, getContentSlugs } from '@/lib/content';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo-utils';
import { notFound } from 'next/navigation';
import BlogPostLayout from '@/components/BlogPostLayout';

// Generate static params for all blog posts
export async function generateStaticParams() {
  const slugs = getContentSlugs('blog');
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getContentItem('blog', params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return generateSEOMetadata(post, 'blog');
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getContentItem('blog', params.slug);

  if (!post || post.data.status !== 'published') {
    notFound();
  }

  return <BlogPostLayout post={post} />;
}
```

**File: `app/projects/[slug]/page.tsx`**

```typescript
import { getContentItem, getContentSlugs } from '@/lib/content';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo-utils';
import { notFound } from 'next/navigation';
import ProjectLayout from '@/components/ProjectLayout';

export async function generateStaticParams() {
  const slugs = getContentSlugs('projects');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await getContentItem('projects', params.slug);
  
  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return generateSEOMetadata(project, 'project');
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getContentItem('projects', params.slug);

  if (!project) {
    notFound();
  }

  return <ProjectLayout project={project} />;
}
```

### Layout Components

**File: `components/BlogPostLayout.tsx`**

```typescript
import { ContentItem } from '@/lib/content';
import { Calendar, Clock } from 'lucide-react';

interface BlogPostLayoutProps {
  post: ContentItem;
}

export default function BlogPostLayout({ post }: BlogPostLayoutProps) {
  const { data, content, readingTime } = post;
  
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="font-header text-4xl md:text-5xl font-bold text-purple-primary mb-6">
          {data.title}
        </h1>
        
        {data.excerpt && (
          <p className="font-body text-xl text-text-secondary mb-8 max-w-3xl mx-auto">
            {data.excerpt}
          </p>
        )}
        
        <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-text-secondary">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <time dateTime={data.date}>
              {new Date(data.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
          
          {readingTime && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{readingTime} min read</span>
            </div>
          )}
          
          {data.tags && data.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-purple-tint text-purple-primary rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <footer className="mt-12 pt-8 border-t border-gray-200">
        <div className="text-center">
          <p className="font-body text-text-secondary mb-4">
            Questions? Thoughts? Something completely broke? 
            <a href="/contact" className="text-purple-secondary hover:underline ml-1">
              Let me know.
            </a>
          </p>
        </div>
      </footer>
    </article>
  );
}
```

**File: `components/ProjectLayout.tsx`**

```typescript
import { ContentItem } from '@/lib/content';
import StatusBadge from './StatusBadge';
import { ExternalLink, Github } from 'lucide-react';
import Image from 'next/image';

interface ProjectLayoutProps {
  project: ContentItem;
}

export default function ProjectLayout({ project }: ProjectLayoutProps) {
  const { data, content } = project;
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <h1 className="font-header text-4xl md:text-5xl font-bold text-purple-primary mb-4">
              {data.title}
            </h1>
            <StatusBadge status={data.status} />
          </div>
          
          <div className="flex gap-4">
            {data.demo && (
              <a
                href={data.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-primary text-white rounded-lg hover:bg-purple-dark transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View Demo
              </a>
            )}
            {data.github && (
              <a
                href={data.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-purple-primary text-purple-primary rounded-lg hover:bg-purple-tint transition-colors"
              >
                <Github className="w-4 h-4" />
                View Code
              </a>
            )}
          </div>
        </div>

        {data.description && (
          <p className="font-body text-xl text-text-secondary max-w-4xl">
            {data.description}
          </p>
        )}
      </header>

      {data.images && data.images.length > 0 && (
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.images.map((image: string, index: number) => (
              <div key={image} className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src={`/images/projects/${project.slug}/${image}`}
                  alt={`${data.title} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {data.tech && data.tech.length > 0 && (
        <div className="mb-12">
          <h2 className="font-header text-2xl font-semibold text-purple-primary mb-4">
            Technology Stack
          </h2>
          <div className="flex flex-wrap gap-3">
            {data.tech.map((tech: string) => (
              <span
                key={tech}
                className="px-4 py-2 bg-info-light text-info-primary rounded-lg font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <footer className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            {data.startDate && (
              <p className="font-body text-text-secondary">
                Started: {new Date(data.startDate).toLocaleDateString()}
                {data.completedDate && (
                  <span> • Completed: {new Date(data.completedDate).toLocaleDateString()}</span>
                )}
              </p>
            )}
          </div>
          <div>
            <a
              href="/projects"
              className="inline-flex items-center gap-2 text-purple-secondary hover:underline"
            >
              ← Back to Projects
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
```

**File: `components/StatusBadge.tsx`**

```typescript
interface StatusBadgeProps {
  status: 'Active' | 'Paused' | 'Completed' | 'Planning';
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const styles = {
    Active: 'bg-success-light text-success-primary',
    Paused: 'bg-warning-light text-warning-primary',
    Completed: 'bg-success-light text-success-primary',
    Planning: 'bg-info-light text-info-primary',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${styles[status]} ${className}`}>
      {status}
    </span>
  );
}
```

### Content Creation Scripts

**File: `scripts/new-post.js`**

```javascript
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function createNewPost() {
  console.log('📝 Creating a new blog post...\n');

  const title = await askQuestion('Post title: ');
  const excerpt = await askQuestion('Brief excerpt: ');
  const tags = await askQuestion('Tags (comma-separated): ');
  const status = await askQuestion('Status (published/draft) [draft]: ') || 'draft';

  const slug = slugify(title);
  const date = new Date().toISOString().split('T')[0];
  const tagList = tags.split(',').map(tag => tag.trim()).filter(Boolean);

  const frontMatter = `---
title: "${title}"
date: "${date}"
excerpt: "${excerpt}"
tags: [${tagList.map(tag => `"${tag}"`).join(', ')}]
status: "${status}"
---

# ${title}

${excerpt}

## Introduction

Your content here...

## Conclusion

Wrapping up thoughts...

---

*Questions? Something completely broke? [Let me know](/contact) and I'll pretend I know what I'm doing.*
`;

  // Ensure content/blog directory exists
  const blogDir = path.join(process.cwd(), 'content', 'blog');
  if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
  }

  const filePath = path.join(blogDir, `${slug}.md`);
  
  if (fs.existsSync(filePath)) {
    console.log(`❌ File already exists: ${filePath}`);
    rl.close();
    return;
  }

  fs.writeFileSync(filePath, frontMatter);
  console.log(`✅ Created new blog post: content/blog/${slug}.md`);
  console.log(`📁 Open it in your editor and start writing!`);
  
  rl.close();
}

createNewPost().catch(console.error);
```

**File: `scripts/new-project.js`**

```javascript
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function createNewProject() {
  console.log('🚀 Creating a new project...\n');

  const title = await askQuestion('Project title: ');
  const description = await askQuestion('Brief description: ');
  const status = await askQuestion('Status (Active/Planning/Paused/Completed) [Planning]: ') || 'Planning';
  const tech = await askQuestion('Tech stack (comma-separated): ');
  const featured = await askQuestion('Featured project? (y/n) [n]: ');
  const github = await askQuestion('GitHub URL (optional): ');
  const demo = await askQuestion('Demo URL (optional): ');

  const slug = slugify(title);
  const techList = tech.split(',').map(t => t.trim()).filter(Boolean);
  const isFeatured = featured.toLowerCase() === 'y' || featured.toLowerCase() === 'yes';

  const frontMatter = `---
title: "${title}"
status: "${status}"
excerpt: "${description}"
tech: [${techList.map(t => `"${t}"`).join(', ')}]
featured: ${isFeatured}
images: []${github ? `\ngithub: "${github}"` : ''}${demo ? `\ndemo: "${demo}"` : ''}
---

# ${title}

${description}

## Overview

What this project is all about...

## Technical Approach

How you're building it (or how you plan to)...

## Current Status

Where things stand right now...

${status === 'Active' ? '## What\'s Next\n\nUpcoming features and improvements...' : ''}

${status === 'Completed' ? '## What I Learned\n\nKey takeaways from this project...' : ''}

---

*Interested in collaborating or have questions about the approach? [Drop me a line](/contact).*
`;

  // Ensure content/projects directory exists
  const projectsDir = path.join(process.cwd(), 'content', 'projects');
  if (!fs.existsSync(projectsDir)) {
    fs.mkdirSync(projectsDir, { recursive: true });
  }

  const filePath = path.join(projectsDir, `${slug}.md`);
  
  if (fs.existsSync(filePath)) {
    console.log(`❌ File already exists: ${filePath}`);
    rl.close();
    return;
  }

  // Create project directory for images
  const imageDir = path.join(process.cwd(), 'public', 'images', 'projects', slug);
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
    console.log(`📁 Created image directory: public/images/projects/${slug}/`);
  }

  fs.writeFileSync(filePath, frontMatter);
  console.log(`✅ Created new project: content/projects/${slug}.md`);
  console.log(`🖼️  Add project images to: public/images/projects/${slug}/`);
  console.log(`📝 Update the frontmatter 'images' array with your filenames`);
  
  rl.close();
}

createNewProject().catch(console.error);
```

### Next.js Configuration

**File: `next.config.js`**

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
};

module.exports = nextConfig;
```

### Root Layout

**File: `app/layout.tsx`**

```typescript
import type { Metadata } from 'next';
import { Poppins, Source_Serif_4, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

const sourceSerif = Source_Serif_4({ 
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-source-serif',
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'TK ForgeWorks',
  description: 'Engineering solutions and creative projects through trial, error, and stubborn persistence.',
  keywords: 'engineering, software development, game development, projects, mechanical engineering',
  authors: [{ name: 'TK ForgeWorks' }],
  creator: 'TK ForgeWorks',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tkforgeworks.com',
    siteName: 'TK ForgeWorks',
    title: 'TK ForgeWorks',
    description: 'Engineering solutions and creative projects through trial, error, and stubborn persistence.',
    images: [
      {
        url: '/images/og-default.png',
        width: 1200,
        height: 630,
        alt: 'TK ForgeWorks',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TK ForgeWorks',
    description: 'Engineering solutions and creative projects through trial, error, and stubborn persistence.',
    images: ['/images/og-default.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}>
      <body className="font-body text-text-primary bg-white">
        {children}
      </body>
    </html>
  );
}
```

**File: `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --font-header: var(--font-poppins);
    --font-body: var(--font-source-serif);
    --font-code: var(--font-jetbrains-mono);
  }
}

/* Prism syntax highlighting customization */
pre[class*="language-"] {
  @apply bg-gray-900 text-gray-100;
}

code[class*="language-"] {
  @apply text-gray-100;
}

.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
  @apply text-gray-400;
}

.token.punctuation {
  @apply text-gray-300;
}

.token.property,
.token.tag,
.token.constant,
.token.symbol,
.token.deleted {
  @apply text-red-400;
}

.token.boolean,
.token.number {
  @apply text-orange-400;
}

.token.selector,
.token.attr-name,
.token.string,
.token.char,
.token.builtin,
.token.inserted {
  @apply text-green-400;
}

.token.operator,
.token.entity,
.token.url,
.language-css .token.string,
.style .token.string,
.token.variable {
  @apply text-cyan-400;
}

.token.atrule,
.token.attr-value,
.token.function,
.token.class-name {
  @apply text-yellow-400;
}

.token.keyword {
  @apply text-purple-400;
}

.token.regex,
.token.important {
  @apply text-orange-400;
}
```

## Content Structure and Examples

### Blog Post Example

**File: `content/blog/debugging-murphy-law.md`**

```markdown
---
title: "Debugging Code That Worked Yesterday"
date: "2024-08-08"
excerpt: "Murphy's Law meets software development - a meditation on flaky tests and broken builds"
tags: ["debugging", "murphy's-law", "testing"]
status: "published"
---

# Debugging Code That Worked Yesterday

You know the feeling. Yesterday, your code was working perfectly. Today, it's throwing errors that make no sense, and your test suite has developed trust issues.

## The Classic Symptoms

- Tests that passed are now failing
- Features that worked are mysteriously broken
- Your coffee has gone cold while you stare at the screen
- Git blame points to your own commits

## The Investigation Process

First, you check the obvious things:


``bash <CHANGE TO PROPER BLOCK IN REAL FILE>
# Did I break something in the last commit?
git diff HEAD~1

# Maybe it's a dependency issue?
npm ci

# Perhaps the classic solution...
rm -rf node_modules && npm install
``

But no, the gremlins run deeper.

## The Real Culprit

After three hours of debugging, you discover the issue: **case sensitivity in file paths on Linux vs Mac.** Your local development works fine, but CI is running on Linux and `./Component.tsx` is not the same as `./component.tsx`.

> Pro tip: Always use consistent casing in file paths. Your future self will thank you.

## Lessons Learned

1. **Environment differences are real** - What works locally might not work in production
2. **Case sensitivity matters** - Especially when deploying to different operating systems
3. **Debugging is a skill** - The more you practice, the faster you get at finding these issues
4. **Documentation helps** - Write down what you learn for next time

## The Silver Lining

Every debugging session teaches you something new about your system. Even when the fix is embarrassingly simple, you've gained experience that will help you solve similar problems faster next time.

Plus, you now have a great story for the next time someone asks "What's the weirdest bug you've encountered?"

---

*Questions? Something completely broke? [Let me know](/contact) and I'll pretend I know what I'm doing.*

```

### Project Example

**File: `content/projects/aether-gears.md`**

```markdown
---
title: "Aether Gears"
status: "Active"
excerpt: "Action RPG about corporate greed and resource exploitation - because nothing says 'fun' like commenting on late-stage capitalism through game mechanics"
tech: ["Unity", "C#", "Game Development", "Blender"]
featured: true
images: ["gameplay-screenshot.jpg", "character-concept.png"]
github: "https://github.com/tkforgeworks/aether-gears"
startDate: "2024-06-01"
---

# Aether Gears

An action RPG where you play as a mechanic trying to survive in a world where corporations have monopolized magical energy sources. Think Diablo meets critique of modern capitalism, with gear crafting that actually makes sense.

## Overview

Aether Gears started as a "simple" 2D action game and has predictably evolved into something much more ambitious. The core concept revolves around salvaging parts from corporate drones and crafting your own equipment, because buying gear from the same corporations trying to kill you seems counterproductive.

## Core Mechanics

### Combat System
- **Modular Weapons:** Build weapons from salvaged parts
- **Energy Management:** Aether powers abilities but is controlled by corporations
- **Environmental Storytelling:** The world tells the story of corporate overreach

### Crafting & Progression
- **Salvage Economy:** Everything comes from defeating enemies or scavenging
- **Modular Gear:** Weapons and armor are built from interchangeable components
- **Skill Trees:** Multiple progression paths based on playstyle

## Technical Approach

Built in Unity because I'm already familiar with it, and diving into a new engine while learning game design seemed like enough complexity for one project.

``csharp <CHANGE TO REAL CODE BLOCK HERE>
// Example of the modular weapon system
public class Weapon : MonoBehaviour
{
    public WeaponBase baseComponent;
    public WeaponBarrel barrel;
    public WeaponTrigger trigger;
    
    public void CalculateStats()
    {
        damage = baseComponent.baseDamage + barrel.damageModifier;
        fireRate = trigger.fireRateModifier;
        // Emergent gameplay from component combinations
    }
}
``

## Current Status

**What's Working:**

- Basic character movement and combat
- Modular weapon system prototype
- Enemy AI that's only occasionally suicidal
- Save system that doesn't corrupt your progress (anymore)

**What's In Progress:**

- Crafting UI that doesn't look like programmer art
- More enemy types beyond "drone that shoots at you"
- Story delivery that's subtle enough to not feel preachy
- Sound effects that don't make your ears bleed

**What's Planned:**

- Full campaign with multiple areas
- Co-op multiplayer (because debugging multiplayer is exactly what this project needs)
- Steam release (optimistic timeline: "eventually")

## Challenges & Learning

### Art Direction

As someone with zero artistic training, creating cohesive visuals has been... educational. I've learned that "programmer art" is indeed a real and terrible thing, and that spending time on visual polish is worth it even if you think nobody will notice.

### Scope Management

The classic indie dev trap: "This will be a simple game" gradually becomes "This will revolutionize the RPG genre." I've gotten better at cutting features that don't serve the core experience, even when they seem cool in isolation.

### Game Feel

Making combat feel responsive and impactful is harder than it looks. There's a surprising amount of hidden complexity in making a sword swing feel satisfying versus floaty and awkward.

## What I'm Learning

- **Game Design:** How to create systems that are fun rather than just functional
- **Unity Optimization:** Making the game run smoothly on various hardware
- **Player Psychology:** What motivates players to keep playing
- **Asset Pipeline:** How to organize assets so you can actually find them later

## Screenshots

The current build includes basic combat, crafting menus, and environments that look intentional rather than accidental. Progress!

---

*Interested in following the development or have suggestions? [Drop me a line](/contact) - I promise to only moderately overthink your feedback.*

```

## Content Management Workflow

### Creating New Content

#### For Blog Posts

```bash
# Create a new blog post
npm run new:post

# Follow the prompts:
# Post title: Why My Test Suite Has Trust Issues
# Brief excerpt: A meditation on flaky tests and broken builds
# Tags: testing, debugging, murphy's-law
# Status: published

# This creates: content/blog/why-my-test-suite-has-trust-issues.md
# Edit the file and add your content
```

#### For Projects

```bash
# Create a new project
npm run new:project

# Follow the prompts:
# Project title: Magic Card Tracker
# Brief description: Collection management app for MTG cards
# Status: Active
# Tech stack: Java, Spring Boot, React
# Featured project: y
# GitHub URL: https://github.com/username/mtg-tracker

# This creates: content/projects/magic-card-tracker.md
# And: public/images/projects/magic-card-tracker/ (for screenshots)
```

### Image Management

#### Blog Images

```default
public/images/blog/post-slug/
├── screenshot-1.jpg
├── diagram.png
└── demo.gif
```

Reference in markdown:

```markdown
![Feature Demo](/images/blog/post-slug/demo.gif)
```

#### Project Images

```default
public/images/projects/project-slug/
├── main-screenshot.jpg
├── architecture-diagram.png
└── demo-video-thumbnail.jpg
```

Update front matter:

```yaml
images: ["main-screenshot.jpg", "architecture-diagram.png"]
```

### Development Workflow

#### Local Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
# Edit markdown files - changes appear immediately
# Add images to public/images/ directories
```

#### Content Preview

```bash
# Build static site locally
npm run build

# Serve built site
npm run start

# Test exactly what will be deployed
```

#### Deployment

```bash
# Commit changes to Git
git add .
git commit -m "Add new blog post about debugging"
git push origin main

# GitHub Actions automatically:
# 1. Builds the site
# 2. Deploys to Cloudflare Pages
# 3. Purges CDN cache
```

## Deployment Configuration

### GitHub Actions Workflow

**File: `.github/workflows/deploy.yml`**

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
```

### Environment Variables

**File: `.env.local`** (for development):

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ANALYTICS_ID=dev-analytics-id
```

**Production Environment Variables** (set in Cloudflare Pages):

```bash
NEXT_PUBLIC_SITE_URL=https://tkforgeworks.com
NEXT_PUBLIC_ANALYTICS_ID=production-analytics-id
```

## Troubleshooting

### Common Issues

#### Build Failures

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run type-check
```

#### Missing Images

```bash
# Ensure images are in correct directories
public/images/blog/post-slug/image.jpg
public/images/projects/project-slug/screenshot.png

# Check image references in markdown
![Alt text](/images/blog/post-slug/image.jpg)
```

#### Markdown Processing Issues

```bash
# Validate front matter YAML
# Use online YAML validator for complex front matter

# Check for unsupported markdown syntax
# Stick to standard CommonMark + GitHub Flavored Markdown
```

### Performance Optimization

#### Image Optimization

```bash
# Optimize images before adding to project
# Recommended: WebP format, under 500KB per image
# Use tools like squoosh.app or imagemin
```

#### Bundle Size

```bash
# Analyze bundle size
npm run build
# Check .next/static/ folder sizes

# Remove unused dependencies
npm uninstall unused-package
```

## Summary

This implementation provides:

- **Automated content processing** from markdown to optimized web pages
- **SEO optimization** with automatic metadata generation
- **Brand-consistent styling** across all content
- **Fast static site performance** with modern web standards
- **Easy content management** through simple markdown files
- **Scalable architecture** that grows with your content needs

The system handles the technical complexity while you focus on creating content. Write markdown, commit to Git, and get professional web pages automatically.

**Key Benefits:**

- No database required
- Lightning-fast loading times
- Excellent SEO performance
- Easy to maintain and update
- Cost-effective hosting (free tier sufficient)
- Developer-friendly workflow

**Getting Started:**

1. Clone/create the repository structure
2. Install dependencies with `npm install`
3. Create your first content with `npm run new:post`
4. Start development server with `npm run dev`
5. Deploy with `git push` (automatic via GitHub Actions)

Your content creation workflow becomes as simple as writing markdown and pushing to Git. The system handles everything else automatically.
