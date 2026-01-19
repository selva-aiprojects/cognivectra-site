import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = 'https://tyudebbhowtzdrkwpgzj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5dWRlYmJob3d0emRya3dwZ3pqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQ1NTU0OSwiZXhwIjoyMDg0MDMxNTQ5fQ.QZDzIBupUuPXpcV7pTTqMTfgNVHTWmvtHEgTztnV4dY';
const openaiKey = process.env.OPENAI_API_KEY?.trim();

if (!supabaseUrl || !supabaseKey || !openaiKey) {
    console.error("Missing environment variables. Check .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({ apiKey: openaiKey });

async function generatePost() {
    console.log("🤖 AI Agent: waking up...");

    // 1. Define Topics
    const topics = [
        "AI agents in enterprise",
        "Cloud automation for startups",
        "SaaS scaling patterns",
        "Generative AI security"
    ];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    console.log(`🎯 Topic: ${topic}`);

    // 2. Generate Content
    const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: "You are a tech blog writer for Cognivectra, an enterprise automation consultancy." },
            {
                role: "user", content: `Write a blog post about "${topic}". 
        Include a catchy title, a 2-sentence excerpt, and a body with markdown headers. 
        Return JSON format: { "title": "...", "excerpt": "...", "body": "...", "slug": "..." }` }
        ],
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
    });

    const content = JSON.parse(completion.choices[0].message.content);
    content.slug = content.slug.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''); // Ensure slug safety
    console.log(`📝 Generated: ${content.title}`);

    // 3. Save to Supabase (Status: drafts)
    const { data, error } = await supabase
        .from('posts')
        .insert([{
            title: content.title,
            slug: content.slug,
            excerpt: content.excerpt,
            body: content.body,
            status: 'draft',
            created_at: new Date()
        }])
        .select();

    console.log("Debug: Using URL ->", supabaseUrl);
    console.log("Debug: Using Key (last 10) ->", supabaseKey.slice(-10));

    if (error) {
        console.error("❌ Error saving to Supabase:", error);
    } else {
        console.log("✅ Saved to drafts:", data[0].title);
    }
}

generatePost();
