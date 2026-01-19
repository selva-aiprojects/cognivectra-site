# Social Media Automation Guide

Since you want to automatically post to LinkedIn, Instagram, and Facebook **after** you review and publish a post, we recommend using a webhook-based workflow.

## The Workflow
1. **AI Agent** generates a Draft → Saves to Supabase.
2. **You** review and click "Publish" in the Admin Dashboard.
3. **Supabase** (or the App) triggers a Webhook.
4. **Make.com / Zapier** receives the webhook → Posts to Social Media.

## Setup Steps

### 1. Create a Make (formerly Integromat) or Zapier Account
Make.com is usually cheaper and more flexible for multiple social accounts.

### 2. Create a "Scenario" or "Zap"
- **Trigger**: "Custom Webhook"
- **Action 1**: LinkedIn: Create a Share
- **Action 2**: Facebook Pages: Create a Post
- **Action 3**: Instagram for Business: Publish Photo/Media

### 3. Connect Supabase
You have two options to trigger this:

**Option A: Database Webhooks (Advanced)**
- Go to Supabase Dashboard > Database > Webhooks.
- Create a webhook that fires on `UPDATE` to the `posts` table where `status` changes to `published`.
- Point it to your Make/Zapier Webhook URL.

**Option B: Code Trigger (Simpler)**
- We can modify `Admin.jsx` to call the Make/Zapier URL directly when you click "Publish".

### 4. Code Modification (for Option B)
If you choose Option B, update `Admin.jsx`'s `handlePublish` function:

```javascript
/* src/pages/Admin.jsx */
async function handlePublish(post) {
  // ... existing update code ...
  
  // TRIGGER SOCIAL MEDIA
  await fetch('YOUR_MAKE_WEBHOOK_URL', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        title: post.title,
        excerpt: post.excerpt,
        url: `https://cognivectra.com/blog/${post.slug}`
    })
  });
}
```

## Tips for Content
- **LinkedIn**: Supports long text. Send the `excerpt` + link.
- **Instagram**: Requires an image. Ensure your AI agent generates an `image_url` or use a default brand image.
- **Facebook**: Similar to LinkedIn.
