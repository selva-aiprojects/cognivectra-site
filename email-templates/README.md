# 📧 Email Templates & Compensation Management System

## Overview
Complete system for managing recruitment communications and competitive compensation packages.

## 📁 Files Created

### Email Templates
1. **`interview-invitation.html`** - Professional interview scheduling email
2. **`offer-letter.html`** - Comprehensive employment offer letter
3. **`README.md`** - Interview template documentation
4. **`OFFER-LETTER-README.md`** - Offer letter documentation

### Database
1. **`supabase/compensation_setup.sql`** - Compensation management schema

## 🎯 Features

### 1. Interview Invitation Template
✅ Professional design with CogniVectra branding  
✅ Interview details box (date, time, duration, format)  
✅ Video meeting link button  
✅ Preparation tips for candidates  
✅ Contact information for rescheduling  

**Variables**: 11 placeholders for personalization

### 2. Offer Letter Template
✅ Formal offer letter format  
✅ Comprehensive employment terms  
✅ Detailed compensation breakdown  
✅ Benefits listing (5 customizable)  
✅ Leave policy details  
✅ Legal terms (confidentiality, notice period)  
✅ Acceptance section with signature lines  

**Variables**: 35+ placeholders for complete customization

### 3. Compensation Management System
✅ Database table for role-based compensation  
✅ Salary ranges by role and level  
✅ Automatic CTC breakdown calculation  
✅ Benefits management (JSON storage)  
✅ Leave policy per role  
✅ Working conditions configuration  
✅ Sample data for 9 common roles  

## 📊 Sample Compensation Data Included

### Engineering Roles
- **Junior Software Engineer**: ₹6-9 LPA
- **Software Engineer**: ₹12-18 LPA
- **Senior Software Engineer**: ₹20-30 LPA
- **DevOps Engineer**: ₹15-22 LPA
- **Senior DevOps Engineer**: ₹25-35 LPA

### Other Roles
- **Product Manager**: ₹18-25 LPA
- **UX/UI Designer**: ₹12-18 LPA
- **Sales Executive**: ₹8-12 LPA
- **Marketing Manager**: ₹15-22 LPA

## 🚀 Next Steps

### 1. Set Up Database (Required)
```sql
-- Run in Supabase SQL Editor
-- File: supabase/compensation_setup.sql
```

This creates:
- `compensation_packages` table
- `compensation_breakdown` view (auto-calculates salary components)
- Sample data for 9 roles
- RLS policies for admin access

### 2. Build Admin Interface (Recommended)
Create `/admin/compensation` page to:
- View all compensation packages
- Add/edit/delete packages
- Set competitive salary ranges
- Manage benefits per role
- Generate offer letters automatically

### 3. Build Offer Generator (Recommended)
Create `/admin/offers` page to:
- Select candidate from applications
- Choose role (auto-fills compensation)
- Customize offer details
- Preview offer letter
- Generate PDF
- Send via email

## 💡 How It Works

### Manual Process (Current)
1. Open `offer-letter.html`
2. Replace all `{{VARIABLES}}` with actual values
3. Save as PDF or send as email

### Automated Process (To Build)
1. Admin selects candidate from applications
2. Choose role → compensation auto-fills from database
3. Customize any details
4. Click "Generate Offer"
5. System creates PDF and sends email

## 📋 Template Variables

### Interview Invitation (11 variables)
- Candidate name, email
- Job title
- Interview date, time, duration
- Format, interviewers
- Meeting link
- Sender name, title

### Offer Letter (35+ variables)
- **Candidate**: Name, address (5 fields)
- **Offer**: Date, reference, deadline (3 fields)
- **Position**: Title, department, manager, location, responsibilities (5 fields)
- **Employment**: Start date, type, probation (3 fields)
- **Compensation**: CTC, basic, HRA, allowances, bonus (5 fields)
- **Benefits**: 5 customizable benefits
- **Working**: Hours, schedule, leave days (6 fields)
- **Terms**: Notice period, conditions (2 fields)
- **Signatory**: Name, title (2 fields)

## 🎨 Design Features

### Professional Branding
✅ CogniVectra logo in header  
✅ Brand colors (purple/blue gradient)  
✅ Consistent with website design  
✅ Mobile-responsive layout  

### Email Client Compatible
✅ Gmail, Outlook, Apple Mail  
✅ Desktop and mobile  
✅ HTML tables for compatibility  
✅ Inline CSS for reliability  

## 📖 Documentation

### For Interview Template
See: `email-templates/README.md`
- Complete variable reference
- Usage examples
- Integration options (Web3Forms, Supabase Edge Functions)

### For Offer Letter
See: `email-templates/OFFER-LETTER-README.md`
- Complete variable reference
- Example offer data
- Legal notes and customization
- PDF generation options

## 🔧 Integration Options

### Option 1: Manual
- Copy HTML
- Replace variables
- Send via email client

### Option 2: Web3Forms (Like Contact Page)
```javascript
const emailHTML = template.replace(/{{VAR}}/g, value);
await fetch("https://api.web3forms.com/submit", {
  method: "POST",
  body: JSON.stringify({
    access_key: process.env.VITE_WEB3FORMS_ACCESS_KEY,
    to: candidateEmail,
    subject: "Interview Invitation",
    html: emailHTML
  })
});
```

### Option 3: Supabase Edge Function
```typescript
// Create function: send-offer-email
import { Resend } from 'resend';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

await resend.emails.send({
  from: 'CogniVectra <careers@cognivectra.com>',
  to: candidateEmail,
  subject: 'Employment Offer - CogniVectra',
  html: offerHTML
});
```

## 🎯 Recommended Build Order

1. ✅ **Email Templates** (Done)
2. ✅ **Compensation Database** (Done)
3. ⏳ **Admin Compensation Page** (To build)
   - Manage salary packages
   - Add/edit roles
   - Set competitive ranges
4. ⏳ **Offer Generator Page** (To build)
   - Select candidate
   - Choose role
   - Auto-fill compensation
   - Generate PDF
   - Send email

## 📞 Support

For questions:
- Email: info@cognivectra.com
- WhatsApp: +91 8825492600

---

**Version**: 1.0  
**Created**: January 24, 2026  
**Status**: Templates ready, Admin UI pending
