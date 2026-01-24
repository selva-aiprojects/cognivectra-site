# 📸 Instagram API Setup Guide

## Overview
To post to Instagram automatically, you need to use the **Instagram Graph API** (part of Meta/Facebook). This requires a Facebook Business Page connected to your Instagram Business account.

---

## 🎯 Prerequisites

1. ✅ **Instagram Business Account** (not personal account)
2. ✅ **Facebook Business Page** linked to your Instagram account
3. ✅ **Meta Developer Account**

---

## 📋 Step-by-Step Setup

### **Step 1: Convert to Instagram Business Account**

If you haven't already:

1. Open Instagram app on your phone
2. Go to **Settings** → **Account**
3. Select **Switch to Professional Account**
4. Choose **Business**
5. Link to your Facebook Business Page

---

### **Step 2: Create Facebook Business Page** (if you don't have one)

1. Go to: https://www.facebook.com/pages/create
2. Create a page for "Cognivectra Innovations & Solutions"
3. Fill in business details
4. Publish the page

---

### **Step 3: Link Instagram to Facebook Page**

1. Go to your Facebook Business Page
2. Click **Settings** (left sidebar)
3. Click **Instagram** (left sidebar)
4. Click **Connect Account**
5. Log in to your Instagram Business account
6. Authorize the connection

---

### **Step 4: Create Meta Developer App**

1. **Go to Meta Developers:**
   - Visit: https://developers.facebook.com/
   - Log in with your Facebook account

2. **Create New App:**
   - Click **My Apps** → **Create App**
   - Select **Business** as app type
   - Click **Next**

3. **Fill in App Details:**
   - **App Name:** `Cognivectra Social Publisher`
   - **App Contact Email:** Your business email
   - **Business Account:** Select or create one
   - Click **Create App**

4. **Add Instagram Product:**
   - In the app dashboard, find **Instagram Graph API**
   - Click **Set Up**

---

### **Step 5: Get Instagram Business Account ID**

1. **Add Instagram Tester:**
   - Go to **Instagram Graph API** → **Settings**
   - Under **Instagram Testers**, add your Instagram account
   - Accept the invitation in Instagram app (Settings → Apps and Websites → Tester Invites)

2. **Get Account ID:**
   - Go to: https://developers.facebook.com/tools/explorer/
   - Select your app from the dropdown
   - Click **Generate Access Token**
   - Select permissions:
     - `instagram_basic`
     - `instagram_content_publish`
     - `pages_read_engagement`
     - `pages_show_list`
   - Click **Generate Token**
   - Copy the token (temporary, we'll make it permanent later)

3. **Find Instagram Account ID:**
   - In Graph API Explorer, paste this query:
     ```
     me/accounts
     ```
   - Click **Submit**
   - Find your Facebook Page ID in the response
   - Then query:
     ```
     <PAGE_ID>?fields=instagram_business_account
     ```
   - Copy the `instagram_business_account` ID

---

### **Step 6: Generate Long-Lived Access Token**

1. **Get Long-Lived User Token:**
   - Go to: https://developers.facebook.com/tools/debug/accesstoken/
   - Paste your short-lived token
   - Click **Extend Access Token**
   - Copy the new long-lived token (valid for 60 days)

2. **Get Page Access Token:**
   - In Graph API Explorer, use your long-lived token
   - Query: `me/accounts`
   - Find your page and copy its `access_token`
   - This is your **permanent** page access token!

---

### **Step 7: Get Your Credentials**

You'll need these values for your `.env` file:

```bash
# Instagram API Configuration
INSTAGRAM_ACCESS_TOKEN=<your_page_access_token>
INSTAGRAM_BUSINESS_ACCOUNT_ID=<your_instagram_business_account_id>
META_APP_ID=<your_app_id>
META_APP_SECRET=<your_app_secret>
```

**Where to find them:**
- **ACCESS_TOKEN:** From Step 6 (Page Access Token)
- **BUSINESS_ACCOUNT_ID:** From Step 5
- **APP_ID:** Meta Developer App Dashboard → Settings → Basic
- **APP_SECRET:** Meta Developer App Dashboard → Settings → Basic → Show

---

## 🔐 Required Permissions

Make sure your access token has these permissions:
- ✅ `instagram_basic`
- ✅ `instagram_content_publish`
- ✅ `pages_read_engagement`
- ✅ `pages_show_list`

---

## 📝 Instagram API Endpoints

### **Create Media Container (Step 1):**
```
POST https://graph.facebook.com/v18.0/{instagram-business-account-id}/media
```

**Parameters:**
- `image_url`: URL to your image (must be publicly accessible)
- `caption`: Your post caption
- `access_token`: Your page access token

### **Publish Media (Step 2):**
```
POST https://graph.facebook.com/v18.0/{instagram-business-account-id}/media_publish
```

**Parameters:**
- `creation_id`: The ID from Step 1
- `access_token`: Your page access token

---

## ⚠️ Important Notes

### **Image Requirements:**
- ✅ Format: JPG or PNG
- ✅ Aspect ratio: Between 4:5 and 1.91:1
- ✅ Min resolution: 320px
- ✅ Max file size: 8MB
- ✅ Must be publicly accessible via HTTPS URL

### **Caption Requirements:**
- ✅ Max length: 2,200 characters
- ✅ Max hashtags: 30
- ✅ Max mentions: 20

### **Rate Limits:**
- ✅ 25 posts per 24 hours per Instagram account
- ✅ 200 API calls per hour per user

### **Token Expiry:**
- ⚠️ User tokens expire after 60 days
- ✅ Page tokens don't expire (as long as the app is active)
- ✅ Set up token refresh in your code

---

## 🚀 Quick Start Checklist

- [ ] Instagram account converted to Business
- [ ] Facebook Business Page created
- [ ] Instagram linked to Facebook Page
- [ ] Meta Developer App created
- [ ] Instagram Graph API added to app
- [ ] Instagram account added as tester
- [ ] Permissions granted
- [ ] Long-lived access token generated
- [ ] Instagram Business Account ID obtained
- [ ] Credentials added to `.env` file

---

## 🔗 Useful Links

- **Meta Developer Console:** https://developers.facebook.com/
- **Graph API Explorer:** https://developers.facebook.com/tools/explorer/
- **Access Token Debugger:** https://developers.facebook.com/tools/debug/accesstoken/
- **Instagram Graph API Docs:** https://developers.facebook.com/docs/instagram-api/
- **Content Publishing Guide:** https://developers.facebook.com/docs/instagram-api/guides/content-publishing

---

## 📞 Need Help?

If you get stuck:
1. Check Meta's official documentation
2. Verify all permissions are granted
3. Make sure your Instagram account is Business (not Creator or Personal)
4. Ensure Facebook Page is properly linked to Instagram

---

**Once you have all the credentials, let me know and I'll create the Instagram posting code!** 🎨
