# LinkedIn Integration Setup Guide

## Prerequisites
1. You must be an **Admin** of the LinkedIn Company Page (CogniVectra).
2. You must have a **LinkedIn Developer App** created.

## Phase 1: Configure Developer App
1. Go to [LinkedIn Developers > Apps](https://www.linkedin.com/developers/apps).
2. Select your App.
3. **Products Tab**:
   - Ensure **"Share on LinkedIn"** is Added.
   - Ensure **"Marketing Developer Platform"** is Added (Required for Company Pages).
     - *If missing*: Click "ramRequest access". Fill the form. It is usually auto-approved instantly or takes a few minutes.
4. **Auth Tab**:
   - Scroll to **"Authorized redirect URLs for your app"**.
   - Add: `http://localhost:3000/callback`
   - Click Update.

## Phase 2: Generate Access Token
Your current token likely lacks the `w_organization_social` scope.
1. Open your terminal in VS Code.
2. Run:
   ```bash
   node scripts/generate_linkedin_token.js
   ```
3. Open the Authorization URL generated.
4. Approve the permissions.
5. You will be redirected to `localhost:3000/...`. Copy the `code` parameter from the URL bar.
6. Run:
   ```bash
   node scripts/generate_linkedin_token.js --exchange-code YOUR_COPIED_CODE
   ```
7. Copy the **Access Token** output.

## Phase 3: Update Environment
1. Open `.env` file.
2. Replace `LINKEDIN_ACCESS_TOKEN` with the new token.
3. Ensure `LINKEDIN_COMPANY_URN` is correct (e.g., `urn:li:organization:123456`).

## Phase 4: Test
Run the test script to verify:
```bash
node scripts/create_linkedin_post.js
```
If it says **"✅ Post created successfully!"**, you are done!
