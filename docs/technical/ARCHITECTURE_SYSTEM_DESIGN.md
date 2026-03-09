# 🏗️ Architecture & System Design

This document details the technical architecture and business management modules of the CogniVectra platform.

---

## 🏛️ Core Architecture

### Tech Stack
- **Frontend**: React (Vite) + Vanilla CSS + Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **AI Core**: OpenAI GPT-4 + LangGraph + CrewAI (Multi-agent orchestration)
- **Routing**: **Warm-Adapter** Intent Router (FastAPI) + deterministic orchestrator
- **Security**: 3-layer encryption (Supabase Vault + Fernet + Environment injection)

### System Components
- **Neural Search (RAG)**: Global intelligent search engine using Supabase Edge Functions with keyword fallback and agentic routing.
- **Intent Router**: LoRA-enabled Python microservice classifying user queries into specialized intents.
- **LangGraph Orchestrator**: Multi-agent state machine that routes intents to specific agent nodes for high-fidelity responses.
- **Admin Dashboard**: Central hub for content review, social publishing, and business ops.
- **Edge Functions**: Deno functions orchestrating requests between the frontend and AI microservices.

---

## 🛡️ Engineering Philosophy

CogniVectra adheres to "Elite Growth" principles:
- **Production-Ready Foundations**: Zero technical debt. Every component is senior-architected using modern, scalable patterns.
- **IP Ownership**: Clients own 100% of the intellectual property. No black-box vendor lock-in.
- **Security-First**: Integrated HIPAA-ready guardrails (MedFlow) and enterprise-grade authentication (Supabase).
- **Conversion-Optimized**: Architecture prioritizes lead capture via low-friction inline forms and high-value "Lead Magnet" assets.
- **Agentic Efficiency**: Leveraging multi-agent AI (CrewAI/LangGraph) with deterministic state management to eliminate cyclic reference loops. [Learn more](file:///d:/Training/working/cognivectra-site/docs/AI_CREWAI_STATE_MANAGEMENT.md).

---

## 💼 Business Management Modules

CogniVectra includes several internal management systems built on top of Supabase:

### 1. Recruitment & HR
- **Careers Page**: Application tracking with resume management.
- **Compensation Packages**: Standardized salary and benefit definitions by role.
- **Offer Generator**: Automated PDF/HTML offer letter creation.
- **Employee Database**: Central record of COGNI-ID assigned staff.

### 2. CRM & Lead Generation Pipeline
- **Lead Capture**: Multi-entry funnel via Architecture Review form, Product Quick-Demo forms, and AI Sales Assistant.
- **Lead Scoring**: Automatic classification of leads (`hot`, `warm`) based on engagement (e.g., specific platform inquiries vs. general contact).
- **Client Database**: Company info, primary contacts, and business health tracking.
- **Interaction Log**: Audit trail of form submissions, chatbot conversations, and proposal stages.
- **Onboarding Workflow**: Checklist-driven client setup.

### 3. Project & Task Management
- **Project Tracking**: Milestone-based management with health statuses (On Track, At Risk).
- **Task Management**: Todo/In-Progress/Review workflow with time tracking.
- **Team Assignment**: Linking employees to specific client projects.

---

## 📊 Data Model (Key Entities)
- **Posts**: Blog content with platform-specific social media variants.
- **Clients**: CRM records (CL### format).
- **Projects**: Engagement records (PRJ### format).
- **Employees**: Personnel records (COGNI### format).
- **AI Feature Flags**: Configuration for phased rollout of LLM routing (`ai_feature_flags` table).
- **AI Query Logs**: Audit trail for AI query intent classification and agent selection (`ai_query_logs` table).

---

## 🚀 Future Roadmap
- [ ] Automated invoice generation and Stripe integration.
- [ ] Client portal for project transparency.
- [ ] AI-powered lead scoring and nurture workflows.
