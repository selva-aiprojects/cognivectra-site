import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

// Load .env from root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const linkedinAccessToken = process.env.LINKEDIN_ACCESS_TOKEN;
const linkedinPersonUrn = process.env.LINKEDIN_PERSON_URN;
const linkedinCompanyUrn = process.env.LINKEDIN_COMPANY_URN;

const supabase = createClient(supabaseUrl, supabaseKey);

// LinkedIn Publishing - Personal Profile
async function publishToLinkedIn(post) {
    if (!linkedinAccessToken) {
        console.log("⏭️  LinkedIn: No access token configured");
        return { success: false, reason: "No access token" };
    }

    try {
        const linkedinContent = post.social_media_data?.linkedin || post.title;
        const blogUrl = `https://cogni-vectra.vercel.app/blog/${post.slug}`;

        // Use Company URN for "Page" posts as requested, fallback to Person URN
        const authorUrn = linkedinCompanyUrn || linkedinPersonUrn;

        if (!authorUrn) {
            console.error("❌ LinkedIn Author URN (Person or Company) not configured in .env");
            return { success: false, reason: "No author URN" };
        }

        console.log(`📤 Posting to LinkedIn ${linkedinCompanyUrn ? 'Organization Page' : 'Personal Profile'}...`);
        console.log(`   Author: ${authorUrn}`);
        console.log(`   Content: ${linkedinContent.substring(0, 80)}...`);

        const requestBody = {
            author: authorUrn,
            lifecycleState: 'PUBLISHED',
            visibility: {
                'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
            },
            specificContent: {
                'com.linkedin.ugc.ShareContent': {
                    shareCommentary: {
                        text: `${linkedinContent}\n\n📖 Read full article: ${blogUrl}`
                    },
                    shareMediaCategory: 'NONE'
                }
            }
        };

        const response = await axios.post('https://api.linkedin.com/v2/ugcPosts', requestBody, {
            headers: {
                'Authorization': `Bearer ${linkedinAccessToken}`,
                'Content-Type': 'application/json',
                'X-Restli-Protocol-Version': '2.0.0'
            }
        });

        console.log("✅ Posted to LinkedIn");
        console.log(`   Post ID: ${response.data.id}`);
        console.log(`   Check your LinkedIn feed in 30 seconds`);

        // Record in database
        await supabase
            .from('social_media_posts')
            .insert({
                post_id: post.id,
                platform: 'linkedin',
                platform_post_id: response.data.id,
                published_at: new Date().toISOString()
            });

        return { success: true, platform: 'linkedin', postId: response.data.id };
    } catch (error) {
        console.error("❌ LinkedIn API Error:");
        if (error.response?.data) {
            console.error("   Status:", error.response.status);
            console.error("   Code:", error.response.data.code);
            console.error("   Message:", error.response.data.message);
        } else {
            console.error("   Error:", error.message);
        }
        return { success: false, platform: 'linkedin', error: error.message };
    }
}

// Main function
async function publishPost(postId, platforms = ['linkedin']) {
    try {
        // Fetch the post
        const { data: post, error: fetchError } = await supabase
            .from('posts')
            .select('*')
            .eq('id', postId)
            .single();

        if (fetchError || !post) {
            console.error("❌ Post not found");
            return;
        }

        console.log(`\n📰 Publishing post: "${post.title}"\n`);

        // Publish to platforms
        if (platforms.includes('linkedin')) {
            await publishToLinkedIn(post);
        }

        console.log(`\n✅ Publishing complete!`);
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

// Get postId from command line arguments
const postId = process.argv[2];
const platforms = process.argv.length > 3 ? process.argv.slice(3) : ['linkedin'];

if (!postId) {
    console.error("Usage: node publish_to_social.js <postId> [platforms...]");
    console.error("Default platform: linkedin");
    process.exit(1);
}

publishPost(parseInt(postId), platforms);
