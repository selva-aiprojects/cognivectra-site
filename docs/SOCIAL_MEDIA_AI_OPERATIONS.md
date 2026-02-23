# 🤖 Social Media & AI Operations Guide

This guide covers the automated publishing system for CogniVectra, including the LinkedIn bridge, Meta integrations, and the AI content engine.

---

## 🔗 LinkedIn "Smart Bridge" (Webhook)

Since direct API approval was rejected, we use a **Make.com** bridge.

### 1. Make.com Scenario Setup
1.  **Trigger**: Custom Webhook (Name: "CogniVectra Social Bridge")
2.  **Action**: LinkedIn -> "Create a Company Text Post"
3.  **Mapping (Critical)**:
    - Text: `post.share_text`
    - URL: `post.url`
4.  **Activation**: Flip the Scheduling switch to **ON** and click **Save**.

### 2. Supabase Configuration
- **Secret Name**: `SOCIAL_WEBHOOK_URL`
- **Value**: Your Make.com Webhook URL.

---

## 📱 Meta Integration (FB & IG)

### Prerequisites
- Instagram **Business** Account connected to a Facebook Page.
- Facebook Developer App with "Graph API" and "Instagram Graph API" products.

### Setup Steps
1.  **Generate Tokens**: Use Facebook's Graph API Explorer to get a **Long-lived Page Access Token**.
2.  **Supabase Secrets**:
    - `FACEBOOK_ACCESS_TOKEN` / `FACEBOOK_PAGE_ID`
    - `INSTAGRAM_ACCESS_TOKEN` / `INSTAGRAM_BUSINESS_ACCOUNT_ID`
    - `DEFAULT_POST_IMAGE_URL` (Required for Instagram)

---

## ⚡ AI Content Engine

### 1. Generation Workflow
- Run: `npm run generate-post:enhanced`
- AI generates a blog version + 3 social media versions.
- Saves to Supabase with status `pending_review`.

### 2. Admin Review Process
1. Go to `/admin` dashboard.
2. Review/Edit content in the **Pending Review** tab.
3. Click **Approve** to publish live to Blog, LinkedIn, FB, and IG.

### 3. Automatic Scheduling
- Run: `npm run schedule-posts` to start the daily 9 AM (UTC) agent.

---

## 🛠️ Maintenance & Token Refresh
- **LinkedIn Bridge**: No token refresh needed (Make.com handles it).
---

## 🚀 Outreach & Growth Strategy (Omni-Channel)

The platform is designed to reach customers across multiple touchpoints:

### 📡 Active Channels
*   **Tactical Blog**: High-trust thought leadership hosted on `cognivectra.com`.
*   **LinkedIn Bridge**: Automated B2B reach using the "Smart Bridge" Make.com flow.
*   **Meta Engine**: Automated B2C/Visual reach to Facebook and Instagram.

### 📈 Future Expansion Options
To further scale customer acquisition, the following integrations are recommended:
1.  **Email Newsletters**: Connect the Demo Request database to **Resend** or **SendGrid** for automated blog digests.
2.  **SEO Syndication**: Push posts to **Medium.com** or **Dev.to** with canonical links to build domain authority.
3.  **Google Business**: Automate updates to Google Maps/Search results for local Consulting visibility.
4.  **Community Webhooks**: Send automated alerts to Slack/Discord communities upon new publication.
