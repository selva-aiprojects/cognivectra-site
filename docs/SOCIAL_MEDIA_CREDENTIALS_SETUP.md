# Social Media Credentials Setup Guide

This guide walks you through setting up credentials for LinkedIn, Instagram, and Facebook to enable automated publishing from the admin dashboard.

## Overview

The publishing system supports three platforms:
- **LinkedIn** - Already configured (if you have credentials)
- **Instagram** - Requires Business Account + Facebook App
- **Facebook** - Requires Facebook Page + App

---

## LinkedIn Setup

### Prerequisites
- LinkedIn account (Personal or Company Page)
- Access to LinkedIn Developer Portal

### Steps

1. **Create LinkedIn App**
   - Go to https://www.linkedin.com/developers/apps
   - Click "Create app"
   - Fill in app details:
     - App name: Your company name
     - Company: Your company
     - Privacy policy URL: Your privacy policy
     - App logo: Upload your logo
   - Accept terms and create

2. **Add Products**
   - In your app dashboard, go to "Products"
   - Add "Ugc Posts" product (for posting content)
   - Add "Sign In with LinkedIn" (optional, for authentication)

3. **Get Credentials**
   - Go to "Auth" tab
   - Note your **Client ID** and **Client Secret**
   - Add redirect URL: `https://your-domain.com/auth/callback`

4. **Generate Access Token**
   - Use LinkedIn's OAuth 2.0 flow to get an access token
   - Or use the script: `node scripts/generate_linkedin_token.js`
   - Token expires in 60 days (plan for refresh)

5. **Get URN (User/Company Identifier)**
   - For Personal Profile: `urn:li:person:{your-member-id}`
   - For Company Page: `urn:li:organization:{company-id}`
   - Find in app dashboard under "Products" → "Ugc Posts"

6. **Add to Environment Variables**
   ```env
   LINKEDIN_ACCESS_TOKEN=your-access-token-here
   LINKEDIN_PERSON_URN=urn:li:person:xxxxx  # Optional, for personal profile
   LINKEDIN_COMPANY_URN=urn:li:organization:xxxxx  # Optional, for company page
   ```

### Important Notes
- **Rate Limit:** 10 posts/month on free tier
- **Token Expiry:** 60 days (set reminder to refresh)
- **Required Scopes:** `w_member_social` (personal) or `w_organization_social` (company)

---

## Instagram Setup

### Prerequisites
- **Instagram Business Account** (NOT personal account)
- Facebook Business account
- Facebook Page connected to Instagram

### Steps

1. **Convert Instagram to Business Account**
   - Open Instagram mobile app
   - Go to Settings → Account → Switch to Professional Account
   - Choose "Business"
   - Connect to your Facebook Page (create one if needed)

2. **Create Facebook App**
   - Go to https://developers.facebook.com
   - Click "My Apps" → "Create App"
   - Choose "Business" type
   - Fill in app details and create

3. **Add Instagram Product**
   - In your app dashboard, go to "Add Product"
   - Find "Instagram" → Click "Set Up"
   - Choose "Instagram Graph API" (for publishing)

4. **Connect Instagram Account**
   - Go to "Instagram" → "Basic Display" or "Graph API"
   - Click "Add Instagram Account"
   - Authorize your business Instagram account
   - Note your **Instagram Business Account ID**

5. **Get Access Token**
   - Go to Graph API Explorer: https://developers.facebook.com/tools/explorer/
   - Select your app
   - Select your Instagram Business Account
   - Request permissions:
     - `instagram_basic`
     - `pages_show_list`
     - `instagram_content_publish`
   - Generate **Long-lived Access Token** (60+ days)
   - Copy the token

6. **Get Business Account ID**
   - In Graph API Explorer, make a GET request to:
     ```
     https://graph.instagram.com/me?fields=id,username&access_token=YOUR_TOKEN
     ```
   - The `id` field is your **Instagram Business Account ID**

7. **Set Default Image URL**
   - Instagram requires images for all posts
   - Upload a default image to your website/CDN
   - Use this URL as fallback when posts don't have images

8. **Add to Environment Variables**
   ```env
   INSTAGRAM_ACCESS_TOKEN=your-long-lived-token-here
   INSTAGRAM_BUSINESS_ACCOUNT_ID=your-business-account-id
   DEFAULT_POST_IMAGE_URL=https://your-domain.com/images/default-post-image.jpg
   ```

### Important Notes
- **Business Account Required:** Personal Instagram accounts cannot use the API
- **Image Required:** All posts must include an image (1080x1080px recommended)
- **Rate Limit:** ~25 posts per day
- **Token Expiry:** 60 days (long-lived tokens)
- **Caption Limit:** 2,200 characters

### Troubleshooting

**Error: "Invalid access token"**
- Token may have expired (check expiry date)
- Regenerate long-lived token

**Error: "User does not have permission"**
- Ensure Instagram account is Business type
- Check that required permissions are granted

**Error: "Missing image"**
- Ensure `DEFAULT_POST_IMAGE_URL` is set
- Or ensure posts have `image_url` field populated

---

## Facebook Setup

### Prerequisites
- Facebook account
- Facebook Page (create at https://www.facebook.com/pages/create)

### Steps

1. **Create Facebook Page** (if you don't have one)
   - Go to https://www.facebook.com/pages/create
   - Choose "Business or Brand"
   - Fill in page details
   - Complete setup

2. **Get Page ID**
   - Go to your Facebook Page
   - Click "Settings" → "Page Info"
   - Scroll to find **Page ID** (or use: https://www.facebook.com/help/1503421039731588)

3. **Create/Use Facebook App**
   - Go to https://developers.facebook.com
   - Use the same app you created for Instagram, OR create a new one
   - Add "Graph API" product if not already added

4. **Generate Page Access Token**
   - Go to Graph API Explorer: https://developers.facebook.com/tools/explorer/
   - Select your app
   - Click "User or Page" dropdown → Select your Page
   - Request permissions:
     - `pages_manage_posts`
     - `pages_read_engagement`
   - Click "Generate Access Token"
   - **Important:** This generates a short-lived token (1-2 hours)

5. **Convert to Long-lived Page Token**
   - Make a GET request to:
     ```
     https://graph.facebook.com/v18.0/oauth/access_token?
       grant_type=fb_exchange_token&
       client_id=YOUR_APP_ID&
       client_secret=YOUR_APP_SECRET&
       fb_exchange_token=SHORT_LIVED_TOKEN
     ```
   - Copy the `access_token` from response (this is your long-lived token)

6. **Verify Token Works**
   - Test with Graph API Explorer:
     ```
     GET /me?access_token=YOUR_TOKEN
     ```
   - Should return your page info

7. **Add to Environment Variables**
   ```env
   FACEBOOK_ACCESS_TOKEN=your-long-lived-page-token-here
   FACEBOOK_PAGE_ID=your-page-id-here
   ```

### Important Notes
- **Page Token vs User Token:** Use Page Access Token, NOT User Access Token
- **Token Expiry:** Long-lived tokens last ~60 days
- **Rate Limits:** Higher than Instagram (~200 posts/day)
- **Link Previews:** Facebook automatically generates link previews

### Troubleshooting

**Error: "Invalid OAuth access token"**
- Token expired or invalid
- Regenerate long-lived token

**Error: "User does not have permission"**
- Ensure you're using Page Access Token (not User Token)
- Check that `pages_manage_posts` permission is granted

**Error: "Page not found"**
- Verify Page ID is correct
- Ensure you're admin of the page

---

## Environment Variables Summary

Add all credentials to your `.env` file (or Supabase Edge Function secrets):

```env
# LinkedIn
LINKEDIN_ACCESS_TOKEN=your-token
LINKEDIN_PERSON_URN=urn:li:person:xxxxx  # Optional
LINKEDIN_COMPANY_URN=urn:li:organization:xxxxx  # Optional

# Instagram
INSTAGRAM_ACCESS_TOKEN=your-long-lived-token
INSTAGRAM_BUSINESS_ACCOUNT_ID=your-business-account-id
DEFAULT_POST_IMAGE_URL=https://your-domain.com/default-image.jpg

# Facebook
FACEBOOK_ACCESS_TOKEN=your-page-access-token
FACEBOOK_PAGE_ID=your-page-id
```

### For Supabase Edge Functions

If using Supabase Edge Functions, add these as **Secrets** in Supabase Dashboard:
1. Go to Project Settings → Edge Functions → Secrets
2. Add each variable as a secret
3. Restart your Edge Function

---

## Testing Your Setup

### Test LinkedIn
1. Create a test post in admin dashboard
2. Select "LinkedIn" platform
3. Click "Publish"
4. Check your LinkedIn feed (may take 30 seconds)

### Test Instagram
1. Ensure post has an image or `DEFAULT_POST_IMAGE_URL` is set
2. Create test post
3. Select "Instagram" platform
4. Click "Publish"
5. Check Instagram feed

### Test Facebook
1. Create test post
2. Select "Facebook" platform
3. Click "Publish"
4. Check Facebook Page feed

---

## Token Refresh Strategy

All tokens expire in 60 days. Plan for refresh:

1. **Set Calendar Reminder:** 50 days after setup
2. **Monitor Errors:** System will show "Invalid token" errors
3. **Refresh Process:**
   - LinkedIn: Re-run OAuth flow or use refresh script
   - Instagram: Generate new long-lived token
   - Facebook: Exchange short-lived token for new long-lived token

### Automation (Future Enhancement)
Consider building a token refresh automation:
- Check token expiry weekly
- Auto-refresh when < 7 days remaining
- Store refreshed tokens securely

---

## Security Best Practices

1. **Never commit `.env` to Git**
   - Add `.env` to `.gitignore`
   - Use environment variables in production

2. **Rotate Tokens Regularly**
   - Change tokens every 60 days
   - Revoke old tokens after generating new ones

3. **Use Least Privilege**
   - Only request permissions you need
   - Don't request unnecessary scopes

4. **Monitor Usage**
   - Check API usage in developer dashboards
   - Set up alerts for unusual activity

5. **Store Securely**
   - Use Supabase Secrets for Edge Functions
   - Use Vercel/Netlify environment variables for frontend
   - Never expose tokens in client-side code

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Missing credentials" error | Add all required env variables |
| "Invalid token" | Token expired - regenerate |
| "Permission denied" | Check required permissions/scopes |
| Instagram post fails | Ensure image URL is accessible |
| Facebook post missing link | Verify link URL is valid |
| Token expires quickly | Use long-lived tokens, not short-lived |

---

## Support Resources

- **LinkedIn API Docs:** https://docs.microsoft.com/en-us/linkedin/
- **Instagram Graph API:** https://developers.facebook.com/docs/instagram-api/
- **Facebook Graph API:** https://developers.facebook.com/docs/graph-api/
- **Graph API Explorer:** https://developers.facebook.com/tools/explorer/

---

## Next Steps

After setting up credentials:
1. Test publishing from admin dashboard
2. Verify posts appear on all platforms
3. Set up token refresh reminders
4. Monitor for errors in admin dashboard

If you encounter issues, check the admin dashboard for detailed error messages that will guide you to the solution.
