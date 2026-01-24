# Interview Invitation Email Template

## Overview
Professional email template for scheduling interviews with job candidates. Includes CogniVectra branding, logo, and all necessary interview details.

## Template Location
`email-templates/interview-invitation.html`

## Template Variables

Replace these placeholders with actual values when sending the email:

### Candidate Information
- `{{CANDIDATE_NAME}}` - Full name of the candidate (e.g., "John Smith")

### Job Details
- `{{JOB_TITLE}}` - Position title (e.g., "Senior DevOps Engineer")

### Interview Details
- `{{INTERVIEW_DATE}}` - Date of interview (e.g., "Monday, January 27, 2026")
- `{{INTERVIEW_TIME}}` - Time with timezone (e.g., "2:00 PM IST (8:30 AM UTC)")
- `{{DURATION}}` - Interview duration in minutes (e.g., "45" or "60")
- `{{INTERVIEW_FORMAT}}` - Format type (e.g., "Video Call (Google Meet)", "In-Person at Office", "Phone Call")
- `{{INTERVIEWER_NAMES}}` - Names of interviewers (e.g., "Selvakumar B, Principal Architect")
- `{{MEETING_LINK}}` - Video meeting URL (e.g., "https://meet.google.com/abc-defg-hij")

### Sender Information
- `{{SENDER_NAME}}` - Name of person sending email (e.g., "Selvakumar B")
- `{{SENDER_TITLE}}` - Sender's job title (e.g., "Principal Architect" or "Hiring Manager")

## How to Use

### Option 1: Manual Email (Gmail, Outlook, etc.)

1. **Open the template file** in a browser or text editor
2. **Copy the HTML code**
3. **Replace all variables** with actual values
4. **Paste into email client**:
   - Gmail: Use "Insert HTML" or compose in HTML mode
   - Outlook: Paste as HTML
5. **Send the email**

### Option 2: Automated Email (Recommended)

#### Using Web3Forms (like your contact form)

```javascript
const emailHTML = `
  // Paste the template HTML here
  // Replace {{VARIABLES}} with actual values
`;

await fetch("https://api.web3forms.com/submit", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    access_key: process.env.VITE_WEB3FORMS_ACCESS_KEY,
    subject: "Interview Invitation - {{JOB_TITLE}} Position",
    from_name: "CogniVectra Careers",
    to: candidateEmail,
    html: emailHTML
  })
});
```

#### Using Supabase Edge Function

Create a function in `supabase/functions/send-interview-email/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const {
    candidateName,
    candidateEmail,
    jobTitle,
    interviewDate,
    interviewTime,
    duration,
    format,
    interviewers,
    meetingLink,
    senderName,
    senderTitle
  } = await req.json()

  // Read template file
  const template = await Deno.readTextFile('./interview-invitation.html')
  
  // Replace variables
  const emailHTML = template
    .replace(/{{CANDIDATE_NAME}}/g, candidateName)
    .replace(/{{JOB_TITLE}}/g, jobTitle)
    .replace(/{{INTERVIEW_DATE}}/g, interviewDate)
    .replace(/{{INTERVIEW_TIME}}/g, interviewTime)
    .replace(/{{DURATION}}/g, duration)
    .replace(/{{INTERVIEW_FORMAT}}/g, format)
    .replace(/{{INTERVIEWER_NAMES}}/g, interviewers)
    .replace(/{{MEETING_LINK}}/g, meetingLink)
    .replace(/{{SENDER_NAME}}/g, senderName)
    .replace(/{{SENDER_TITLE}}/g, senderTitle)

  // Send email using Resend or similar service
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`
    },
    body: JSON.stringify({
      from: 'CogniVectra Careers <careers@cognivectra.com>',
      to: [candidateEmail],
      subject: `Interview Invitation - ${jobTitle} Position`,
      html: emailHTML
    })
  })

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

### Option 3: Using Email Marketing Tools

1. **Mailchimp, SendGrid, or similar**:
   - Import the HTML template
   - Set up merge tags for variables
   - Send personalized emails

## Example Usage

```javascript
// Example values
const emailData = {
  candidateName: "Priya Sharma",
  candidateEmail: "priya.sharma@example.com",
  jobTitle: "Senior DevOps Engineer",
  interviewDate: "Monday, January 27, 2026",
  interviewTime: "2:00 PM IST (8:30 AM UTC)",
  duration: "60",
  interviewFormat: "Video Call (Google Meet)",
  interviewerNames: "Selvakumar B (Principal Architect) and Tech Team Lead",
  meetingLink: "https://meet.google.com/abc-defg-hij",
  senderName: "Selvakumar B",
  senderTitle: "Principal Architect"
};

// Replace variables in template
let emailHTML = templateHTML;
Object.keys(emailData).forEach(key => {
  const placeholder = `{{${key.toUpperCase()}}}`;
  emailHTML = emailHTML.replace(new RegExp(placeholder, 'g'), emailData[key]);
});

// Send email
sendEmail(emailData.candidateEmail, emailHTML);
```

## Template Features

### Design Elements
✅ **Professional Header** - CogniVectra logo and gradient background  
✅ **Clear Interview Details** - Highlighted info box with all details  
✅ **Call-to-Action Button** - "Join Video Interview" button  
✅ **Preparation Tips** - Helps candidates prepare  
✅ **Contact Information** - Easy rescheduling options  
✅ **Branded Footer** - Company info and social links  

### Responsive Design
✅ Works on desktop, tablet, and mobile  
✅ Email client compatible (Gmail, Outlook, Apple Mail, etc.)  
✅ Professional appearance across all devices  

### Branding
✅ CogniVectra logo (hosted at cognivectra.org)  
✅ Brand colors (purple/blue gradient)  
✅ Consistent with website design  

## Customization

### Changing Colors
Find and replace these color codes:
- **Primary Purple**: `#6366f1` → Your color
- **Dark Background**: `#1e293b` → Your color
- **Text Color**: `#1f2937` → Your color

### Adding Sections
Add new content between the `<tr>` tags in the main content area.

### Removing Sections
Delete unwanted `<tr>` sections (e.g., "What to Expect" or "How to Prepare").

## Testing

### Before Sending:
1. ✅ Replace ALL `{{VARIABLES}}` with real values
2. ✅ Test the meeting link
3. ✅ Send a test email to yourself
4. ✅ Check on mobile and desktop
5. ✅ Verify all links work

### Email Clients to Test:
- Gmail (web and mobile)
- Outlook (web and desktop)
- Apple Mail
- Mobile email apps

## Notes

- **Logo URL**: Uses `https://cognivectra.org/cognivectra-dark-crop.png`
- **Meeting Link**: Remove this section if interview is in-person
- **Time Zones**: Always include timezone (e.g., IST, UTC)
- **Confirmation**: Template asks candidate to confirm attendance

## Support

For questions about using this template:
- Email: info@cognivectra.com
- WhatsApp: +91 8825492600

---

**Template Version**: 1.0  
**Last Updated**: January 24, 2026  
**Created for**: CogniVectra Innovations
