import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
const personUrn = process.env.LINKEDIN_PERSON_URN;
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('=== LinkedIn Personal Profile Post ===');
console.log('Access Token:', accessToken ? '✅ Present' : '❌ Missing');
console.log('Person URN:', personUrn ? '✅ Present' : '❌ Missing');

if (!accessToken || !personUrn) {
    console.error('❌ Missing credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function postToPersonalProfile() {
    try {
        // Get the latest published post from database
        const { data: posts, error } = await supabase
            .from('posts')
            .select('*')
            .eq('status', 'published')
            .order('published_at', { ascending: false })
            .limit(1);

        if (error || !posts || posts.length === 0) {
            console.error('No published posts found');
            return;
        }

        const post = posts[0];
        const linkedinContent = post.social_media_data?.linkedin ||
            `${post.title}\n\n${post.excerpt}\n\nRead more: https://cognivectra.com/blog/${post.slug}`;

        console.log(`\nPosting to LinkedIn: "${post.title}"`);
        console.log('Content preview:', linkedinContent.substring(0, 100) + '...');

        const postContent = {
            author: personUrn,
            lifecycleState: 'PUBLISHED',
            visibility: {
                'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
            },
            specificContent: {
                'com.linkedin.ugc.ShareContent': {
                    shareCommentary: {
                        text: linkedinContent
                    },
                    shareMediaCategory: 'NONE'
                }
            }
        };

        const response = await axios.post('https://api.linkedin.com/v2/ugcPosts', postContent, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('\n✅ Successfully posted to LinkedIn Personal Profile!');
        console.log('Post ID:', response.data.id);
        console.log('View at: https://www.linkedin.com/feed/');

        return response.data;

    } catch (error) {
        console.error('\n❌ Post failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Error:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
    }
}

postToPersonalProfile();
