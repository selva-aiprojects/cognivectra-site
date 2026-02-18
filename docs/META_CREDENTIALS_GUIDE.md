# 🔑 Get Your Meta Developer Credentials - Quick Guide

**Your Facebook Business Account:** https://www.facebook.com/profile.php?id=61587060599699

---

## 🎯 **What You Need to Get:**

```bash
META_APP_ID=<from Meta Developer>
META_APP_SECRET=<from Meta Developer>
INSTAGRAM_BUSINESS_ACCOUNT_ID=<from Graph API>
INSTAGRAM_ACCESS_TOKEN=<from Graph API>
FACEBOOK_ACCESS_TOKEN=<same as Instagram>
FACEBOOK_PAGE_ID=<from Graph API>
```

---

## 📋 **Step-by-Step Instructions**

### **STEP 1: Register as Meta Developer** ⏱️ 2 minutes

1. **Open:** https://developers.facebook.com/
2. **Click "Login"** (top right corner)
3. **Log in** with your Facebook account (ID: 61587060599699)
4. **If prompted, click "Get Started"** or "Register"
5. **Fill in:**
   - Display name: Your name
   - Email: Your business email
   - Accept terms and conditions
6. **Verify your email** if prompted
7. **Click "Submit"**

✅ **You're now a Meta Developer!**

---

### **STEP 2: Create Your App** ⏱️ 3 minutes

1. **Click "My Apps"** (top right corner - should be visible now)
2. **Click "Create App"** (green button)
3. **Select "Business"** as the app type
4. **Click "Next"**
5. **Fill in the form:**
   - **App name:** `CogniVectra Social Publisher`
   - **App contact email:** Your business email
   - **Business Account:** Select existing or create new
6. **Click "Create App"**
7. **Complete security check** if prompted

✅ **App Created!**

---

### **STEP 3: Get App ID and App Secret** ⏱️ 1 minute

You should now be in your app dashboard.

1. **Look at the left sidebar**
2. **Click "Settings" → "Basic"**
3. **You'll see:**
   - **App ID:** Copy this number (e.g., `123456789012345`)
   - **App Secret:** Click "Show" button, copy the secret

**Save these:**
```bash
META_APP_ID=<paste App ID here>
META_APP_SECRET=<paste App Secret here>
```

✅ **Credentials 1 & 2 obtained!**

---

### **STEP 4: Add Instagram Product** ⏱️ 2 minutes

1. **In the left sidebar, scroll down to "Add products"**
2. **Find "Instagram"** in the products list
3. **Click "Set Up"** on the Instagram card
4. **Follow the prompts** to add Instagram Graph API

✅ **Instagram API added!**

---

### **STEP 5: Generate Access Token** ⏱️ 5 minutes

1. **Open Graph API Explorer:** https://developers.facebook.com/tools/explorer/
2. **At the top, select your app** from the dropdown (CogniVectra Social Publisher)
3. **Click "Generate Access Token"**
4. **Select these permissions** (checkboxes):
   - ✅ `instagram_basic`
   - ✅ `instagram_content_publish`
   - ✅ `pages_read_engagement`
   - ✅ `pages_show_list`
5. **Click "Generate Access Token"**
6. **Log in and authorize** if prompted
7. **Copy the token** that appears (it's a long string)

**This is a SHORT-LIVED token (expires in 1 hour). We'll make it permanent in the next steps.**

---

### **STEP 6: Get Your Facebook Page ID** ⏱️ 2 minutes

Still in Graph API Explorer:

1. **In the query box** (where it says "Enter a query"), type:
   ```
   me/accounts
   ```
2. **Click "Submit"** button
3. **Look at the response** - you'll see something like:
   ```json
   {
     "data": [
       {
         "access_token": "EAABsb...",
         "category": "Business",
         "name": "Cognivectra Innovations & Solutions",
         "id": "123456789012345",
         ...
       }
     ]
   }
   ```
4. **Copy the `id` value** - this is your Facebook Page ID

**Save this:**
```bash
FACEBOOK_PAGE_ID=<paste Page ID here>
```

✅ **Facebook Page ID obtained!**

---

### **STEP 7: Get Instagram Business Account ID** ⏱️ 2 minutes

Still in Graph API Explorer:

1. **In the query box**, type (replace with YOUR page ID from Step 6):
   ```
   <YOUR_PAGE_ID>?fields=instagram_business_account
   ```
   Example: `123456789012345?fields=instagram_business_account`

2. **Click "Submit"**
3. **Look at the response:**
   ```json
   {
     "instagram_business_account": {
       "id": "17841400123456789"
     },
     "id": "123456789012345"
   }
   ```
4. **Copy the `instagram_business_account` → `id` value**

**Save this:**
```bash
INSTAGRAM_BUSINESS_ACCOUNT_ID=<paste Instagram ID here>
```

✅ **Instagram Business Account ID obtained!**

---

### **STEP 8: Get Long-Lived Access Token** ⏱️ 3 minutes

The token from Step 5 expires in 1 hour. Let's make it permanent:

1. **Open Access Token Debugger:** https://developers.facebook.com/tools/debug/accesstoken/
2. **Paste the token** from Step 5
3. **Click "Debug"**
4. **Click "Extend Access Token"** at the bottom
5. **Copy the new token** that appears

Now we need to get the PAGE access token (which doesn't expire):

6. **Go back to Graph API Explorer:** https://developers.facebook.com/tools/explorer/
7. **Paste the EXTENDED token** in the "Access Token" field at the top
8. **In the query box, type:** `me/accounts`
9. **Click "Submit"**
10. **Find your page in the results**
11. **Copy the `access_token` value** from your page (NOT the `id`)

**This is your PERMANENT access token!**

**Save this:**
```bash
INSTAGRAM_ACCESS_TOKEN=<paste page access token here>
FACEBOOK_ACCESS_TOKEN=<same page access token>
```

✅ **Permanent access tokens obtained!**

---

## 🎉 **You're Done! Final Checklist:**

- [ ] `META_APP_ID` - From Settings → Basic
- [ ] `META_APP_SECRET` - From Settings → Basic
- [ ] `FACEBOOK_PAGE_ID` - From Graph API `me/accounts` query
- [ ] `INSTAGRAM_BUSINESS_ACCOUNT_ID` - From Graph API query
- [ ] `INSTAGRAM_ACCESS_TOKEN` - Page access token (permanent)
- [ ] `FACEBOOK_ACCESS_TOKEN` - Same as Instagram token

---

## 📝 **Update Your .env File**

Once you have all the values, update your `.env` file:

```bash
# Instagram API Configuration
INSTAGRAM_ACCESS_TOKEN=<your_page_access_token>
INSTAGRAM_BUSINESS_ACCOUNT_ID=<your_instagram_business_account_id>
META_APP_ID=<your_app_id>
META_APP_SECRET=<your_app_secret>

# Facebook API Configuration  
FACEBOOK_ACCESS_TOKEN=<same_as_instagram_token>
FACEBOOK_PAGE_ID=<your_facebook_page_id>
```

---

## ⚠️ **Common Issues**

### **"Instagram Business Account not found"**
- Make sure your Instagram is converted to Business account
- Make sure Instagram is linked to your Facebook Page
- Go to Facebook Page → Settings → Instagram → Connect Account

### **"Invalid permissions"**
- Make sure you selected ALL 4 permissions in Step 5
- Try generating the token again

### **"Token expired"**
- Use the PAGE access token from Step 8, not the user token
- Page tokens don't expire as long as the app is active

---

## 🚀 **Next Steps After Getting Credentials**

1. Update `.env` file with all credentials
2. Deploy credentials to Supabase Edge Function secrets
3. Test Instagram posting from Admin Dashboard
4. Celebrate! 🎉

---

**Need help? Let me know which step you're stuck on!**
