-- SQL Migration: Blog Content Launch
-- Run this in your Supabase SQL Editor to populate the blog with technical authority content.

-- 1. Clear existing placeholder posts (Optional - uncomment if you want a fresh start)
-- DELETE FROM posts WHERE status = 'published';

-- 2. Insert new high-impact technical articles
INSERT INTO posts (
    title, 
    slug, 
    excerpt, 
    body, 
    image_url, 
    status, 
    published_at, 
    author_id
) VALUES 
(
    'The Architecture Gap: Why Roots Matter',
    'architecture-gap',
    'Why 90%% of technical startups fail at scaling, and how rooted architectural foundations prevent the "Year 2 Rebuild".',
    'In the race to Market-Fit, roots are often sacrificed for features. This article explores the Strategic Architecture Gap and provides a blueprint for building roots that scale.',
    '/src/assets/generated/blog-arch-gap.png',
    'published',
    NOW(),
    (SELECT id FROM auth.users LIMIT 1) -- Assumes at least one user exists; adjust if needed
),
(
    'MedFlow Velocity: Scaling Healthcare AI',
    'medflow-velocity',
    'Scaling Healthcare AI without compromising on sub-second latency or HIPAA compliance. A deep dive into MedFlow''s core.',
    'Healthcare is the ultimate test for performance and security. We break down the sharded data layer and regional residency guards that power MedFlow.',
    '/src/assets/generated/blog-medflow-velocity.png',
    'published',
    NOW() - INTERVAL '1 day',
    (SELECT id FROM auth.users LIMIT 1)
),
(
    'Enterprise Cloud Foundations: Multi-Tenant Sovereignty',
    'cloud-foundations',
    'The blueprint for production-ready multi-tenant systems. From shared libraries to regional data isolation.',
    'Multi-tenancy is more than a database flag. Learn how we implement hard isolation, shared-nothing architectures, and global configuration management.',
    '/src/assets/generated/blog-cloud-foundations.png',
    'published',
    NOW() - INTERVAL '2 days',
    (SELECT id FROM auth.users LIMIT 1)
),
(
    'Secure GenAI Integration in the Enterprise',
    'genai-integration',
    'Bypassing the hype: How to integrate LLMs into your enterprise workflow safely, with guardrails and auditability.',
    'GenAI in production requires more than an API key. We explore the guardrail layer, prompt integrity checks, and audit logging required for enterprise trust.',
    '/src/assets/generated/blog-genai-integration.png',
    'published',
    NOW() - INTERVAL '3 days',
    (SELECT id FROM auth.users LIMIT 1)
);
