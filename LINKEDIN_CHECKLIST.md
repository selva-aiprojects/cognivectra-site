# ✅ LinkedIn Automated Posting - Quick Checklist

## 🎯 What's Missing (Summary)

**Main Issue:** You need the **Community Management API** product, which requires a dedicated LinkedIn Developer App.

---

## 📋 Action Items

### ☐ **1. Create New LinkedIn Developer App**
- [ ] Go to https://www.linkedin.com/developers/apps/new
- [ ] Name: `CogniVectra Community Bot`
- [ ] Link to: Cognivectra Innovations & Solutions
- [ ] Upload logo (required)
- [ ] Add privacy policy URL
- [ ] Create app

### ☐ **2. Add Community Management API**
- [ ] Go to Products tab
- [ ] Find "Community Management API"
- [ ] Click "Request access"
- [ ] Select "Development tier"
- [ ] Submit request
- [ ] Wait for approval (usually instant)

### ☐ **3. Configure OAuth**
- [ ] Go to Auth tab
- [ ] Add redirect URL: `http://localhost:3000/callback`
- [ ] Save

### ☐ **4. Get Credentials**
- [ ] Copy Client ID from Auth tab
- [ ] Copy Client Secret from Auth tab
- [ ] Save these securely

### ☐ **5. Create .env File**
- [ ] Create `.env` in project root
- [ ] Add LINKEDIN_CLIENT_ID
- [ ] Add LINKEDIN_CLIENT_SECRET
- [ ] Add LINKEDIN_COMPANY_URN=urn:li:organization:111480172

### ☐ **6. Generate Access Token**
- [ ] Run: `node scripts/generate_linkedin_token.js`
- [ ] Open the authorization URL
- [ ] Authorize the app
- [ ] Copy the code from redirect URL
- [ ] Run: `node scripts/generate_linkedin_token.js --exchange-code YOUR_CODE`
- [ ] Copy the access token
- [ ] Add to .env as LINKEDIN_ACCESS_TOKEN

### ☐ **7. Test Integration**
- [ ] Run: `node scripts/test_linkedin_setup.js`
- [ ] Verify ✅ success messages
- [ ] Try posting from Admin Dashboard

---

## 🚨 Critical Points

1. **Must create a NEW app** - Cannot use existing apps (CogniVectra Content Bot or Blog_Post)
2. **Community Management API must be the ONLY product** on the app
3. **Token must be generated AFTER** API approval
4. **Company URN is:** `urn:li:organization:111480172`

---

## ⏱️ Time Estimate
- Active work: ~10 minutes
- Waiting for approval: 0-2 hours (usually instant)

---

## 📞 Resources
- Full guide: `LINKEDIN_SETUP_COMPLETE.md`
- LinkedIn Developers: https://www.linkedin.com/developers/apps
- Your scripts: `scripts/generate_linkedin_token.js`, `scripts/test_linkedin_setup.js`

---

**Status:** Ready to start ✅
**Next Step:** Create the new LinkedIn Developer App
