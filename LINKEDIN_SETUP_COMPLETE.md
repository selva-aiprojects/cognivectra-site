# 🚀 LinkedIn Automated Posting - Complete Setup Guide

## 📊 Current Status Analysis (Jan 23, 2026)

### ✅ What You Already Have
- **Organization Verified:** Cognivectra Innovations & Solutions (URN: `urn:li:organization:111480172`)
- **Two Existing Apps:**
  - **CogniVectra Content Bot** (App ID: 229849102)
    - Products: Share on LinkedIn, Sign In with LinkedIn
    - Scopes: `openid`, `profile`, `email`, `w_member_social`
  - **Blog_Post** (App ID: 229869397)
    - Products: Share on LinkedIn, Advertising API

### ❌ Critical Missing Piece
**Community Management API** - This is THE product you need for posting to company pages.

**Why it's not added:** LinkedIn requires Community Management API to be the **ONLY** product on an app for security reasons. Your existing apps already have other products, so you cannot add it to them.

---

## 🎯 THE SOLUTION: Create a Dedicated App

You need to create a **brand new LinkedIn Developer App** specifically for the Community Management API.

---

## 📝 Step-by-Step Instructions

### **Step 1: Create New LinkedIn Developer App**

1. **Go to:** https://www.linkedin.com/developers/apps/new

2. **Fill in the form:**
   - **App name:** `CogniVectra Community Bot` (or any name you prefer)
   - **LinkedIn Page:** Select "Cognivectra Innovations & Solutions"
   - **App logo:** Upload your company logo (required field)
     - You can download it from: https://www.linkedin.com/company/111480172/
     - Or use your existing logo file
   - **Privacy policy URL:** `https://www.cognivectra.com/privacy` (or your actual privacy policy URL)
   - **App description:** "Automated content publishing bot for CogniVectra social media"

3. **Check the agreement box** and click **"Create app"**

---

### **Step 2: Add Community Management API**

1. Once the app is created, you'll be on the app dashboard
2. Click on the **"Products"** tab
3. Scroll down to **"Available products"**
4. Find **"Community Management API"**
5. Click **"Request access"**
6. Fill out the access request form:
   - **Use case:** "Automated blog post publishing to company page"
   - **Development tier:** Select this option (it's free and typically auto-approved)
7. Submit the request

**Expected wait time:** Usually instant to a few hours for Development tier

---

### **Step 3: Configure OAuth Settings**

1. Go to the **"Auth"** tab of your new app
2. Scroll to **"OAuth 2.0 settings"**
3. Under **"Authorized redirect URLs for your app"**, click **"Add redirect URL"**
4. Add: `http://localhost:3000/callback`
5. Click **"Update"**

---

### **Step 4: Get Your Credentials**

1. In the **"Auth"** tab, you'll see:
   - **Client ID** (copy this)
   - **Client Secret** (click "Show" to reveal, then copy)

---

### **Step 5: Update Your .env File**

Create or update the `.env` file in your project root:

```env
# LinkedIn Community Management API Credentials
LINKEDIN_CLIENT_ID=your_new_client_id_here
LINKEDIN_CLIENT_SECRET=your_new_client_secret_here
LINKEDIN_COMPANY_URN=urn:li:organization:111480172

# These will be generated in the next step
LINKEDIN_ACCESS_TOKEN=
LINKEDIN_PERSON_URN=
```

**Important:** Replace `your_new_client_id_here` and `your_new_client_secret_here` with the actual values from Step 4.

---

### **Step 6: Generate Access Token**

Once the Community Management API is approved (you'll get an email), run:

```bash
cd d:\Training\working\cognivectra-site
node scripts/generate_linkedin_token.js
```

**Follow the prompts:**
1. The script will output an authorization URL
2. Open that URL in your browser
3. Log in to LinkedIn and authorize the app
4. You'll be redirected to `http://localhost:3000/callback?code=...`
5. Copy the `code` parameter from the URL
6. Run: `node scripts/generate_linkedin_token.js --exchange-code YOUR_CODE`
7. Copy the access token it generates

**Update your .env:**
```env
LINKEDIN_ACCESS_TOKEN=the_token_you_just_generated
```

---

### **Step 7: Test the Integration**

Run the test script:

```bash
node scripts/test_linkedin_setup.js
```

**Expected output:**
```
✅ LinkedIn token is valid
✅ Test post created successfully
✅ Test post deleted
🎉 LinkedIn integration is ready!
```

---

## 🔧 Troubleshooting

### Issue: "Request access" button is still disabled
**Solution:** Make sure you're creating a **brand new app** with NO other products added.

### Issue: Access token expires
**Solution:** LinkedIn tokens expire after 60 days. You'll need to regenerate them periodically, or implement refresh token logic.

### Issue: "Insufficient permissions" error
**Solution:** Make sure your access token was generated AFTER the Community Management API was approved.

### Issue: Can't find company URN
**Solution:** Your company URN is `urn:li:organization:111480172` (already confirmed)

---

## 📚 Key Scopes You'll Get

With the Community Management API, your access token will have:
- `w_organization_social` - Post to company pages ✅
- `rw_organization_admin` - Manage organization settings
- `r_organization_social` - Read company page data

These are the exact scopes needed for automated posting!

---

## 🎉 What Happens After Setup

Once complete, your Admin Dashboard's **"📢 Social"** button will:
1. Post to your CogniVectra company page on LinkedIn
2. Post to Facebook (when configured)
3. Post to Instagram (when configured)

The "(Simulated)" label will be removed, and posts will go live! 🚀

---

## 📞 Need Help?

- **LinkedIn Developer Docs:** https://learn.microsoft.com/en-us/linkedin/marketing/community-management/
- **Your existing scripts:** Check `scripts/` folder for helper tools
- **Supabase Edge Function:** The posting logic is in `supabase/functions/publish-social/index.ts`

---

## ⏱️ Estimated Time to Complete

- **Creating the app:** 5 minutes
- **Waiting for API approval:** 0-2 hours (usually instant for Development tier)
- **Generating token:** 2 minutes
- **Testing:** 1 minute

**Total:** ~10 minutes of active work + potential wait time

---

**Last Updated:** January 23, 2026
**Status:** Ready to implement ✅
