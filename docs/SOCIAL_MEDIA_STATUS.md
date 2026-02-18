# 🚀 Social Media Integration Status

**Last Updated:** January 23, 2026, 11:15 PM IST

---

## ✅ **Completed Integrations**

### **1. LinkedIn** ✅
- **Status:** Credentials configured (pending API approval)
- **App Name:** Cognivectra - Blogs
- **App ID:** 230104127
- **Client ID:** 863gvz18ow9qi4
- **Client Secret:** ✅ Configured in `.env`
- **Company URN:** urn:li:organization:111480172

**⚠️ Pending:**
- Community Management API approval (stuck on "Fetching access request form")
- Generate access token once API is approved

**Next Steps:**
1. Wait for LinkedIn portal issue to resolve (try again tomorrow)
2. OR contact LinkedIn Developer Support
3. Once approved, generate access token using `scripts/generate_linkedin_token.js`

---

### **2. Instagram** 🔄
- **Status:** Code ready, awaiting credentials
- **Implementation:** ✅ Complete in `supabase/functions/publish-social/index.ts`
- **Setup Guide:** ✅ See `INSTAGRAM_API_SETUP.md`

**Required Credentials:**
```bash
INSTAGRAM_ACCESS_TOKEN=<get from Meta Developer>
INSTAGRAM_BUSINESS_ACCOUNT_ID=<get from Graph API Explorer>
META_APP_ID=<get from Meta App Dashboard>
META_APP_SECRET=<get from Meta App Dashboard>
```

**Setup Steps:**
1. Convert Instagram to Business Account
2. Create Facebook Business Page
3. Link Instagram to Facebook Page
4. Create Meta Developer App
5. Add Instagram Graph API
6. Generate long-lived access token
7. Get Instagram Business Account ID
8. Update `.env` with credentials

**Detailed Guide:** See `INSTAGRAM_API_SETUP.md`

---

### **3. Facebook** 🔄
- **Status:** Code ready, awaiting credentials
- **Implementation:** ✅ Complete in `supabase/functions/publish-social/index.ts`

**Required Credentials:**
```bash
FACEBOOK_ACCESS_TOKEN=<same as Instagram - Page Access Token>
FACEBOOK_PAGE_ID=<your Facebook Page ID>
```

**Note:** Facebook uses the same Meta Developer app as Instagram!

---

## 📋 **Current `.env` Configuration**

```bash
# LinkedIn API Configuration
LINKEDIN_CLIENT_ID=863gvz18ow9qi4
LINKEDIN_CLIENT_SECRET=WPL_AP1.Bm7TWBI4yDpdIvdJ.+pMOXA==
LINKEDIN_ACCESS_TOKEN=<pending - generate after API approval>
LINKEDIN_PERSON_URN=urn:li:person:8305641
LINKEDIN_COMPANY_URN=urn:li:organization:111480172

# Instagram API Configuration
INSTAGRAM_ACCESS_TOKEN=your_instagram_page_access_token_here
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_instagram_business_account_id_here
META_APP_ID=your_meta_app_id_here
META_APP_SECRET=your_meta_app_secret_here

# Facebook API Configuration  
FACEBOOK_ACCESS_TOKEN=your_facebook_page_access_token_here
FACEBOOK_PAGE_ID=your_facebook_page_id_here

# Default image for social posts (optional)
DEFAULT_POST_IMAGE_URL=https://cogni-vectra.vercel.app/logo.png
```

---

## 🎯 **How It Works**

### **Publishing Flow:**

1. **Admin creates/edits blog post** in Admin Dashboard
2. **Clicks "📢 Social" button**
3. **Selects platforms:** LinkedIn, Instagram, Facebook
4. **Edge Function processes:**
   - Fetches post data from Supabase
   - Formats content for each platform
   - Publishes to selected platforms
   - Tracks results in `social_media_posts` table

### **Platform-Specific Formatting:**

**LinkedIn:**
- Uses `social_media_data.linkedin` or post excerpt
- Text-only post with link
- Max 3000 characters

**Instagram:**
- Requires image (uses `post.image_url` or default)
- Uses `social_media_data.instagram` or formatted caption
- Max 2200 characters
- Includes blog link in caption

**Facebook:**
- Uses `social_media_data.facebook` or post excerpt
- Link preview automatically generated
- Includes blog URL

---

## 📁 **Key Files**

### **Backend:**
- `supabase/functions/publish-social/index.ts` - Main publishing logic
- `.env` - API credentials (local development)
- Supabase Edge Function Secrets - API credentials (production)

### **Frontend:**
- `src/pages/Admin.jsx` - Admin dashboard with Social button
- `src/components/AdminPostEditor.jsx` - Post editor

### **Documentation:**
- `INSTAGRAM_API_SETUP.md` - Instagram setup guide
- `LINKEDIN_FINAL_STEPS.md` - LinkedIn setup guide
- `SOCIAL_MEDIA_STATUS.md` - This file

---

## 🔧 **Testing**

### **Test Instagram (once credentials are added):**

```bash
# Test from local
curl -X POST http://localhost:54321/functions/v1/publish-social \
  -H "Content-Type: application/json" \
  -d '{"postId": "1", "platforms": ["instagram"]}'
```

### **Test Facebook (once credentials are added):**

```bash
curl -X POST http://localhost:54321/functions/v1/publish-social \
  -H "Content-Type: application/json" \
  -d '{"postId": "1", "platforms": ["facebook"]}'
```

---

## ⚠️ **Important Notes**

### **Rate Limits:**
- **LinkedIn:** 100 posts per day per user
- **Instagram:** 25 posts per 24 hours
- **Facebook:** No specific limit for pages

### **Token Expiry:**
- **LinkedIn:** 60 days (need to regenerate)
- **Instagram:** Page tokens don't expire (if app is active)
- **Facebook:** Page tokens don't expire (if app is active)

### **Image Requirements:**
- **Instagram:** Required, 320px min, 8MB max, HTTPS URL
- **Facebook:** Optional, auto-generates preview from link
- **LinkedIn:** Optional (not implemented yet)

---

## 📞 **Support Resources**

### **LinkedIn:**
- Developer Portal: https://www.linkedin.com/developers/apps/230104127
- API Docs: https://learn.microsoft.com/en-us/linkedin/

### **Instagram/Facebook:**
- Meta Developer Console: https://developers.facebook.com/
- Graph API Explorer: https://developers.facebook.com/tools/explorer/
- Instagram API Docs: https://developers.facebook.com/docs/instagram-api/

---

## 🎉 **Next Actions**

### **Priority 1: LinkedIn**
- [ ] Resolve "Fetching access request form" issue
- [ ] Get Community Management API approved
- [ ] Generate access token
- [ ] Test posting to company page

### **Priority 2: Instagram**
- [ ] Follow setup guide in `INSTAGRAM_API_SETUP.md`
- [ ] Get Meta Developer credentials
- [ ] Update `.env` with credentials
- [ ] Deploy to Supabase Edge Function secrets
- [ ] Test posting

### **Priority 3: Facebook**
- [ ] Use same Meta app as Instagram
- [ ] Get Facebook Page ID
- [ ] Update `.env` with credentials
- [ ] Test posting

---

**Status:** 1/3 platforms ready (LinkedIn pending approval, Instagram/Facebook pending credentials)

**Estimated Time to Complete:** 
- LinkedIn: 1-2 days (waiting for portal)
- Instagram: 30-60 minutes (setup + testing)
- Facebook: 10 minutes (uses same Meta app)

---

**Created by:** Antigravity AI Assistant  
**Project:** CogniVectra Social Media Integration
