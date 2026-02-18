# 📋 Google Forms Setup for Demo Requests

## 🎯 Purpose
Collect and track demo requests from interested users across all platforms with automatic lead capture.

---

## 📝 Step 1: Create Google Form

### 1.1 Create New Form
1. Go to: https://forms.google.com
2. Click "Blank form"
3. Title: **"CogniVectra Demo Request"**
4. Description: **"Get a personalized walkthrough of our AI-powered platforms"**

### 1.2 Add Form Fields

#### Field 1: Full Name (Required)
- **Question:** Full Name
- **Type:** Short answer
- **Required:** ✅ Yes
- **Field ID:** `entry.2005620554`

#### Field 2: Email Address (Required)
- **Question:** Email Address  
- **Type:** Short answer
- **Validation:** Email
- **Required:** ✅ Yes
- **Field ID:** `entry.1045781291`

#### Field 3: Phone Number (Required)
- **Question:** Phone Number
- **Type:** Short answer
- **Validation:** Number
- **Required:** ✅ Yes
- **Field ID:** `entry.1065046570`

#### Field 4: Organization/Company (Required)
- **Question:** Organization/Company
- **Type:** Short answer
- **Required:** ✅ Yes
- **Field ID:** `entry.839330770`

#### Field 5: Platform Interested In (Required)
- **Question:** Platform Interested In
- **Type:** Dropdown
- **Options:**
  - StoreAI - Retail Management
  - StockSteward AI - Trading Platform
  - MedFlow EMR - Healthcare Platform
  - OmniCore - Enterprise Orchestration
  - General Inquiry
- **Required:** ✅ Yes
- **Field ID:** `entry.1166974658`

#### Field 6: Company Size (Required)
- **Question:** Company Size
- **Type:** Multiple choice
- **Options:**
  - 1-10 employees
  - 11-50 employees
  - 51-200 employees
  - 201-500 employees
  - 500+ employees
- **Required:** ✅ Yes
- **Field ID:** `entry.1846943667`

#### Field 7: Implementation Timeline (Required)
- **Question:** Implementation Timeline
- **Type:** Multiple choice
- **Options:**
  - Immediate (within 1 month)
  - Soon (1-3 months)
  - Planning (3-6 months)
  - Exploring options
- **Required:** ✅ Yes
- **Field ID:** `entry.2080697309`

#### Field 8: Additional Information (Optional)
- **Question:** Additional Information
- **Type:** Paragraph
- **Required:** ❌ No
- **Field ID:** `entry.1375920428`

---

## 🔗 Step 2: Get Form URL and Field IDs

### 2.1 Get Pre-filled URL
1. Click "Get pre-filled link" (top right)
2. Fill in sample data for all fields
3. Click "Get link"
4. Copy the URL - it contains your field IDs

### 2.2 Extract Field IDs
Your pre-filled URL will look like:
```
https://docs.google.com/forms/d/e/1FAIpQLSdX4YzXqJ7Qk8l9w6R3kLmNpOqRtSvWxBxYzZcVfNqLwKg/viewform?entry.2005620554=John&entry.1045781291=john@example.com...
```

The numbers after `entry.` are your field IDs:
- Name: `2005620554`
- Email: `1045781291`
- Phone: `1065046570`
- Organization: `839330770`
- Platform: `1166974658`
- Company Size: `1846943667`
- Timeline: `2080697309`
- Message: `1375920428`

### 2.3 Get Form Response URL
1. Click "Responses" tab
2. Click "Get email notifications for responses"
3. The form action URL will be:
```
https://docs.google.com/forms/u/0/d/e/1FAIpQLSdX4YzXqJ7Qk8l9w6R3kLmNpOqRtSvWxBxYzZcVfNqLwKg/formResponse
```

---

## ⚙️ Step 3: Update Component Configuration

### 3.1 Update DemoRequestModal.jsx
Replace the placeholder form URL in `src/components/DemoRequestModal.jsx`:

```javascript
// Line ~65 - Update this URL with your actual form URL
const googleFormURL = 'https://docs.google.com/forms/u/0/d/e/YOUR_ACTUAL_FORM_ID/formResponse';
```

### 3.2 Update Field IDs (if different)
If your field IDs are different, update the formPayload section:

```javascript
// Line ~68-75 - Update with your actual field IDs
formPayload.append('entry.2005620554', formData.name); // Name
formPayload.append('entry.1045781291', formData.email); // Email
formPayload.append('entry.1065046570', formData.phone); // Phone
formPayload.append('entry.839330770', formData.organization); // Organization
formPayload.append('entry.1166974658', platforms[formData.platform]); // Platform
formPayload.append('entry.1846943667', formData.companySize); // Company Size
formPayload.append('entry.2080697309', formData.timeline); // Timeline
formPayload.append('entry.1375920428', formData.message); // Message
```

---

## 📊 Step 4: Set Up Response Tracking

### 4.1 Google Sheets Integration
1. In your Google Form, click "Responses" tab
2. Click "Link to Sheets"
3. Create new spreadsheet: "CogniVectra Demo Requests"
4. This will automatically capture all submissions

### 4.2 Email Notifications
1. Click "Get email notifications for responses"
2. Add your email: contact@cognivectra.com
3. You'll get instant alerts for new demo requests

### 4.3 Response Dashboard
Your Google Sheet will have columns:
- Timestamp
- Full Name
- Email Address
- Phone Number
- Organization/Company
- Platform Interested In
- Company Size
- Implementation Timeline
- Additional Information

---

## 🔧 Step 5: Backend API Endpoint (Optional)

For better lead management, create an API endpoint:

### 5.1 Create API Route
```javascript
// src/pages/api/demo-request.js (if using Next.js)
// or supabase/functions/demo-request (if using Supabase)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, phone, organization, platform, companySize, timeline, message } = req.body;
    
    // Save to database
    // Send notification email
    // Add to CRM
    // Trigger follow-up sequence
    
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

---

## 📱 Step 6: Test Integration

### 6.1 Test Form Submission
1. Open your site locally
2. Click any "Request Demo" button
3. Fill out the form completely
4. Submit and verify:
   - Success message appears
   - Google Form receives submission
   - Google Sheet updates
   - Email notification arrives

### 6.2 Test Different Platforms
Test each platform link to ensure correct platform is pre-selected:
- StoreAI: `/contact?product=storeai`
- StockSteward: `/contact?product=stocksteward`
- MedFlow: `/contact?product=medflow`

---

## 🎯 Step 7: Lead Follow-up Process

### 7.1 Immediate Response
- ✅ Auto-reply email with confirmation
- ✅ Internal notification to sales team
- ✅ Lead added to CRM/pipeline

### 7.2 24-Hour Follow-up
- ✅ Personalized email from team member
- ✅ Demo scheduling link (Calendly)
- ✅ Platform-specific preparation materials

### 7.3 Demo Preparation
- ✅ Research prospect's organization
- ✅ Prepare platform-specific demo
- ✅ Customize use cases based on company size/timeline

---

## 📈 Analytics & Optimization

### Key Metrics to Track:
- Form conversion rate (visits → submissions)
- Platform preference breakdown
- Company size distribution
- Timeline analysis
- Source attribution (which page/button)

### Optimization Ideas:
- A/B test form fields
- Add social proof testimonials
- Implement progressive profiling
- Add chatbot pre-qualification

---

## 🚀 Quick Start Checklist

- [ ] Create Google Form with all fields
- [ ] Get form response URL and field IDs
- [ ] Update DemoRequestModal.jsx with correct URLs
- [ ] Set up Google Sheets integration
- [ ] Configure email notifications
- [ ] Test form submission for each platform
- [ ] Set up lead follow-up process
- [ ] Monitor and optimize conversion rates

---

**Last Updated:** February 2026
**Status:** Ready for implementation
