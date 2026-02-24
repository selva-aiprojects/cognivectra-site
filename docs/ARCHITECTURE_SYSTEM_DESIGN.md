# 🏗️ Architecture & System Design

This document details the technical architecture and business management modules of the CogniVectra platform.

---

## 🏛️ Core Architecture

### Tech Stack
- **Frontend**: React (Vite) + Vanilla CSS + Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **AI**: OpenAI GPT-4 & LangGraph/CrewAI (Agentic RAG)
- **Bridge**: Make.com Webhooks (Social Media)

### System Components
- **Neural Search (RAG)**: Global intelligent search engine using Supabase Edge Functions and local context fallbacks.
- **Admin Dashboard**: Central hub for content review, social publishing, and business ops.
- **Edge Functions**: Node.js/Deno functions for handling secure social media API calls.
- **Client App**: High-performance landing pages and blog listing.

---

## 🛡️ Engineering Philosophy

CogniVectra adheres to "Elite Growth" principles:
- **Production-Ready Foundations**: Zero technical debt. Every component is senior-architected using modern, scalable patterns.
- **IP Ownership**: Clients own 100% of the intellectual property. No black-box vendor lock-in.
- **Security-First**: Integrated HIPAA-ready guardrails (MedFlow) and enterprise-grade authentication (Supabase).
- **Agentic Efficiency**: Leveraging multi-agent AI (CrewAI/LangGraph) to automate complex operational workflows.

---

## 💼 Business Management Modules

CogniVectra includes several internal management systems built on top of Supabase:

### 1. Recruitment & HR
- **Careers Page**: Application tracking with resume management.
- **Compensation Packages**: Standardized salary and benefit definitions by role.
- **Offer Generator**: Automated PDF/HTML offer letter creation.
- **Employee Database**: Central record of COGNI-ID assigned staff.

### 2. CRM & Client Management
- **Client Database**: Company info, primary contacts, and business health tracking.
- **Interaction Log**: Timeline of calls, meetings, and proposals.
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

---

## 🚀 Future Roadmap
- [ ] Automated invoice generation and Stripe integration.
- [ ] Client portal for project transparency.
- [ ] AI-powered lead scoring and nurture workflows.
