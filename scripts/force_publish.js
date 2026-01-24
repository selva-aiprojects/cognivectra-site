import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing keys");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function publishLatest() {
    // Get latest pending post
    const { data: posts, error: fetchError } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'pending_review')
        .order('created_at', { ascending: false })
        .limit(1);

    if (fetchError) {
        console.error("Fetch Error:", fetchError);
        return;
    }

    if (!posts || posts.length === 0) {
        console.log("No pending posts found to publish.");
        return;
    }

    const post = posts[0];
    console.log(`Publishing post: "${post.title}" (ID: ${post.id})...`);

    const { error: updateError } = await supabase
        .from('posts')
        .update({
            status: 'published',
            published_at: new Date().toISOString()
        })
        .eq('id', post.id);

    if (updateError) {
        console.error("Update Error:", updateError);
    } else {
        console.log("✅ Post successfully PUBLISHED!");
        console.log(`View at: http://localhost:5173/blog/${post.slug}`);
    }
}

publishLatest();
