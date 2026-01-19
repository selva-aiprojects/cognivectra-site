# CogniVectra Website - Design Document

**Version:** 1.0  
**Last Updated:** January 18, 2026  
**Status:** Production

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Component Structure](#component-structure)
5. [Page Structure](#page-structure)
6. [Data Model](#data-model)
7. [User Flows](#user-flows)
8. [Styling & Design](#styling--design)
9. [Database Schema](#database-schema)
10. [Deployment & DevOps](#deployment--devops)
11. [Security Considerations](#security-considerations)
12. [Performance Metrics](#performance-metrics)

---

## 1. Project Overview

### Purpose
CogniVectra is a B2B SaaS marketing website for an enterprise automation and cloud infrastructure consulting firm targeting early-stage and scaling startups.

### Key Value Propositions
- **Enterprise-grade reliability from Day 1** — Cloud, DevOps, and automation infrastructure
- **Launch faster** — Pre-built SaaS modules and rapid deployment
- **Reduce operational burn** — Automated operations and optimized cloud costs

### Target Audience
- Startup founders and CTOs
- Technical leads at Series A–C stage companies
- Engineering teams scaling rapidly

### Business Goals
- Lead generation through strategic content and CTA
- Showcase expertise via blog content and case studies
- Build thought leadership in startup infrastructure automation
- Facilitate sales conversations through engagement tracking

---

## 2. Architecture

### High-Level Application Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   User Browser                          │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/HTTPS
                     ▼
┌─────────────────────────────────────────────────────────┐
│        React + Vite (SPA - Single Page App)            │
│  ┌──────────────────────────────────────────────────┐  │
│  │ React Router (Client-side Routing)               │  │
│  │ Components + Pages                               │  │
│  │ State Management (React Hooks)                   │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────┬──────────────────────────┬─────────────┘
                 │                          │
                 ▼                          ▼
    ┌──────────────────────┐    ┌──────────────────────┐
    │  Supabase Auth       │    │  Supabase DB + API   │
    │  (JWT Sessions)      │    │  (PostgreSQL)        │
    └──────────────────────┘    └──────────────────────┘
                                         │
                                         ▼
                                ┌──────────────────────┐
                                │  OpenAI API          │
                                │  (Content Generation)│
                                └──────────────────────┘
```

### Design Principles
- **Single Page Application (SPA)** — All navigation happens client-side with React Router
- **Server-Side Rendering:** Not used; SSR not required for this use case
- **API-First:** All data operations go through Supabase REST API
- **Authentication:** Supabase Auth handles user sessions and JWT
- **Content Generation:** AI-powered blog posts via OpenAI API

---

## 3. Technology Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | ^19.2.0 | UI framework |
| Vite | ^6.0.0 | Build tool & dev server |
| React Router DOM | ^7.12.0 | Client-side routing |
| ESLint | ^9.39.1 | Code linting & quality |
| CSS (Custom) | Native | Styling (no CSS framework) |

### Backend & Services
| Service | Purpose |
|---------|---------|
| Supabase | PostgreSQL database + Auth + REST API |
| OpenAI API | AI-powered content generation |

### Development Tools
| Tool | Purpose |
|------|---------|
| Node.js | JavaScript runtime |
| npm | Package manager |
| Vite | Development server with HMR (Hot Module Replacement) |

### Deployment
- **Frontend Hosting:** (To be configured — typically Vercel, Netlify, or GitHub Pages)
- **Database:** Supabase (hosted PostgreSQL)
- **Environment Variables:** `.env.local` for local development

---

## 4. Component Structure

### Global Components

#### **Navbar** (`src/components/Navbar.jsx`)
- **Purpose:** Main navigation header with responsive design
- **Features:**
  - Logo and brand text
  - Desktop navigation links with active state
  - Mobile hamburger menu with collapsible drawer
  - Scroll-triggered styling changes
  - Accessibility labels (`aria-label`)
- **Props:** None (state-managed internally)
- **State:**
  - `scrolled` (boolean) — Tracks scroll position for styling
  - `mobileMenuOpen` (boolean) — Controls mobile menu visibility
- **Navigation Links:** Home, Services, Engagements, Results, Industries, Who We Are, Mission, Blog, Contact, Login, Admin

#### **Footer** (Inline in `src/App.jsx`)
- **Purpose:** Site footer with contact, links, and branding
- **Sections:**
  - Brand & description
  - Contact information (email & phone)
  - Quick navigation links
  - Copyright notice
- **Data:** Contact email and phone hardcoded in component

### Page Components

See **Section 5: Page Structure** for detailed breakdown.

---

## 5. Page Structure

### Route Map
All routes are defined in `src/App.jsx` and managed by React Router.

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `Home.jsx` | Landing page with hero, value props, CTA |
| `/mission` | `Mission.jsx` | Company mission statement |
| `/who-we-are` | `WhoWeAre.jsx` | Team introductions and company culture |
| `/about` | `About.jsx` | Company history and background |
| `/services` | `Services.jsx` | Service offerings and engagement types |
| `/engagements` | `Engagements.jsx` | Detailed engagement models (pricing, duration, deliverables) |
| `/results` | `Results.jsx` | Case studies and success metrics |
| `/industries` | `Industries.jsx` | Industry-specific solutions |
| `/blog` | `Blog.jsx` | Blog listing page with post previews |
| `/blog/:slug` | `BlogPost.jsx` | Individual blog post page (dynamic routing) |
| `/contact` | `Contact.jsx` | Contact form for inquiries |
| `/admin` | `Admin.jsx` | Admin dashboard (authenticated) |
| `/login` | `Login.jsx` | Login page for admin access |

### Key Pages

#### **Home** (`src/pages/Home.jsx`)
- **Layout:** Hero section with two-column grid (text + image)
- **Sections:**
  1. **Hero Section** — Main value proposition with benefits list
  2. **CTA Buttons** — "Book a Free Strategy Call" linking to contact
  3. **Trust Elements** — Client logos or testimonials (structure present)
- **Navigation:** Links to Services, Engagements, Contact

#### **Blog** (`src/pages/Blog.jsx`)
- **Data Source:** `src/data/posts.js`
- **Features:**
  - Grid or list layout of blog posts
  - Post previews with title, date, excerpt
  - Links to individual post pages (`/blog/:slug`)
  - Search or filtering (if implemented)

#### **BlogPost** (`src/pages/BlogPost.jsx`)
- **Dynamic Routing:** Uses `:slug` parameter to fetch correct post
- **Features:**
  - Full post content with title, date, body
  - Sidebar with related posts (optional)
  - Back link to blog listing
  - Social sharing buttons (optional)

#### **Admin Dashboard** (`src/pages/Admin.jsx`)
- **Authentication:** Protected route (redirects to `/login` if no session)
- **Features:**
  - List all posts (fetched from Supabase)
  - **Draft Management:**
    - View draft and published posts
    - Edit post title, excerpt, and body
    - Publish drafts (updates `status` and `published_at`)
  - **Sign Out:** Clears session and redirects to login
- **Form:**
  - Title input field
  - Excerpt textarea
  - Body/content textarea
  - Save and publish buttons

#### **Login** (`src/pages/Login.jsx`)
- **Purpose:** Authenticate admin users
- **Provider:** Supabase Auth (email/password or magic link)
- **Redirect:** On successful login, routes to `/admin`
- **Features:** Session persistence via JWT stored in browser

---

## 6. Data Model

### Blog Posts

**Source Files:**
- `src/data/posts.js` — Static/default posts (client-side)
- Supabase `posts` table — Dynamic posts (server-side, authenticated)

**Post Schema:**
```javascript
{
  id: "uuid",                    // Supabase auto-generated
  title: "string",               // Post headline
  slug: "string",                // URL-friendly identifier (unique)
  excerpt: "string",             // Short summary (meta description)
  body: "string",                // Full post content (markdown or HTML)
  status: "draft" | "published", // Publication status
  author_id: "uuid",             // FK to auth users
  created_at: "timestamp",       // ISO 8601 datetime
  updated_at: "timestamp",       // Last modified
  published_at: "timestamp" | null, // When post went live
  image_url: "string | null",    // Featured image (optional)
  tags: "string[]" | null        // Post categories/topics
}
```

**Example Post (from `posts.js`):**
```javascript
{
  slug: "welcome-to-cognivectra",
  title: "Welcome to CogniVectra: Automation Foundations for Startups",
  date: "2026-01-01",
  excerpt: "How we help startups build cloud, automation, and SaaS foundations that scale with them.",
  body: "CogniVectra partners with..."
}
```

### User Accounts

**Source:** Supabase Auth

**User Schema:**
```javascript
{
  id: "uuid",                // Auth user ID
  email: "string",           // Email address (unique)
  password_hash: "string",   // Encrypted password (handled by Supabase)
  last_sign_in_at: "timestamp",
  created_at: "timestamp",
  updated_at: "timestamp"
}
```

### Contact Submissions (Planned)

**Purpose:** Capture leads from contact form

**Schema (suggested):**
```javascript
{
  id: "uuid",
  name: "string",
  email: "string",
  phone: "string | null",
  company: "string | null",
  message: "string",
  created_at: "timestamp",
  read: boolean
}
```

---

## 7. User Flows

### 1. **Visitor Landing on Site**
```
Browser → Home Page
  ├─ Navbar (main navigation visible)
  ├─ Hero Section (value proposition)
  ├─ CTA buttons ("Book a Strategy Call")
  └─ Footer (company info)
```

### 2. **Exploring Services**
```
Home → Services Page
  ├─ Browse service descriptions
  ├─ View engagement models
  └─ Contact for quote (CTA)
```

### 3. **Reading Blog Content**
```
Blog Page → Blog Post Page
  ├─ Browse post previews
  ├─ Click "Read More" → Blog Post
  ├─ Read full article
  └─ Related posts / back to blog
```

### 4. **Admin Publishing Content**
```
Login Page → Admin Dashboard
  ├─ Enter email/password
  ├─ Supabase Auth validates session
  ├─ Admin Dashboard loads
  ├─ View drafts & published posts
  ├─ Edit post (if needed)
  ├─ Publish draft (status → published)
  └─ Sign out
```

### 5. **AI Content Generation**
```
Terminal/Script → AI Agent (`scripts/ai_content_agent.js`)
  ├─ OpenAI API generates post
  ├─ Insert into Supabase (status: draft)
  ├─ Admin reviews in dashboard
  └─ Admin publishes if approved
```

---

## 8. Styling & Design

### Design System

#### **Color Palette**
- **Primary Background:** Light neutral (#f8fafc or #ffffff)
- **Text:** Dark gray (#1e293b, #334155, #475569)
- **Accents:** Likely blue or tech-oriented color (specific hex TBD)
- **Borders:** Light gray (#e2e8f0, #cbd5e1)
- **Success:** Green tones
- **Error:** Red tones

#### **Typography**
- **Font Stack:** System fonts (likely `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`)
- **Headings:** Bold, larger scale (h1 > h2 > h3, etc.)
- **Body:** Regular weight, readable line-height (1.5–1.6)
- **Code/Monospace:** For technical content (if needed)

#### **Spacing & Layout**
- **Base Unit:** 8px or 1rem increments
- **Container Max-Width:** 1200px (from hero section)
- **Padding:** Responsive (2.5rem desktop, smaller on mobile)
- **Gap:** Consistent grid gaps (2–3rem)

#### **Components**
- **Cards:** `.card` class with padding, border, subtle shadow
- **Buttons:** `.btn` class with primary styling, hover states
- **Sections:** `.section` class with vertical padding
- **Ambient Effects:** `.ambient-glow` div for background visual interest

### CSS Architecture
- **File:** `src/index.css` — Global styles
- **Approach:** Utility-like custom CSS (no Tailwind, no CSS-in-JS libraries)
- **Responsive Design:** Media queries for mobile, tablet, desktop
- **Dark Mode:** Not implemented (light theme only)

### Responsive Breakpoints
```css
/* Mobile first approach */
320px–480px   /* Mobile phones */
481px–768px   /* Tablets */
769px–1200px  /* Desktops */
1201px+       /* Large monitors */
```

---

## 9. Database Schema

### Supabase Tables

#### **Posts Table**
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  body TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author_id UUID REFERENCES auth.users(id),
  image_url VARCHAR(500),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  view_count INTEGER DEFAULT 0
);

CREATE INDEX posts_status ON posts(status);
CREATE INDEX posts_published_at ON posts(published_at DESC);
```

#### **Contacts Table** (Suggested)
```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  company VARCHAR(255),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read BOOLEAN DEFAULT FALSE
);

CREATE INDEX contacts_created_at ON contacts(created_at DESC);
```

#### **Auth Users Table** (Supabase managed)
- Automatically created and managed by Supabase Auth
- Stores email, encrypted password, and JWT tokens

---

## 10. Deployment & DevOps

### Development Environment
```bash
npm install        # Install dependencies
npm run dev        # Start dev server (Vite HMR enabled)
npm run lint       # Run ESLint
npm run build      # Build for production
npm run preview    # Preview production build locally
```

### Build Pipeline
1. **Source:** GitHub repository
2. **Node Version:** ^18.0.0 (or per `.nvmrc`)
3. **Build Command:** `npm run build`
4. **Output:** `dist/` directory
5. **Deployment:** (Configure based on hosting platform)

### Environment Variables
**Local (`d:\Training\working\cognivectra-site\.env.local`):**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=your-openai-key
```

**Production (Deployment Platform):**
- Set same env vars in hosting platform (Vercel, Netlify, etc.)
- Use `.env.production` if needed

### Hosting Options
- **Recommended:** Vercel (optimized for Vite + React)
- **Alternative:** Netlify
- **Backend:** Supabase (managed PostgreSQL + Auth)
- **CDN:** Integrated with host (global edge caching)

---

## 11. Security Considerations

### Authentication
- **Method:** Supabase Auth (JWT-based)
- **Session Storage:** Browser localStorage (JWT token)
- **Admin Routes:** Protected with `checkUser()` redirect to login if no session

### Data Protection
- **HTTPS:** Enforced for all connections
- **API Keys:** Store in environment variables, never in code
  - `VITE_SUPABASE_ANON_KEY` — Safely exposed (scoped to specific tables)
  - `VITE_SUPABASE_URL` — Safe to expose
  - `OPENAI_API_KEY` — Secrets file only (not exposed to browser)
- **CORS:** Supabase handles CORS for API calls

### Database Security
- **Row-Level Security (RLS):** Implement on `posts` table:
  - Authenticated users can publish/edit their own posts
  - Public can read published posts only
- **Input Validation:** Sanitize user inputs before database insertion
- **SQL Injection:** Supabase JS client uses parameterized queries (safe by default)

### XSS Prevention
- **React:** Automatically escapes JSX content
- **User-Generated Content:** Sanitize if displaying raw HTML (e.g., from blog body)
- **Recommendation:** Use a library like `DOMPurify` for rich text content

### Rate Limiting
- **Supabase Auth:** Built-in rate limits on login attempts
- **API Calls:** Consider implementing rate limits on contact submissions

---

## 12. Performance Metrics

### Web Vitals Targets
| Metric | Target | Status |
|--------|--------|--------|
| **LCP** (Largest Contentful Paint) | < 2.5s | ⏳ TBD |
| **FID** (First Input Delay) | < 100ms | ⏳ TBD |
| **CLS** (Cumulative Layout Shift) | < 0.1 | ⏳ TBD |
| **FCP** (First Contentful Paint) | < 1.8s | ⏳ TBD |

### Optimization Strategies
1. **Code Splitting:**
   - React Router lazy load pages (consider `React.lazy()`)
   - Separate bundles per route

2. **Asset Optimization:**
   - Optimize images (WebP, responsive sizes)
   - Lazy load images below fold
   - Minify CSS/JS (Vite handles by default)

3. **Caching:**
   - Service Worker (optional PWA features)
   - Browser caching headers
   - CDN edge caching

4. **Bundle Size:**
   - Current dependencies: React (39KB gzip), React Router, Supabase client
   - Monitor with `npm run build` output

5. **Database:**
   - Index frequently queried columns (`status`, `published_at`, `slug`)
   - Pagination for blog post listings

---

## 13. Feature Roadmap

### Phase 1 (Current)
- ✅ Marketing website with core pages
- ✅ Blog platform with AI-generated content
- ✅ Admin dashboard for content management
- ✅ Contact form (implement in Contact page)

### Phase 2 (Planned)
- [ ] Email newsletter signup
- [ ] Comment system on blog posts
- [ ] Search functionality (Supabase full-text search)
- [ ] Social media integrations
- [ ] Analytics (Google Analytics, Mixpanel)
- [ ] Dark mode
- [ ] Multi-language support

### Phase 3 (Long-term)
- [ ] Member portal / resources
- [ ] Webinar registration
- [ ] Case study download tracking
- [ ] Email nurture workflows
- [ ] CRM integration (HubSpot, Pipedrive)

---

## 14. Known Issues & Technical Debt

1. **README.md:** Generic Vite template; should be updated with project-specific info
2. **Contact Page:** Form functionality not yet implemented
3. **Static Posts:** `posts.js` is hardcoded; should pull from Supabase
4. **Styling:** No CSS preprocessor (SCSS/LESS); inline styles used in places
5. **Accessibility:** Add ARIA labels and test with screen readers
6. **Tests:** No unit or integration tests yet (consider Jest + React Testing Library)

---

## 15. Appendix: Quick Reference

### File Structure
```
cognivectra-site/
├── public/                    # Static assets
├── scripts/
│   └── ai_content_agent.js    # AI content generation script
├── src/
│   ├── App.jsx                # Main app routing
│   ├── App.css                # App-level styles
│   ├── index.css              # Global styles
│   ├── main.jsx               # React entry point
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx (in App.jsx)
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Blog.jsx
│   │   ├── BlogPost.jsx
│   │   ├── Admin.jsx
│   │   ├── Login.jsx
│   │   ├── Services.jsx
│   │   ├── Engagements.jsx
│   │   ├── Results.jsx
│   │   ├── Industries.jsx
│   │   ├── Contact.jsx
│   │   ├── About.jsx
│   │   ├── Mission.jsx
│   │   └── WhoWeAre.jsx
│   ├── data/
│   │   ├── posts.js
│   │   └── BlogPosts.js
│   ├── lib/
│   │   └── supabase.js
│   └── assets/
│       ├── diagrams/
│       ├── icons/
│       └── illustrations/
├── package.json
├── vite.config.js
├── eslint.config.js
└── index.html
```

### Key Dependencies
- `react@^19.2.0`
- `react-router-dom@^7.12.0`
- `@supabase/supabase-js@^2.90.1`
- `openai@^6.16.0`

### Useful Commands
```bash
npm run dev             # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Lint code
npm run generate-post   # Run AI content agent
```

---

**Document End**

For questions or updates, contact the development team or review commit history in the repository.
