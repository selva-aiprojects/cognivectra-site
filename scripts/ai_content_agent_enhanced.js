import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

// Load .env from root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://tyudebbhowtzdrkwpgzj.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5dWRlYmJob3d0emRya3dwZ3pqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQ1NTU0OSwiZXhwIjoyMDg0MDMxNTQ5fQ.QZDzIBupUuPXpcV7pTTqMTfgNVHTWmvtHEgTztnV4dY';
const openaiKey = process.env.OPENAI_API_KEY?.trim();

// Social Media API Keys (from environment)
const linkedinAccessToken = process.env.LINKEDIN_ACCESS_TOKEN;
const instagramAccessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
const facebookAccessToken = process.env.FACEBOOK_ACCESS_TOKEN;

if (!supabaseUrl || !supabaseKey || !openaiKey) {
    console.error("❌ Missing environment variables. Check .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({ apiKey: openaiKey });

// ============================================================
// CONTENT GENERATION
// ============================================================
async function generatePost() {
    console.log("\n🤖 AI Agent: Generating new content...\n");

    // Define CogniVectra-focused topics
    const topics = [
        "How to choose between AWS, GCP, and Azure for your startup",
        "DevOps automation best practices for scaling startups",
        "Reducing cloud costs: common optimization strategies",
        "Building a reliable CI/CD pipeline from scratch",
        "AI-powered automation for business processes",
        "Startup infrastructure: MVP to Series B scaling",
        "Security best practices for early-stage SaaS",
        "Managing technical debt while shipping fast",
        "Fractional CTO vs. hiring full-time: pros and cons",
        "Data engineering foundations for data-driven startups"
    ];

    const topic = topics[Math.floor(Math.random() * topics.length)];
    console.log(`📌 Selected Topic: "${topic}"\n`);

    // Generate multi-format content
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `You are a technical writer for CogniVectra, an enterprise automation consulting firm for startups. 
Write authoritative, practical content that appeals to startup CTOs and founders.
Focus on: Cloud infrastructure, DevOps, automation, SaaS scaling, and AI integration.
Tone: Professional but approachable, with actionable insights.`
            },
            {
                role: "user",
                content: `Create blog content about: "${topic}"

Return ONLY valid JSON (no markdown, no extra text) with this structure:
{
  "title": "Catchy SEO-friendly title (50-60 chars)",
  "excerpt": "Compelling 2-sentence summary for preview (under 150 chars)",
  "body": "Full blog post with markdown formatting (2000+ words, include ## headers, ** bold **, and lists)",
  "slug": "url-friendly-slug-like-this",
  "linkedin_post": "Engaging LinkedIn version (approx 1000-1500 chars). Start with a hook, use bullet points for readability, include internal insights, and end with a call to action plus hashtags.",
  "instagram_caption": "Engaging Instagram version (under 1000 chars, use emojis, hashtags, and a clear call to action).",
  "facebook_post": "Engaging Facebook version (approx 500-1000 chars, conversational tone, include a summary of the post and a clear call to action).",
  "tags": ["tag1", "tag2", "tag3", "tag4"]
}

Ensure JSON is valid and properly escaped.`
            }
        ],
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 2000
    });

    try {
        const content = JSON.parse(completion.choices[0].message.content);

        // Sanitize slug and add unique suffix
        const uniqueSuffix = Math.random().toString(36).substring(2, 7);
        content.slug = content.slug
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') + '-' + uniqueSuffix;

        console.log(`✅ Generated: "${content.title}"\n`);

        return content;
    } catch (error) {
        console.error("❌ JSON Parsing Error:", error.message);
        throw error;
    }
}

// ============================================================
// SAVE TO DATABASE
// ============================================================
async function savePostToDraft(content) {
    console.log("💾 Saving to Supabase (Draft Status)...");

    const { data, error } = await supabase
        .from('posts')
        .insert([{
            title: content.title,
            slug: content.slug,
            excerpt: content.excerpt,
            body: content.body,
            tags: content.tags || [],
            status: 'draft',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            social_media_data: {
                linkedin: content.linkedin_post,
                instagram: content.instagram_caption,
                facebook: content.facebook_post
            }
        }])
        .select();

    if (error) {
        console.error("❌ Supabase Error:", error.message);
        throw error;
    }

    console.log(`✅ Post saved to drafts: ${data[0].title}`);
    return data[0];
}

// ============================================================
// SOCIAL MEDIA PUBLISHING
// ============================================================

// LinkedIn Publishing
async function publishToLinkedIn(postId, postData) {
    if (!linkedinAccessToken) {
        console.log("⏭️  LinkedIn: No access token configured");
        return { success: false, reason: "No access token" };
    }

    try {
        const linkedinPersonURN = process.env.LINKEDIN_PERSON_URN || 'urn:li:person:8305641';

        const response = await axios.post('https://api.linkedin.com/v2/ugcPosts', {
            actor: linkedinPersonURN,
            contentLanguage: 'en',
            lifecycleState: 'PUBLISHED',
            specificContent: {
                'com.linkedin.ugc.ShareContent': {
                    shareCommentary: {
                        text: postData.linkedin_post
                    },
                    shareMediaCategory: 'NONE'
                }
            }
        }, {
            headers: {
                'Authorization': `Bearer ${linkedinAccessToken}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("✅ Published to LinkedIn");
        return { success: true, platform: 'linkedin', postId: response.data.id };
    } catch (error) {
        console.error("❌ LinkedIn Error:", error.response?.data || error.message);
        return { success: false, platform: 'linkedin', error: error.message };
    }
}

// Instagram Publishing
async function publishToInstagram(postId, postData) {
    if (!instagramAccessToken) {
        console.log("⏭️  Instagram: No access token configured");
        return { success: false, reason: "No access token" };
    }

    try {
        const igBusinessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
        if (!igBusinessAccountId) {
            throw new Error("INSTAGRAM_BUSINESS_ACCOUNT_ID not set");
        }

        const response = await axios.post(
            `https://graph.instagram.com/v18.0/${igBusinessAccountId}/media`,
            {
                image_url: process.env.DEFAULT_POST_IMAGE_URL || 'https://via.placeholder.com/1080x1080?text=CogniVectra',
                caption: postData.instagram_caption,
                access_token: instagramAccessToken
            }
        );

        console.log("✅ Published to Instagram");
        return { success: true, platform: 'instagram', postId: response.data.id };
    } catch (error) {
        console.error("❌ Instagram Error:", error.response?.data || error.message);
        return { success: false, platform: 'instagram', error: error.message };
    }
}

// Facebook Publishing
async function publishToFacebook(postId, postData) {
    if (!facebookAccessToken) {
        console.log("⏭️  Facebook: No access token configured");
        return { success: false, reason: "No access token" };
    }

    try {
        const pageId = process.env.FACEBOOK_PAGE_ID;
        if (!pageId) {
            throw new Error("FACEBOOK_PAGE_ID not set");
        }

        const response = await axios.post(
            `https://graph.facebook.com/v18.0/${pageId}/feed`,
            {
                message: postData.facebook_post,
                link: `https://cogni-vectra.vercel.app/blog/${postData.slug}`,
                access_token: facebookAccessToken
            }
        );

        console.log("✅ Published to Facebook");
        return { success: true, platform: 'facebook', postId: response.data.id };
    } catch (error) {
        console.error("❌ Facebook Error:", error.response?.data || error.message);
        return { success: false, platform: 'facebook', error: error.message };
    }
}

// ============================================================
// ADMIN NOTIFICATION
// ============================================================
async function notifyAdminForReview(post) {
    console.log("\n📧 Sending Review Notification to Admin...");

    // Update post with review status
    const { error } = await supabase
        .from('posts')
        .update({
            status: 'pending_review',
            review_requested_at: new Date().toISOString()
        })
        .eq('id', post.id);

    if (error) {
        console.error("❌ Error updating post status:", error.message);
    } else {
        console.log(`✅ Post status set to "pending_review"`);
        console.log(`\n📋 Admin Review Required:\n`);
        console.log(`   Title: ${post.title}`);
        console.log(`   URL: http://localhost:5173/admin#post-${post.id}`);
        console.log(`   Status: Awaiting approval\n`);
    }
}

// ============================================================
// MAIN ORCHESTRATION
// ============================================================
async function main() {
    try {
        console.log("═".repeat(60));
        console.log("    CogniVectra AI Content Agent - Enhanced");
        console.log("═".repeat(60));

        // Step 1: Generate Content
        const contentData = await generatePost();

        // Step 2: Save to Database
        const post = await savePostToDraft(contentData);

        // Step 3: Notify Admin for Review
        await notifyAdminForReview(post);

        // Step 4: Log Summary
        console.log("\n" + "═".repeat(60));
        console.log("📊 CONTENT GENERATION COMPLETE");
        console.log("═".repeat(60));
        console.log(`\n✨ Post Summary:`);
        console.log(`   ID: ${post.id}`);
        console.log(`   Title: ${post.title}`);
        console.log(`   Status: pending_review`);
        console.log(`   Tags: ${contentData.tags.join(", ")}`);
        console.log(`\n🔄 Next Steps:`);
        console.log(`   1. Admin reviews content in /admin`);
        console.log(`   2. Upon approval, post auto-publishes to:`);
        console.log(`      - Blog (this website)`);
        console.log(`      - LinkedIn`);
        console.log(`      - Instagram`);
        console.log(`      - Facebook`);
        console.log("\n");

    } catch (error) {
        console.error("\n❌ FATAL ERROR:", error.message);
        process.exit(1);
    }
}

// Run the agent
main();
