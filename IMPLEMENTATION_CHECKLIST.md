# ✅ AI Content Automation - Implementation Checklist

## Pre-Implementation

- [ ] Review [AI_CONTENT_README.md](./AI_CONTENT_README.md) for overview
- [ ] Read [AI_CONTENT_SETUP.md](./AI_CONTENT_SETUP.md) for detailed setup
- [ ] Ensure you have OpenAI API key (sign up at openai.com if needed)
- [ ] Verify Supabase project is set up and running

---

## Phase 1: Core Setup (Blog Only)

### Environment Setup
- [ ] Create `.env` file in project root
- [ ] Add `VITE_SUPABASE_URL`
- [ ] Add `VITE_SUPABASE_ANON_KEY`
- [ ] Add `OPENAI_API_KEY`
- [ ] Add `.env` to `.gitignore`
- [ ] Restart dev server: `npm run dev`

### Dependencies
- [ ] Run: `npm install axios node-cron`
- [ ] Verify installation: `npm list axios node-cron`

### Database Schema
- [ ] Open Supabase SQL Editor
- [ ] Copy SQL from [AI_CONTENT_SETUP.md](./AI_CONTENT_SETUP.md)
- [ ] Execute migrations
- [ ] Verify new columns appear in `posts` table

### Test Generation
- [ ] Run: `npm run generate-post:enhanced`
- [ ] Check console for success message
- [ ] Verify post appears in Supabase `posts` table
- [ ] Status should be `pending_review`

### Test Admin Dashboard
- [ ] Start dev server: `npm run dev`
- [ ] Go to http://localhost:5173/login
- [ ] Log in with test admin account
- [ ] Go to http://localhost:5173/admin
- [ ] Click "Pending Review" tab
- [ ] See the generated post
- [ ] Click "Approve" button
- [ ] Verify post status changes to `published`
- [ ] View on blog: http://localhost:5173/blog

✅ **Phase 1 Complete!** Blog automation is working.

---

## Phase 2: LinkedIn Integration (Optional)

### Get LinkedIn Credentials
- [ ] Go to https://www.linkedin.com/developers/apps
- [ ] Create new app
- [ ] Add "Share on LinkedIn" or "Ugc Posts" product
- [ ] Go to Auth tab
- [ ] Copy "Access Token"
- [ ] Note: Tokens expire in 60 days

### Configure Environment
- [ ] Add to `.env`: `LINKEDIN_ACCESS_TOKEN=your-token-here`
- [ ] Save and restart dev server

### Test LinkedIn Publishing
- [ ] Generate new post: `npm run generate-post:enhanced`
- [ ] Go to admin: http://localhost:5173/admin
- [ ] Click "Pending Review"
- [ ] Click "✅ Approve" button
- [ ] Watch for LinkedIn success message in console
- [ ] Check LinkedIn profile - post should appear

✅ **Phase 2 Complete!** LinkedIn automation is working.

---

## Phase 3: Instagram Integration (Optional)

### Get Instagram Credentials
- [ ] Go to https://developers.facebook.com
- [ ] Create Business App
- [ ] Add "Instagram Basic Display" product
- [ ] Create Instagram account (Business type, not personal)
- [ ] Get Business Account ID
- [ ] Generate long-lived access token (60+ day valid)
- [ ] Save credentials

### Configure Environment
- [ ] Add to `.env`: `INSTAGRAM_ACCESS_TOKEN=your-token-here`
- [ ] Add to `.env`: `INSTAGRAM_BUSINESS_ACCOUNT_ID=your-account-id`
- [ ] Add to `.env`: `DEFAULT_POST_IMAGE_URL=https://your-domain/image.png`
- [ ] Restart dev server

### Test Instagram Publishing
- [ ] Generate new post: `npm run generate-post:enhanced`
- [ ] Go to admin dashboard
- [ ] Approve post
- [ ] Check Instagram - image + caption should appear

✅ **Phase 3 Complete!** Instagram automation is working.

---

## Phase 4: Facebook Integration (Optional)

### Get Facebook Credentials
- [ ] Go to https://developers.facebook.com
- [ ] Create Business App (or use existing)
- [ ] Add "Graph API" product
- [ ] Create Facebook Page (if not exists)
- [ ] Get Page ID
- [ ] Generate Page Access Token
- [ ] Save credentials

### Configure Environment
- [ ] Add to `.env`: `FACEBOOK_ACCESS_TOKEN=your-token-here`
- [ ] Add to `.env`: `FACEBOOK_PAGE_ID=your-page-id`
- [ ] Restart dev server

### Test Facebook Publishing
- [ ] Generate new post: `npm run generate-post:enhanced`
- [ ] Go to admin dashboard
- [ ] Approve post
- [ ] Check Facebook Page - post with link should appear

✅ **Phase 4 Complete!** Facebook automation is working.

---

## Phase 5: Scheduling (Optional)

### Set Up Daily Generation
- [ ] Create `scripts/scheduler.js` (see [AI_CONTENT_SETUP.md](./AI_CONTENT_SETUP.md))
- [ ] Run: `npm run schedule-posts`
- [ ] This starts cron job for daily post generation at 9 AM

### Test Scheduling
- [ ] Modify cron time to run in 1 minute (for testing)
- [ ] Run scheduler
- [ ] Wait for scheduled execution
- [ ] Verify post appears in admin dashboard
- [ ] Reset cron time to desired schedule

✅ **Phase 5 Complete!** Automated daily scheduling is working.

---

## Validation Checklist

### Core Functionality
- [ ] AI generates unique posts with different topics
- [ ] Admin can review and edit posts
- [ ] Blog posts publish successfully
- [ ] Admin dashboard shows correct post counts

### Social Media (if configured)
- [ ] LinkedIn posts appear in feed
- [ ] Instagram posts appear in feed
- [ ] Facebook posts appear with links
- [ ] All posts have correct content and formatting

### Database
- [ ] Posts table contains all generated posts
- [ ] `status` column reflects current state
- [ ] `published_platforms` shows where each post was published
- [ ] `social_media_posts` table tracks platform-specific data

### Error Handling
- [ ] Missing `.env` shows clear error
- [ ] Invalid API keys show error in console
- [ ] Network errors don't crash the system
- [ ] Invalid JSON from OpenAI is handled gracefully

---

## Production Readiness Checklist

### Before Going Live
- [ ] All `.env` variables are secure and not in Git
- [ ] API keys are current (LinkedIn tokens not expired)
- [ ] Database backups are configured in Supabase
- [ ] Error logging is set up
- [ ] Admin dashboard is accessible only to admins

### Monitoring
- [ ] Check generated posts daily
- [ ] Monitor API usage (OpenAI costs)
- [ ] Track social media reach/engagement
- [ ] Review quality of AI-generated content

### Maintenance
- [ ] Update OpenAI API key if it rotates
- [ ] Refresh LinkedIn tokens every 60 days
- [ ] Monitor Supabase storage usage
- [ ] Archive old posts periodically

---

## Troubleshooting During Setup

### Can't Generate Post
- [ ] Check `.env` file exists and has OPENAI_API_KEY
- [ ] Verify OpenAI account has credits
- [ ] Check internet connection
- [ ] Review error message in console

### Posts Don't Appear in Admin
- [ ] Refresh page (F5)
- [ ] Wait 30 seconds for Supabase sync
- [ ] Check browser console for errors (F12)
- [ ] Verify Supabase connection in dev server logs

### Social Media Publishing Fails
- [ ] Verify token is not expired
- [ ] Check token is in `.env`
- [ ] Verify platform IDs are correct
- [ ] Check API rate limits
- [ ] Review error message in console

### Database Errors
- [ ] Verify all SQL migrations were executed
- [ ] Check Supabase dashboard for table structure
- [ ] Ensure column names match in code
- [ ] Review database error message

---

## Quick Reference

### Key Files
- `scripts/ai_content_agent_enhanced.js` - Content generation
- `src/pages/AdminEnhanced.jsx` - Admin dashboard
- `.env` - Secrets (never commit!)
- `AI_CONTENT_SETUP.md` - Full documentation

### Key Commands
```bash
npm run generate-post:enhanced  # Generate single post
npm run schedule-posts          # Start daily scheduler
npm run dev                     # Start dev server
```

### Key URLs
- Admin: http://localhost:5173/admin
- Blog: http://localhost:5173/blog
- Login: http://localhost:5173/login

---

## Success Criteria

✅ **Phase 1 Success:**
- AI generates blog posts
- Admin can review and approve
- Posts appear on blog

✅ **Phase 2-4 Success:**
- Posts auto-publish to each platform
- Content appears formatted correctly
- No errors in console

✅ **Phase 5 Success:**
- Scheduler runs automatically
- Posts generated daily
- No manual intervention needed

---

## Next Steps After Setup

1. **Generate 5-10 posts** to build blog library
2. **Get feedback** from team on AI quality
3. **Adjust topics** based on what resonates
4. **Monitor engagement** on social platforms
5. **Refine posting schedule** based on analytics
6. **Archive old posts** periodically
7. **Celebrate** your AI-powered content machine! 🎉

---

## Support Resources

- **Setup issues?** → Read [AI_CONTENT_SETUP.md](./AI_CONTENT_SETUP.md)
- **Architecture questions?** → Read [DESIGN_DOCUMENT.md](./DESIGN_DOCUMENT.md)
- **Social media setup?** → Read [SOCIAL_MEDIA_SETUP.md](./SOCIAL_MEDIA_SETUP.md)
- **Quick reference?** → See [AI_CONTENT_README.md](./AI_CONTENT_README.md)

---

**Total Setup Time: 30-60 minutes** ⏱️

Start with Phase 1 (blog only), then add platforms as needed!

🚀 **Ready? Run: `npm run generate-post:enhanced`**
