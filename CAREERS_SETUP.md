# Careers Page - Email Notification Setup

## Overview
The careers page sends acknowledgment emails to applicants when they submit their applications.

## Email Functionality

### What Gets Sent:
1. **To Applicant**: Acknowledgment email confirming receipt of application
2. **To Admin**: Notification email about new application (optional)

### Email Content:
- Applicant name
- Position applied for
- Submission timestamp
- Next steps information

## Setup Instructions

### Option 1: Using Supabase Edge Function (Recommended)

1. **Create Edge Function**:
```bash
cd supabase
npx supabase functions new send-application-email
```

2. **Add Function Code** (supabase/functions/send-application-email/index.ts):
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const { applicant_email, applicant_name, position, job_title } = await req.json()

    // Send email using Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'CogniVectra <info@cognivectra.com>',
        to: [applicant_email],
        subject: `Application Received - ${job_title}`,
        html: `
          <h2>Thank You for Your Application!</h2>
          <p>Dear ${applicant_name},</p>
          <p>We have successfully received your application for the <strong>${job_title}</strong> position.</p>
          <p>Our team will review your application and get back to you within 5-7 business days.</p>
          <p>Best regards,<br>CogniVectra Team</p>
        `
      })
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
```

3. **Deploy Function**:
```bash
npx supabase functions deploy send-application-email
```

4. **Set Environment Variable**:
```bash
npx supabase secrets set RESEND_API_KEY=your_resend_api_key
```

### Option 2: Using Email Service Directly

If you prefer not to use Edge Functions, you can integrate an email service directly in your frontend:

1. **Sign up for Resend** (https://resend.com)
2. **Get API Key**
3. **Add to .env**:
```
VITE_RESEND_API_KEY=your_key_here
```

4. **Update Careers.jsx** to call Resend API directly

### Option 3: Simple Notification (No Email)

If you don't want to set up emails immediately:
1. Applications will still be saved to Supabase
2. You can view them in the Admin panel
3. Comment out the email sending code in Careers.jsx (lines 118-130)

## Database Setup

Run the SQL script to create tables:
```bash
# In Supabase Dashboard:
# 1. Go to SQL Editor
# 2. Copy contents of supabase/careers_setup.sql
# 3. Run the script
```

## Storage Setup

Create the resumes bucket in Supabase:
1. Go to Storage in Supabase Dashboard
2. Create new bucket named "resumes"
3. Set it to private (not public)
4. Policies are already created in the SQL script

## Testing

1. Navigate to `/careers`
2. Click "Apply Now"
3. Fill out the form
4. Upload a resume (PDF or Word)
5. Submit

Check:
- Application appears in `job_applications` table
- Resume appears in `resumes` storage bucket
- Email is sent (if configured)

## Admin View (Future Enhancement)

You can create an admin page to view applications:
```sql
SELECT 
  full_name,
  email,
  position,
  created_at,
  status,
  resume_url
FROM job_applications
ORDER BY created_at DESC;
```

## Environment Variables Needed

```env
# Supabase (already configured)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# Email (optional - for Edge Function)
RESEND_API_KEY=your_resend_key  # Set in Supabase secrets
```

## Notes

- Resume files are stored privately in Supabase Storage
- Only authenticated admins can view resumes
- File size limit: 5MB
- Accepted formats: PDF, DOC, DOCX
- Applications are automatically timestamped
