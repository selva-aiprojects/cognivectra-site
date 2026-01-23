import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env');
  console.error('   Required: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or VITE_SUPABASE_ANON_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test Edge Function logic locally
async function testPublish(postId, platforms) {
  console.log(`\n🧪 Testing publish for post ${postId} to platforms: ${platforms.join(', ')}\n`);

  // Fetch post
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .single();

  if (error || !post) {
    console.error('❌ Post not found:', error?.message || 'Unknown error');
    return;
  }

  console.log(`📰 Post: "${post.title}"`);
  console.log(`📝 Excerpt: ${post.excerpt?.substring(0, 100)}...`);
  console.log(`🔗 Slug: ${post.slug}\n`);

  const socialData = post.social_media_data || {};
  const blogUrl = `https://cogni-vectra.vercel.app/blog/${post.slug}`;

  // Test each platform
  const results = [];
  
  for (const platform of platforms) {
    if (platform === 'blog') {
      console.log('✅ Blog: Would publish to website');
      results.push({ platform: 'blog', success: true });
      continue;
    }

    console.log(`\n🔍 Testing ${platform}...`);
    
    // Check credentials
    const tokenKey = `${platform.toUpperCase()}_ACCESS_TOKEN`;
    const token = process.env[tokenKey];
    
    if (!token) {
      console.log(`⏭️  ${platform}: No credentials found`);
      console.log(`   Expected env var: ${tokenKey}`);
      results.push({ 
        platform, 
        success: false, 
        error: `Missing ${tokenKey} in environment variables` 
      });
      continue;
    }

    console.log(`✅ ${platform}: Credentials found`);
    console.log(`   Token: ${token.substring(0, 20)}...`);
    
    // Check additional required variables
    if (platform === 'instagram') {
      const accountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
      if (!accountId) {
        console.log(`   ⚠️  Missing: INSTAGRAM_BUSINESS_ACCOUNT_ID`);
        results.push({ 
          platform, 
          success: false, 
          error: 'Missing INSTAGRAM_BUSINESS_ACCOUNT_ID' 
        });
        continue;
      }
      console.log(`   ✅ Account ID: ${accountId}`);
    }
    
    if (platform === 'facebook') {
      const pageId = process.env.FACEBOOK_PAGE_ID;
      if (!pageId) {
        console.log(`   ⚠️  Missing: FACEBOOK_PAGE_ID`);
        results.push({ 
          platform, 
          success: false, 
          error: 'Missing FACEBOOK_PAGE_ID' 
        });
        continue;
      }
      console.log(`   ✅ Page ID: ${pageId}`);
    }

    if (platform === 'linkedin') {
      const personUrn = process.env.LINKEDIN_PERSON_URN;
      const companyUrn = process.env.LINKEDIN_COMPANY_URN;
      if (!personUrn && !companyUrn) {
        console.log(`   ⚠️  Missing: LINKEDIN_PERSON_URN or LINKEDIN_COMPANY_URN`);
        results.push({ 
          platform, 
          success: false, 
          error: 'Missing LINKEDIN_PERSON_URN or LINKEDIN_COMPANY_URN' 
        });
        continue;
      }
      if (personUrn) console.log(`   ✅ Person URN: ${personUrn}`);
      if (companyUrn) console.log(`   ✅ Company URN: ${companyUrn}`);
    }

    console.log(`   ✅ ${platform}: All credentials present (would make API call)`);
    results.push({ platform, success: true, note: 'Credentials valid, API call would succeed' });
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary');
  console.log('='.repeat(60));
  
  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;
  
  results.forEach(result => {
    if (result.success) {
      console.log(`✅ ${result.platform}: Ready`);
    } else {
      console.log(`❌ ${result.platform}: ${result.error}`);
    }
  });
  
  console.log(`\n✅ Ready: ${successCount}/${results.length} platforms`);
  if (failCount > 0) {
    console.log(`❌ Missing credentials: ${failCount} platforms`);
  }
  
  console.log('\n💡 Note: This test only checks credentials, not actual API calls.');
  console.log('   To test publishing, use the admin dashboard or deploy Edge Function.\n');
}

// Get postId from command line
const postId = process.argv[2];
const platforms = process.argv.length > 3 ? process.argv.slice(3) : ['blog', 'linkedin'];

if (!postId) {
  console.error('Usage: node scripts/test-publish-local.js <postId> [platforms...]');
  console.error('\nExamples:');
  console.error('  node scripts/test-publish-local.js 1');
  console.error('  node scripts/test-publish-local.js 1 blog linkedin');
  console.error('  node scripts/test-publish-local.js 1 blog linkedin instagram facebook');
  process.exit(1);
}

testPublish(parseInt(postId), platforms).catch(err => {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
});
