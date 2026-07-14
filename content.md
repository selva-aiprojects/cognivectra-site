# CogniVectra Project Context

This file is a working handoff for future updates. It captures the current architecture, deployment model, critical workflows, and project-specific business rules so later edits do not accidentally break fundamentals.

## 1. What This Repo Is

CogniVectra is a React + Vite marketing site plus an internal business/admin platform backed by Supabase.

It includes:
- Public marketing pages
- Product detail pages
- Lead capture flows
- AI search / sales-assistant behavior
- Admin modules for CRM, projects, jobs, blog, offers, reports
- Supabase Edge Functions
- Optional Python AI microservices under `services/`

Core app shell files:
- [src/main.jsx](d:/Training/working/cognivectra-site/src/main.jsx)
- [src/App.jsx](d:/Training/working/cognivectra-site/src/App.jsx)
- [src/lib/supabase.js](d:/Training/working/cognivectra-site/src/lib/supabase.js)

## 2. Deployment Model

Current intended stack:
- Frontend site: Vercel
- Backend/data/auth/storage/functions: Supabase
- Some product demo/live instances: Render and Vercel
- Optional AI routing microservices: deployable on Render / Railway / Fly / Docker

Evidence in repo:
- Vercel config: [vercel.json](d:/Training/working/cognivectra-site/vercel.json)
- Vercel analytics/speed insights: [package.json](d:/Training/working/cognivectra-site/package.json), [src/main.jsx](d:/Training/working/cognivectra-site/src/main.jsx), [src/App.jsx](d:/Training/working/cognivectra-site/src/App.jsx)
- Supabase client and auth: [src/lib/supabase.js](d:/Training/working/cognivectra-site/src/lib/supabase.js)
- AI service deployment guide: [services/DEPLOYMENT.md](d:/Training/working/cognivectra-site/services/DEPLOYMENT.md)

Important nuance:
- The site itself is Vercel-oriented.
- Not everything is “hosted on Render.”
- Many business workflows go through Supabase, not Render.

## 3. Runtime Architecture

Frontend:
- React 18
- Vite
- React Router
- Framer Motion
- Vanilla CSS / custom CSS

Platform services:
- Supabase Postgres
- Supabase Auth
- Supabase Storage
- Supabase Edge Functions
- RPC-based analytics event tracking

Optional AI routing layer:
- Intent Router: FastAPI service in [services/intent-router](d:/Training/working/cognivectra-site/services/intent-router)
- LangGraph Orchestrator: FastAPI service in [services/langgraph-orchestrator](d:/Training/working/cognivectra-site/services/langgraph-orchestrator)

AI request path when advanced routing is enabled:
1. User opens Neural Search in the frontend
2. Frontend invokes Supabase Edge Function `ai-search`
3. Edge Function decides whether advanced routing is enabled
4. If enabled, it calls Intent Router
5. Intent Router classifies the query
6. Orchestrator produces the answer
7. Result is returned to the frontend

Fallback path:
1. Neural Search calls `ai-search`
2. If function fails or advanced flow is unavailable, the frontend has a local keyword-based fallback answer set in [src/components/NeuralSearch.jsx](d:/Training/working/cognivectra-site/src/components/NeuralSearch.jsx)

## 4. Main Route Structure

Public routes are defined in [src/App.jsx](d:/Training/working/cognivectra-site/src/App.jsx).

Primary public pages:
- `/`
- `/mission`
- `/who-we-are`
- `/about`
- `/services`
- `/engagements`
- `/results`
- `/industries`
- `/blog`
- `/blog/:slug`
- `/contact`
- `/careers`
- `/products`
- `/products/stocksteward`
- `/products/storeai`
- `/products/medflow`
- `/products/healthezee`
- `/products/eduportal`
- `/leadership`

Admin/auth routes:
- `/login`
- `/reset-password`
- `/admin`
- `/admin/reports`
- `/admin/jobs`
- `/admin/compensation`
- `/admin/offers`
- `/admin/blog`
- `/admin/clients`
- `/admin/projects`
- `/admin/omni`

## 5. Tenant Model and Branding

Tenant logic lives in [src/context/TenantContext.jsx](d:/Training/working/cognivectra-site/src/context/TenantContext.jsx).

Important behavior:
- Tenant is inferred from subdomain.
- `localhost`, `127.*`, `cognivectra`, `www`, or single-part hostnames map to `admin`.
- Tenant config is fetched from Supabase `tenants`.
- If not found, it falls back to a global tenant ID: `00000000-0000-0000-0000-000000000000`
- If database access fails, a hardcoded failsafe tenant is used.

Do not accidentally remove:
- subdomain-to-`admin` alias behavior
- fallback tenant behavior
- branding CSS variable application
- module enablement checks

Admin module gating depends on `enabled_modules` from tenant config.

## 6. Auth and Session Fundamentals

Supabase auth client is initialized in [src/lib/supabase.js](d:/Training/working/cognivectra-site/src/lib/supabase.js).

Important auth settings:
- `flowType: 'pkce'`
- `autoRefreshToken: true`
- `detectSessionInUrl: false`
- `persistSession: true`

Why `detectSessionInUrl: false` matters:
- It prevents unintended auto-consumption of recovery tokens.
- Password recovery is manually intercepted in [src/App.jsx](d:/Training/working/cognivectra-site/src/App.jsx).

Password recovery logic:
- App listens to `supabase.auth.onAuthStateChange`
- If event is `PASSWORD_RECOVERY`, it navigates to `/reset-password`
- It also checks URL hash for recovery tokens and redirects manually

Do not simplify this flow unless the full reset flow is retested.

## 7. Admin Protection and Module Rules

Admin shell: [src/layouts/AdminLayout.jsx](d:/Training/working/cognivectra-site/src/layouts/AdminLayout.jsx)

Admin access rules:
- User must have a valid Supabase session
- Otherwise redirect to `/login`
- Module pages are tenant-gated:
  - CRM controls `/admin/clients` and `/admin/projects`
  - TALENT controls `/admin/jobs`, `/admin/compensation`, `/admin/offers`
  - BLOG controls `/admin/blog`, `/admin/omni`
  - AI_SEARCH controls `/admin/reports`

Future edits must preserve:
- auth gate before admin rendering
- tenant/module-based route protection
- logout via `supabase.auth.signOut()`

## 8. Lead Capture Workflows

This app has multiple lead-entry paths. They do not all behave the same way.

### 8.1 Contact Form

File:
- [src/pages/Contact.jsx](d:/Training/working/cognivectra-site/src/pages/Contact.jsx)

Flow:
1. Validate name, email, message
2. Upsert lead into `chat_conversations`
3. Optionally send notification through Web3Forms if `VITE_WEB3FORMS_ACCESS_KEY` exists
4. Track conversion via `trackEvent('lead_generated', ...)`
5. Invoke Supabase Edge Function `send-notification-email` for acknowledgement

Important:
- Supabase persistence happens even if email dispatch fails
- UI shows a “logged/cached” style success/fallback message

### 8.2 Demo Request Modal

File:
- [src/components/DemoRequestModal.jsx](d:/Training/working/cognivectra-site/src/components/DemoRequestModal.jsx)

Flow:
1. Submit to a Google Form endpoint
2. Fire `send-notification-email` Edge Function
3. Track conversion as `lead_generated`
4. Close modal after success timeout

Important:
- This flow uses Google Forms plus Supabase Edge Function email
- It is not the same as the contact form
- Keep platform labels in sync with product naming

### 8.3 Product Quick Demo / Product CTA Flows

Multiple product pages contain quick demo forms and external product links.

Relevant files:
- [src/pages/Products.jsx](d:/Training/working/cognivectra-site/src/pages/Products.jsx)
- [src/pages/StockStewardDetail.jsx](d:/Training/working/cognivectra-site/src/pages/StockStewardDetail.jsx)
- [src/pages/StoreAIDetail.jsx](d:/Training/working/cognivectra-site/src/pages/StoreAIDetail.jsx)
- [src/pages/MedFlowDetail.jsx](d:/Training/working/cognivectra-site/src/pages/MedFlowDetail.jsx)
- [src/pages/HealthezeeDetail.jsx](d:/Training/working/cognivectra-site/src/pages/HealthezeeDetail.jsx)
- [src/pages/EduPortalDetail.jsx](d:/Training/working/cognivectra-site/src/pages/EduPortalDetail.jsx)

When updating these pages:
- keep product names, links, CTA labels, and event tracking aligned
- do not update visible links without checking matching detail pages and home-page references

## 9. Analytics and Tracking

Analytics helper:
- [src/lib/analytics.js](d:/Training/working/cognivectra-site/src/lib/analytics.js)

Tracking model:
- `trackPageView(path, metadata)`
- `trackEvent(name, data, category)`

Implementation detail:
- Uses Supabase RPC `track_event`
- Generates/stores a per-session client ID in `sessionStorage`

Important convention:
- New lead-gen surfaces should emit `trackEvent('lead_generated', ...)`
- CTA and tab interactions should use `trackEvent(...)`

Do not replace this casually with ad hoc console logging or third-party-only tracking.

## 10. AI Search Workflow

Frontend component:
- [src/components/NeuralSearch.jsx](d:/Training/working/cognivectra-site/src/components/NeuralSearch.jsx)

Behavior:
- Modal UI
- Search history in local component state
- Invokes Supabase Edge Function `ai-search`
- Tracks queries via analytics
- Has a local fallback knowledge map if the function call fails

Important maintenance rule:
- If product/customer facts change, update both:
  - site/product pages
  - fallback `siteContext` copy in `NeuralSearch.jsx`

Otherwise the UI and AI fallback answers diverge.

## 11. Supabase Edge Functions in Use

Observed function usage in frontend:
- `ai-search`
- `send-notification-email`
- `send-application-email`
- `publish-social`
- `generate-offer-document`
- `send-auth-email`

Edge functions directory:
- [supabase/functions](d:/Training/working/cognivectra-site/supabase/functions)

These functions are operationally important. Frontend changes often rely on them silently.

## 12. Data / Business Tables Mentioned in Code

Important tables and entities referenced by the app:
- `tenants`
- `chat_conversations`
- `clients`
- `projects`
- `posts`
- `social_media_posts`
- `offer_letters`
- `ai_query_logs`
- `ai_feature_flags`

Relevant architectural references:
- [docs/technical/ARCHITECTURE_SYSTEM_DESIGN.md](d:/Training/working/cognivectra-site/docs/technical/ARCHITECTURE_SYSTEM_DESIGN.md)
- [docs/technical/DEVELOPER_GUIDE.md](d:/Training/working/cognivectra-site/docs/technical/DEVELOPER_GUIDE.md)

## 13. Environment Variables and Secrets

Do not store secret values in docs or commits.

Observed env/dependency expectations from code and docs:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_WEB3FORMS_ACCESS_KEY`
- `VITE_ENABLE_LORA_ROUTING`
- `VITE_SHOW_INTENT_DEBUG`
- `OPENAI_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `MASTER_KEY`
- `INTENT_ROUTER_URL`
- `ORCHESTRATOR_URL`

LinkedIn/social publishing also expects additional credentials referenced in:
- [.env.template](d:/Training/working/cognivectra-site/.env.template)

Important:
- Vercel project settings should contain frontend-required `VITE_*` vars
- Supabase secrets / Edge Function secrets contain backend secrets
- Python services use their own platform secret manager configuration

## 14. AI Microservices Fundamentals

Deployment guide:
- [services/DEPLOYMENT.md](d:/Training/working/cognivectra-site/services/DEPLOYMENT.md)

Intent Router:
- [services/intent-router/main.py](d:/Training/working/cognivectra-site/services/intent-router/main.py)
- FastAPI service
- Endpoint: `POST /intent-classify`
- Health: `GET /health`
- Requires `tenant_id`
- Pre-warms on startup
- Metrics via `prometheus_fastapi_instrumentator`

LangGraph Orchestrator:
- [services/langgraph-orchestrator/main.py](d:/Training/working/cognivectra-site/services/langgraph-orchestrator/main.py)
- FastAPI service
- Endpoint: `POST /orchestrate`
- Health: `GET /health`
- Pre-compiles graph on startup
- Returns answer, agent used, sources, intent, confidence, latency

Key rollout rule:
- Advanced routing is feature-flagged
- Existing behavior should continue working when routing is disabled

## 15. Product Inventory and Current Live Links

Current product set:
- StockSteward
- StoreAI
- Healthezee (formerly MedFlow EMR)
- Hospitality Management (eHMS)
- EduPortal

Current externally linked URLs found in app pages:
- StockSteward: `https://steward-platform.onrender.com/`
- StoreAI: `https://store-ai-prd.onrender.com/`
- Healthezee product: `https://healthezee.com/`
- Healthezee partner/client delivery site: `https://www.whitekraaft.com/`
- Hospitality Management (eHMS): `https://ehms-app-eta.vercel.app/`
- EduPortal: `https://cogni-lms.vercel.app/`
- drstpushpa reference site: `https://drstpushpa.com/`

Relevant files:
- [src/pages/Products.jsx](d:/Training/working/cognivectra-site/src/pages/Products.jsx)
- [src/pages/MedFlowDetail.jsx](d:/Training/working/cognivectra-site/src/pages/MedFlowDetail.jsx)
- [src/pages/HealthezeeDetail.jsx](d:/Training/working/cognivectra-site/src/pages/HealthezeeDetail.jsx)
- [src/pages/Home.jsx](d:/Training/working/cognivectra-site/src/pages/Home.jsx)

### Healthezee-specific current business context

This was recently updated and should be preserved unless intentionally changed:
- Healthezee product link points to `https://healthezee.com/`
- Healthezee partner/client implementation links point to `https://www.whitekraaft.com/`
- Hospitality Management (eHMS) link points to `https://ehms-app-eta.vercel.app/`
- Home page healthcare customer list includes:
  - `Kidz Clinic`
  - `drstpushpa.com`
  - `Whitekraft`
- Neural Search fallback customer copy also references those names

If Healthezee/healthcare links change again, update all of:
- [src/pages/Products.jsx](d:/Training/working/cognivectra-site/src/pages/Products.jsx)
- [src/pages/HealthezeeDetail.jsx](d:/Training/working/cognivectra-site/src/pages/HealthezeeDetail.jsx)
- [src/pages/Home.jsx](d:/Training/working/cognivectra-site/src/pages/Home.jsx)
- [src/components/NeuralSearch.jsx](d:/Training/working/cognivectra-site/src/components/NeuralSearch.jsx)

## 16. Content and Conversion Conventions

Observed project conventions:
- “Book Strategy Call” is usually the primary CTA
- Premium / glass-panel visual styling is used heavily on forms and conversion sections
- Product pages often include:
  - a product value statement
  - “Best for” framing
  - live/demo/portal links
  - quick demo form

Do not make isolated content edits without checking:
- home page preview cards
- product detail page
- global product listing page
- AI fallback copy
- analytics event names

## 17. Known Risks / Easy Things to Break

High-risk edit areas:
- Password reset flow
- tenant detection and fallback tenant logic
- admin module gating
- CTA links drifting out of sync across pages
- product/customer naming drift between UI and Neural Search fallback copy
- Edge Function dependencies hidden behind otherwise simple forms
- analytics event tracking being removed during UI cleanup

Operational gotchas:
- `origin` remote was previously misconfigured; current GitHub remote should be verified before future automation
- some files contain encoding artifacts in older text; be careful with bulk find/replace
- link changes often need to be mirrored in multiple marketing surfaces

## 18. Recommended Update Checklist

Before shipping future changes:
1. Identify all user-facing surfaces for the same concept
2. Search the repo for the product/client/topic name
3. Update page copy, CTA links, and tracking metadata together
4. Check fallback AI/search copy for stale facts
5. Verify admin/auth-sensitive edits did not alter session flow
6. Verify lead-capture flows still save to Supabase and still send notifications
7. If AI routing is involved, confirm behavior with and without the feature flag enabled

## 19. Priority Reference Files

For future onboarding, start here:
- [README.md](d:/Training/working/cognivectra-site/README.md)
- [content.md](d:/Training/working/cognivectra-site/content.md)
- [src/App.jsx](d:/Training/working/cognivectra-site/src/App.jsx)
- [src/context/TenantContext.jsx](d:/Training/working/cognivectra-site/src/context/TenantContext.jsx)
- [src/lib/supabase.js](d:/Training/working/cognivectra-site/src/lib/supabase.js)
- [src/lib/analytics.js](d:/Training/working/cognivectra-site/src/lib/analytics.js)
- [src/components/NeuralSearch.jsx](d:/Training/working/cognivectra-site/src/components/NeuralSearch.jsx)
- [src/components/DemoRequestModal.jsx](d:/Training/working/cognivectra-site/src/components/DemoRequestModal.jsx)
- [src/pages/Contact.jsx](d:/Training/working/cognivectra-site/src/pages/Contact.jsx)
- [src/pages/Home.jsx](d:/Training/working/cognivectra-site/src/pages/Home.jsx)
- [src/pages/Products.jsx](d:/Training/working/cognivectra-site/src/pages/Products.jsx)
- [src/pages/MedFlowDetail.jsx](d:/Training/working/cognivectra-site/src/pages/MedFlowDetail.jsx)
- [src/layouts/AdminLayout.jsx](d:/Training/working/cognivectra-site/src/layouts/AdminLayout.jsx)
- [docs/technical/DEVELOPER_GUIDE.md](d:/Training/working/cognivectra-site/docs/technical/DEVELOPER_GUIDE.md)
- [docs/technical/ARCHITECTURE_SYSTEM_DESIGN.md](d:/Training/working/cognivectra-site/docs/technical/ARCHITECTURE_SYSTEM_DESIGN.md)
- [services/DEPLOYMENT.md](d:/Training/working/cognivectra-site/services/DEPLOYMENT.md)

## 20. Maintenance Rule

When making future updates, prefer consistency over local edits.

If a business fact changes, search and update:
- visible UI copy
- related CTA links
- tracking metadata
- AI fallback knowledge
- any mirrored product/detail/home-page references

That is the core rule for keeping this codebase coherent.
