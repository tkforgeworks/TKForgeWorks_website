# TK ForgeWorks Complete Style Guide

## Overview

This style guide defines the complete visual identity for TK ForgeWorks, combining typography, color, and usage guidelines to maintain consistency across all touchpoints while supporting the brand's professional-but-approachable personality.

---

## Typography System

### Font Stack

- **Headers & Navigation:** Poppins
- **Body Text:** Source Serif 4  
- **Code:** JetBrains Mono

### Google Fonts Import

```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Source+Serif+4:wght@400;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### CSS Variables

```css
:root {
    --header-font: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
    --body-font: 'Source Serif 4', Georgia, serif;
    --code-font: 'JetBrains Mono', 'Monaco', 'Menlo', monospace;
}
```

### Typography Scale & Usage

#### Poppins (Headers & UI Elements)

| Element | Size | Weight | Usage | Color Context |
|---------|------|--------|-------|---------------|
| **Main Site Title** | 2.5rem (40px) | 700 (Bold) | Site logo/main heading | Primary Purple |
| **Page Headers** | 1.8rem (29px) | 600 (SemiBold) | Section titles, main page headings | Primary Purple |
| **Subheadings** | 1.3rem (21px) | 600 (SemiBold) | Article titles, subsections | Secondary Purple |
| **Project Titles** | 1.4rem (22px) | 600 (SemiBold) | Featured project names | Primary Purple |
| **Navigation Links** | 1rem (16px) | 500 (Medium) | Main nav, footer links | Text Primary |
| **Button Text** | 0.9-1rem (14-16px) | 500 (Medium) | CTAs, form buttons | Varies by context |
| **Tags/Status Labels** | 0.9rem (14px) | 500 (Medium) | Project status, categories | Semantic colors |
| **Site Tagline** | 1.1rem (18px) | 400 (Regular) | Subtitle under main title | Text Secondary |

#### Source Serif 4 (Body Text)

| Element | Size | Weight | Usage | Color Context |
|---------|------|--------|-------|---------------|
| **Main Body Text** | 1.125rem (18px) | 400 (Regular) | Primary reading content | Text Primary |
| **Large Body Text** | 1.25rem (20px) | 400 (Regular) | Intro paragraphs, emphasis | Text Primary |
| **Small Body Text** | 1rem (16px) | 400 (Regular) | Captions, secondary info | Text Secondary |
| **FAQ Answers** | 1.125rem (18px) | 400 (Regular) | FAQ content, explanations | Text Primary |
| **Emphasized Text** | 1.125rem (18px) | 600 (SemiBold) | Important callouts in body | Text Primary |

#### JetBrains Mono (Code)

| Element | Size | Weight | Usage | Color Context |
|---------|------|--------|-------|---------------|
| **Inline Code** | 0.9em (relative) | 500 (Medium) | Variables, functions in text | Primary Purple |
| **Code Blocks** | 0.9rem (14px) | 400 (Regular) | Multi-line code examples | Code block styling |
| **Terminal Output** | 0.85rem (13px) | 400 (Regular) | Command line examples | Code block styling |

---

## Color Usage Guidelines

### Brand Colors (Primary Use)

#### Primary Purple

- **Usage:** Main headers, project titles, primary CTAs, brand accents
- **Voice:** Professional creativity, technical competence
- **Examples:** Site title, section headers, featured project names

#### Secondary Purple  

- **Usage:** Subheadings, secondary navigation, subtle accents
- **Voice:** Supporting hierarchy, refined professionalism
- **Examples:** Article subtitles, category labels, hover states

#### Text Colors

- **Text Primary:** Main body content, navigation, readable text
- **Text Secondary:** Captions, descriptions, supporting information
- **Voice:** Clear communication, approachable professionalism

### Semantic Colors (Contextual Use)

#### Error Red

- **When to Use:** Build failures, authentication errors, critical bugs, system failures
- **Voice:** "Something broke and needs immediate attention"
- **Examples:** "Build Failed," "Authentication system decided to take a personal day"
- **Avoid:** General emphasis, non-error contexts

#### Success Green  

- **When to Use:** Successful deployments, completed features, finished projects, positive outcomes
- **Voice:** "Actually accomplished something"
- **Examples:** "Project Deployed," "Kitchen organizers are live," "MVP works"
- **Avoid:** Generic positive messaging, non-completion contexts

#### Warning Yellow

- **When to Use:** Scope creep alerts, timeline concerns, cautionary advice, "heads up" messages
- **Voice:** "This might be more complicated than expected"
- **Examples:** "Scope Creep Detected," timeline warnings, "seemed like a good idea at 3 AM"
- **Avoid:** General information, non-cautionary content

#### Info Blue

- **When to Use:** Documentation updates, technical information, neutral announcements, learning content
- **Voice:** "Here's something useful to know"
- **Examples:** "Documentation Update," tutorial announcements, technical blog posts
- **Avoid:** Urgent messaging, emotional content

### Color Application Examples

#### Project Status Tags

```css
.status-active { background: var(--success-light); color: var(--success-primary); }
.status-paused { background: var(--warning-light); color: var(--warning-primary); }
.status-broken { background: var(--error-light); color: var(--error-primary); }
.status-planning { background: var(--info-light); color: var(--info-primary); }
```

#### Alert Components

- **Error Alerts:** Failed builds, broken features, critical issues
- **Success Alerts:** Completed projects, successful deployments, "actually works"
- **Warning Alerts:** Timeline concerns, scope creep, "this might be ambitious"
- **Info Alerts:** Blog updates, documentation, technical explanations

#### Interactive Elements

- **Primary Buttons:** Purple (main actions, "View Project")
- **Secondary Buttons:** Gray/neutral (cancel, back)
- **Destructive Buttons:** Red (delete, remove)
- **Success Buttons:** Green (confirm, complete)

---

## Responsive Typography

### Mobile Adjustments (max-width: 768px)

- **Main Title:** Scale down to 2rem (32px)
- **Page Headers:** Scale down to 1.5rem (24px)  
- **Body Text:** Keep at 1.125rem for readability
- **Code Blocks:** Scale down to 0.8rem (13px)

### Large Screens (min-width: 1200px)

- **Main Title:** Can scale up to 3rem (48px)
- **Body Text:** Consider 1.25rem (20px) for better readability

---

## Implementation Examples

### Main Page Header

```css
h1 {
    font-family: var(--header-font);
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--purple-primary);
}

.tagline {
    font-family: var(--header-font);
    font-size: 1.1rem;
    font-weight: 400;
    color: var(--purple-secondary);
}
```

### Project Cards

```css
.project-title {
    font-family: var(--header-font);
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--purple-primary);
}

.project-status {
    font-family: var(--header-font);
    font-size: 0.9rem;
    font-weight: 500;
    padding: 0.4rem 1rem;
    border-radius: 20px;
    /* Color varies by status - see semantic color guidelines */
}
```

### Alert Components - CSS

```css
.alert {
    border-radius: 8px;
    padding: 1rem;
    border-left: 4px solid;
    /* Background and border colors from semantic palette */
}

.alert-title {
    font-family: var(--header-font);
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.alert-text {
    font-family: var(--body-font);
    font-size: 0.9rem;
    line-height: 1.5;
}
```

### Code Styling

```css
code {
    font-family: var(--code-font);
    font-size: 0.9em;
    font-weight: 500;
    background: var(--code-bg);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    color: var(--purple-primary);
}

pre {
    font-family: var(--code-font);
    font-size: 0.9rem;
    font-weight: 400;
    background: var(--code-block-bg);
    color: var(--code-block-text);
    padding: 1.5rem;
    border-radius: 8px;
    line-height: 1.5;
}
```

---

## Brand Voice & Color Psychology

### Purple Deep System

The purple palette reinforces the brand's core values:

- **Technical Competence:** Professional engineering background
- **Creative Problem-Solving:** "Let's see what happens if I try this"
- **Approachable Expertise:** Self-deprecating but capable
- **Quality Focus:** Attention to detail in both craft and communication

### Semantic Color Meanings

- **Red:** Honest about failures, transparent problem-solving
- **Green:** Celebrates actual accomplishments, realistic about success
- **Yellow:** Acknowledges complexity, manages expectations
- **Blue:** Values documentation, shares knowledge generously

---

## Accessibility Guidelines

### Contrast Requirements

- All text meets WCAG AA contrast ratios (4.5:1 minimum)
- Interactive elements have clear focus states
- Color is never the only way to convey information

### Font Loading

```css
/* Ensure graceful fallbacks */
font-display: swap;
```

### Fallback Strategy

- **Poppins fallback:** `-apple-system, BlinkMacSystemFont, sans-serif`
- **Source Serif 4 fallback:** `Georgia, serif`  
- **JetBrains Mono fallback:** `'Monaco', 'Menlo', monospace`

---

## Complete Color Palette

### Light Mode Colors

#### Brand Colors - light

| Color | Hex | Usage |
|-------|-----|-------|
| **Purple Primary** | #6b46c1 | Headers, main accents, brand identity |
| **Purple Secondary** | #7c3aed | Interactive elements, taglines |
| **Purple Dark** | #553c9a | Secondary headers, subtle emphasis |
| **Text Primary** | #334155 | Body text, readable content |
| **Text Secondary** | #64748b | Subtitles, captions, supporting info |
| **Background Light** | #f8fafc | Cards, subtle backgrounds |
| **Purple Tint** | #ede9fe | Tags, highlights, purple backgrounds |

#### Semantic Colors - light

| Color | Primary | Light | Background | Text | Usage |
|-------|---------|-------|------------|------|-------|
| **Error Red** | #dc2626 | #f87171 | #fef2f2 | #991b1b | Build failures, critical bugs |
| **Success Green** | #16a34a | #4ade80 | #f0fdf4 | #166534 | Completions, successful deployments |
| **Warning Yellow** | #d97706 | #fbbf24 | #fffbeb | #92400e | Scope creep, timeline warnings |
| **Info Blue** | #0284c7 | #38bdf8 | #f0f9ff | #0c4a6e | Documentation, technical updates |

### Dark Mode Colors

#### Brand Colors - dark

| Color | Hex | Usage |
|-------|-----|-------|
| **Purple Primary** | #a855f7 | Headers, main accents, brand identity |
| **Purple Light** | #c4b5fd | Interactive elements, highlights |
| **Purple Medium** | #8b5cf6 | Secondary headers |
| **Text Primary** | #e2e8f0 | Body text, readable content |
| **Text Secondary** | #cbd5e1 | Subtitles, captions |
| **Background Medium** | #334155 | Cards, elevated surfaces |
| **Purple Dark** | #312e81 | Tags, purple backgrounds |

#### Semantic Colors - dark

| Color | Primary | Light | Background | Text | Usage |
|-------|---------|-------|------------|------|-------|
| **Error Red** | #f87171 | #fca5a5 | #450a0a | #fca5a5 | Build failures, critical bugs |
| **Success Green** | #4ade80 | #86efac | #052e16 | #86efac | Completions, successful deployments |
| **Warning Yellow** | #fbbf24 | #fcd34d | #451a03 | #fcd34d | Scope creep, timeline warnings |
| **Info Blue** | #38bdf8 | #7dd3fc | #082f49 | #7dd3fc | Documentation, technical updates |

This complete color system provides the foundation for consistent, accessible, and brand-aligned design across all TK ForgeWorks touchpoints.
