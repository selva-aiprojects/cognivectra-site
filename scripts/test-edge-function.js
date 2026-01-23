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
  console.error('❌ Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEdgeFunction(postId, platforms = ['linkedin']) {
  console.log('\n🧪 Testing Edge Function: publish-social\n');
  console.log(`Post ID: ${postId}`);
  console.log(`Platforms: ${platforms.join(', ')}\n`);

  try {
    // First, verify the post exists
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('id, title, slug, status')
      .eq('id', postId)
      .single();

    if (postError || !post) {
      console.error('❌ Post not found:', postError?.message);
      console.log('\n💡 Available posts:');
      const { data: posts } = await supabase
        .from('posts')
        .select('id, title, status')
        .limit(5);
      posts?.forEach(p => console.log(`   ID: ${p.id} - "${p.title}" (${p.status})`));
      return;
    }

    console.log(`✅ Post found: "${post.title}"`);
    console.log(`   Status: ${post.status}`);
    console.log(`   Slug: ${post.slug}\n`);

    // Invoke Edge Function
    console.log('📡 Invoking Edge Function...\n');
    
    const { data, error } = await supabase.functions.invoke('publish-social', {
      body: {
        postId: parseInt(postId),
        platforms: platforms
      }
    });

    if (error) {
      console.error('❌ Edge Function Error:');
      console.error('   Message:', error.message);
      if (error.context) {
        console.error('   Context:', JSON.stringify(error.context, null, 2));
      }
      return;
    }

    console.log('✅ Edge Function Response:\n');
    console.log(JSON.stringify(data, null, 2));

    // Parse results
    if (data && data.results) {
      console.log('\n📊 Publishing Results:');
      data.results.forEach(result => {
        if (result.success) {
          console.log(`   ✅ ${result.platform}: Published successfully`);
          if (result.data?.id) {
            console.log(`      Post ID: ${result.data.id}`);
          }
        } else {
          console.log(`   ❌ ${result.platform}: Failed`);
          console.log(`      Error: ${result.error}`);
        }
      });
    }

  } catch (err) {
    console.error('❌ Test failed:', err.message);
    console.error('Stack:', err.stack);
  }
}

// Get arguments
const postId = process.argv[2];
const platforms = process.argv.length > 3 ? process.argv.slice(3) : ['linkedin'];

if (!postId) {
  console.error('Usage: node scripts/test-edge-function.js <postId> [platforms...]');
  console.error('\nExamples:');
  console.error('  node scripts/test-edge-function.js 1');
  console.error('  node scripts/test-edge-function.js 1 linkedin');
  console.error('  node scripts/test-edge-function.js 1 linkedin instagram facebook');
  process.exit(1);
}

testEdgeFunction(parseInt(postId), platforms);
