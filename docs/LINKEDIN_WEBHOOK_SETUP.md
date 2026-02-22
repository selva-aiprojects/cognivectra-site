# LinkedIn Webhook Setup Guide

Since direct LinkedIn API approval was rejected, we are now using a **Smart Fallback** that sends post data to a webhook.

## Step 1: Create a Bridge in Make.com (Recommended)

1.  **Create a New Scenario** on [Make.com](https://www.make.com/).
2.  **Add a Trigger**: Search for "Webhooks" and select **"Custom Webhook"**.
    - Click **"Add"** and name it "CogniVectra Social Bridge".
    - Copy the **Webhook URL** (it looks like `https://hook.us1.make.com/...`).
3.  **Add an Action**: Search for **"LinkedIn"** and select **"Create a Company Text Post"**.
    - **Connection**: Click "Add" to authorize your LinkedIn business account.
    - **Post Visibility**: Choose `Public`.
    - **Mapping the Dynamic Content**:
        - In the **Post Content** field, click inside the box. A list of "bubbles" from the Webhook will appear.
        - Click the bubble for `post` → `share_text`.
        - Press Enter/Space, then click the bubble for `post` → `url`.
        - *This ensures every post uses the specific title and link from Supabase.*
4.  **Save and Turn On**: Click the Save icon (floppy disk) and set the **Scheduling** switch to **ON**.

## Step 2: Configure Supabase

1.  Go to your **Supabase Dashboard**.
2.  Navigate to **Project Settings** > **Edge Functions** > **Secrets**.
3.  Add a new secret:
    - **Name**: `SOCIAL_WEBHOOK_URL`
    - **Value**: (Paste the Webhook URL you copied in Step 1).

## Alternative: Zapier

If you prefer Zapier:
1.  **Trigger**: "Webhooks by Zapier" (Catch Hook).
2.  **Action**: "LinkedIn" (Create Company Update).
3.  Copy the URL and add it to Supabase as `SOCIAL_WEBHOOK_URL`.

---

**Now, when you click "Publish" in the Admin Dashboard, if the direct API fails, the system will automatically route the post through this bridge!**
