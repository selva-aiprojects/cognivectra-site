# 🚀 LinkedIn Integration Status

## Current Status: ⚠️ Partial Setup

Your LinkedIn credentials are configured, but the Access Token needs to be regenerated with proper permissions.

## What's Working ✅
- ✅ Blog posts save to database
- ✅ Blog posts publish to your website
- ✅ LinkedIn credentials are stored in `.env`

## What Needs Fixing 🔧
- ❌ LinkedIn Access Token lacks required scopes
- ❌ Cannot post to Company Page (needs `w_organization_social`)
- ❌ Cannot post to Personal Profile (needs `w_member_social`)

## Quick Fix (5 minutes)

### Option 1: Personal Profile Only (Easiest)
1. Run: `node scripts/generate_linkedin_token.js`
2. Open the URL it gives you
3. Authorize the app
4. Copy the code from the redirect URL
5. Run: `node scripts/generate_linkedin_token.js --exchange-code YOUR_CODE`
6. Update `.env` with the new `LINKEDIN_ACCESS_TOKEN`

**This will let you post to your personal LinkedIn profile.**

### Option 2: Company Page (Requires Verification)
To post to the CogniVectra Company Page:
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Select your app
3. Go to **Settings > Verify**
4. Link your CogniVectra Company Page
5. Once verified, "Marketing Developer Platform" will appear in Products
6. Add that product
7. Then follow Option 1 steps to regenerate token

## Testing
After updating the token, test with:
```bash
node scripts/create_linkedin_post.js
```

## For Now
The "📢 Social" button in your Admin Dashboard will show "(Simulated)" until the token is fixed.
