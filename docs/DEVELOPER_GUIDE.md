# 👨‍💻 Developer Guide

This guide covers local environment setup, testing, and troubleshooting for the CogniVectra project.

---

## 💻 Local Environment Setup

### Prerequisites
- Node.js (v18+)
- npm
- Supabase CLI (Optional, for local DB management)

### Installation
1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment:
    - Copy `.env.template` to `.env`.
    - Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
    - Add `OPENAI_API_KEY` for content generation.

---

## 🗄️ Database Migrations

Before deploying the AI routing layer, the Supabase schema must be updated:
1.  Open the **Supabase SQL Editor**.
2.  Run `supabase/ai_query_logs_migration.sql` to create query audit logs.
3.  Run `supabase/ai_feature_flags_migration.sql` to setup the LoRA routing toggle.
4.  Verify tables appear in the Database Browser.

---

## 🧪 Testing & Verification

### 1. Edge Function Testing
We use a specialized script to test the `publish-social` function without needing a browser:
```bash
# General test for a specific post and platform
node scripts/test-edge-function.js <POST_ID> <PLATFORM>

# Example: npm run test:edge 22 linkedin
```

### 2. Password Reset Flow
The reset page is located at `/reset-password`. It expects a recovery token from Supabase Auth.
- **Trigger**: Use the "Reset Password" button on the Login page to send yourself an email.
- **Verify**: The link in the email should land on the premium reset UI.

### 3. Favicon Verification
- Check `index.html` to ensure the favicon path points to `public/favicon.ico`.
- Clear browser cache if the old icon persists.

---

## 🔧 Troubleshooting

### common Errors
- **Vite Import Errors**: If you see "Module not found" for video files, ensure unused imports are removed from `Industries.jsx` or `WhoWeAre.jsx`.
- **401 Unauthorized**: Check your `VITE_SUPABASE_ANON_KEY`. If in the bridge, check Make.com connections.
- **422 Duplicate Content**: LinkedIn blocks duplicate posts. Use a fresh `POST_ID` for testing.

---

## 📑 Manual Verification Checklist
- [ ] Runs locally with `npm run dev`.
- [ ] Login/Logout works via Supabase Auth.
- [ ] AI posts save to `posts` table as drafts.
- [ ] Social bridge reports "Success" in terminal.
