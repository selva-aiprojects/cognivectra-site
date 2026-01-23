# Local Testing Guide

This guide explains how to test the social media publishing functionality locally.

## Prerequisites

1. **Node.js** installed (v18+)
2. **Supabase account** and project set up
3. **Environment variables** configured in `.env`
4. **LinkedIn credentials** (at minimum) in `.env`

## Option 1: Full Local Testing (Recommended)

### Step 1: Start the Frontend

```bash
# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Step 2: Deploy Edge Function to Supabase

The Edge Function needs to be deployed to Supabase to work. You have two options:

#### Option A: Deploy via Supabase CLI (Recommended)

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy the Edge Function
supabase functions deploy publish-social
```

#### Option B: Deploy via Supabase Dashboard

1. Go to your Supabase Dashboard
2. Navigate to **Edge Functions**
3. Click **Create a new function**
4. Name it `publish-social`
5. Copy the contents of `supabase/functions/publish-social/index.ts`
6. Paste into the editor
7. Click **Deploy**

### Step 3: Set Environment Variables in Supabase

The Edge Function needs access to your social media credentials. Add them as **Secrets**:

1. Go to Supabase Dashboard → **Project Settings** → **Edge Functions** → **Secrets**
2. Add each secret:
   - `LINKEDIN_ACCESS_TOKEN`
   - `LINKEDIN_PERSON_URN` (optional)
   - `LINKEDIN_COMPANY_URN` (optional)
   - `INSTAGRAM_ACCESS_TOKEN` (when you have it)
   - `INSTAGRAM_BUSINESS_ACCOUNT_ID` (when you have it)
   - `DEFAULT_POST_IMAGE_URL` (when you have it)
   - `FACEBOOK_ACCESS_TOKEN` (when you have it)
   - `FACEBOOK_PAGE_ID` (when you have it)

### Step 4: Test Locally

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Open the admin dashboard:**
   - Go to `http://localhost:5173/login`
   - Log in with your admin credentials
   - Navigate to `http://localhost:5173/admin`

3. **Test publishing:**
   - Find a post in "Drafts" or "Pending Review"
   - Click "Publish" button
   - Select platforms (Blog, LinkedIn, etc.)
   - Click "Publish Selected"
   - Watch for status updates in the UI

## Option 2: Test Edge Function Directly (Advanced)

If you want to test the Edge Function logic without deploying, you can use the test script:

### Create a Test Script

Create `scripts/test-publish-local.js`:

```javascript
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Simulate Edge Function logic
async function testPublish(postId, platforms) {
  console.log(`\n🧪 Testing publish for post ${postId} to platforms: ${platforms.join(', ')}\n`);

  // Fetch post
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .single();

  if (error || !post) {
    console.error('❌ Post not found:', error);
    return;
  }

  console.log(`📰 Post: "${post.title}"`);
  console.log(`📝 Excerpt: ${post.excerpt?.substring(0, 100)}...\n`);

  // Test each platform
  for (const platform of platforms) {
    if (platform === 'blog') {
      console.log('✅ Blog: Would publish to website');
      continue;
    }

    console.log(`\n🔍 Testing ${platform}...`);
    
    // Check credentials
    const tokenKey = `${platform.toUpperCase()}_ACCESS_TOKEN`;
    const token = process.env[tokenKey];
    
    if (!token) {
      console.log(`⏭️  ${platform}: No credentials found (expected if not configured)`);
      continue;
    }

    console.log(`✅ ${platform}: Credentials found`);
    console.log(`   Token: ${token.substring(0, 20)}...`);
    
    // Note: Actual API calls would go here, but we're just testing the setup
    console.log(`   Would publish to ${platform} API`);
  }

  console.log('\n✅ Test complete!\n');
}

// Get postId from command line
const postId = process.argv[2];
const platforms = process.argv.slice(3) || ['blog', 'linkedin'];

if (!postId) {
  console.error('Usage: node scripts/test-publish-local.js <postId> [platforms...]');
  console.error('Example: node scripts/test-publish-local.js 1 blog linkedin');
  process.exit(1);
}

testPublish(parseInt(postId), platforms);
```

### Run the Test Script

```bash
# Test with a specific post ID
node scripts/test-publish-local.js 1 blog linkedin

# Test all platforms
node scripts/test-publish-local.js 1 blog linkedin instagram facebook
```

## Option 3: Mock Testing (No API Calls)

For development without making actual API calls, you can temporarily modify the Edge Function to return mock responses.

### Create Mock Version

Create `supabase/functions/publish-social/index-mock.ts`:

```typescript
// Mock version - returns success without API calls
// Use this for local development testing

// ... (same structure but with mock responses)

if (platforms.includes('linkedin')) {
  results.push({
    platform: 'linkedin',
    success: true,
    data: { id: 'mock-linkedin-post-123' }
  });
}

if (platforms.includes('instagram')) {
  results.push({
    platform: 'instagram',
    success: true,
    data: { id: 'mock-instagram-post-456' }
  });
}

if (platforms.includes('facebook')) {
  results.push({
    platform: 'facebook',
    success: true,
    data: { id: 'mock-facebook-post-789' }
  });
}
```

## Troubleshooting Local Testing

### Issue: "Function not found" or 404 error

**Solution:**
- Ensure Edge Function is deployed to Supabase
- Check function name matches: `publish-social`
- Verify Supabase project is linked correctly

### Issue: "Missing credentials" error

**Solution:**
- Add credentials as Supabase Secrets (not just in `.env`)
- Restart Edge Function after adding secrets
- Verify secret names match exactly (case-sensitive)

### Issue: Frontend can't connect to Edge Function

**Solution:**
- Check Supabase URL in `.env` is correct
- Verify you're using the correct Supabase project
- Check browser console for CORS errors

### Issue: Posts not appearing after publish

**Solution:**
- Check `social_media_posts` table in Supabase
- Verify post status changed to "published"
- Check browser console for errors

## Quick Local Test Checklist

- [ ] Frontend running (`npm run dev`)
- [ ] Edge Function deployed to Supabase
- [ ] Environment variables set in Supabase Secrets
- [ ] Admin user logged in
- [ ] Test post created or available
- [ ] Publishing tested with at least LinkedIn

## Next Steps After Local Testing

Once local testing works:

1. **Test with real credentials:**
   - Start with LinkedIn (you have credentials)
   - Add Instagram when ready
   - Add Facebook when ready

2. **Monitor for errors:**
   - Check admin dashboard for status
   - Review Supabase logs
   - Check social media platforms for posts

3. **Deploy to production:**
   - Deploy frontend to Vercel/Netlify
   - Edge Function is already on Supabase (works for production too)
   - Set production environment variables

## Notes

- **Edge Functions run on Supabase servers**, not locally
- The frontend calls the Edge Function via Supabase client
- Local testing means testing the **frontend locally** while the **Edge Function runs on Supabase**
- For true local Edge Function testing, use Supabase CLI with local development mode
