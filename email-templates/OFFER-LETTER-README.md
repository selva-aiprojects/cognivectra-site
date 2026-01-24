# Offer Letter Template - Usage Guide

## Template Location
`email-templates/offer-letter.html`

## Template Variables

### Candidate Information
- `{{CANDIDATE_NAME}}` - Full name (e.g., "Priya Sharma")
- `{{CANDIDATE_ADDRESS_LINE1}}` - Address line 1
- `{{CANDIDATE_ADDRESS_LINE2}}` - Address line 2 (optional)
- `{{CANDIDATE_CITY}}` - City
- `{{CANDIDATE_STATE}}` - State
- `{{CANDIDATE_PINCODE}}` - PIN/ZIP code

### Offer Details
- `{{OFFER_DATE}}` - Date of offer (e.g., "January 24, 2026")
- `{{OFFER_REFERENCE}}` - Reference number (e.g., "COGNI/2026/001")
- `{{ACCEPTANCE_DEADLINE}}` - Deadline to accept (e.g., "January 31, 2026")

### Position Details
- `{{JOB_TITLE}}` - Position title (e.g., "Senior DevOps Engineer")
- `{{DEPARTMENT}}` - Department (e.g., "Engineering")
- `{{REPORTING_MANAGER}}` - Manager name and title
- `{{WORK_LOCATION}}` - Work location (e.g., "Remote" or "Bangalore Office")
- `{{JOB_RESPONSIBILITIES}}` - Brief description of key responsibilities

### Employment Terms
- `{{START_DATE}}` - Start date (e.g., "February 15, 2026")
- `{{EMPLOYMENT_TYPE}}` - Type (e.g., "full-time permanent")
- `{{PROBATION_PERIOD}}` - Probation details (e.g., "You will be on probation for 3 months.")

### Compensation
- `{{ANNUAL_CTC}}` - Total annual CTC (e.g., "₹18,00,000" or "$120,000")
- `{{BASIC_SALARY}}` - Basic salary component
- `{{HRA}}` - House Rent Allowance
- `{{SPECIAL_ALLOWANCE}}` - Special allowance
- `{{PERFORMANCE_BONUS}}` - Performance bonus details
- `{{OTHER_BENEFITS}}` - Other monetary benefits

### Benefits (5 customizable benefits)
- `{{BENEFIT_1}}` - e.g., "Health insurance for self and family"
- `{{BENEFIT_2}}` - e.g., "Remote work flexibility"
- `{{BENEFIT_3}}` - e.g., "Professional development budget"
- `{{BENEFIT_4}}` - e.g., "Latest tech equipment (laptop, monitor, etc.)"
- `{{BENEFIT_5}}` - e.g., "Flexible working hours"

### Working Conditions
- `{{WORKING_HOURS}}` - Hours per week (e.g., "40")
- `{{WORK_SCHEDULE}}` - Schedule details (e.g., "Monday to Friday, 9 AM to 6 PM")
- `{{ANNUAL_LEAVE}}` - Annual leave days (e.g., "21")
- `{{SICK_LEAVE}}` - Sick leave days (e.g., "12")
- `{{CASUAL_LEAVE}}` - Casual leave days (e.g., "7")

### Notice and Conditions
- `{{NOTICE_PERIOD}}` - Notice period in days (e.g., "60")
- `{{ADDITIONAL_CONDITION}}` - Any additional conditions

### Signatory
- `{{SIGNATORY_NAME}}` - Person signing (e.g., "Selvakumar B")
- `{{SIGNATORY_TITLE}}` - Signatory's title (e.g., "Principal Architect & Founder")

## Example: Complete Offer Letter

```javascript
const offerData = {
  // Candidate
  candidateName: "Priya Sharma",
  candidateAddressLine1: "123 Tech Park Road",
  candidateAddressLine2: "Koramangala",
  candidateCity: "Bangalore",
  candidateState: "Karnataka",
  candidatePincode: "560034",
  
  // Offer Details
  offerDate: "January 24, 2026",
  offerReference: "COGNI/2026/001",
  acceptanceDeadline: "January 31, 2026",
  
  // Position
  jobTitle: "Senior DevOps Engineer",
  department: "Engineering",
  reportingManager: "Selvakumar B, Principal Architect",
  workLocation: "Remote (India)",
  jobResponsibilities: "designing and implementing cloud infrastructure, managing CI/CD pipelines, ensuring system reliability, and mentoring junior engineers",
  
  // Employment
  startDate: "February 15, 2026",
  employmentType: "full-time permanent",
  probationPeriod: "You will be on probation for the first 3 months of employment.",
  
  // Compensation
  annualCtc: "₹18,00,000 per annum",
  basicSalary: "₹9,00,000",
  hra: "₹3,60,000",
  specialAllowance: "₹4,00,000",
  performanceBonus: "Up to 10% of annual CTC based on performance",
  otherBenefits: "Professional development allowance of ₹50,000 per year",
  
  // Benefits
  benefit1: "Comprehensive health insurance for self, spouse, and children",
  benefit2: "100% remote work with flexible hours",
  benefit3: "Annual professional development budget of ₹50,000",
  benefit4: "Latest MacBook Pro and accessories",
  benefit5: "Annual team offsites and learning opportunities",
  
  // Working Conditions
  workingHours: "40",
  workSchedule: "flexible hours with core hours from 11 AM to 4 PM IST",
  annualLeave: "21",
  sickLeave: "12",
  casualLeave: "7",
  
  // Notice
  noticePeriod: "60",
  additionalCondition: "Right to work in India (valid work permit if applicable)",
  
  // Signatory
  signatoryName: "Selvakumar B",
  signatoryTitle: "Principal Architect & Founder"
};
```

## How to Generate Offer Letters

### Option 1: Manual (For one-off offers)
1. Open `offer-letter.html` in a text editor
2. Replace all `{{VARIABLES}}` with actual values
3. Save as PDF or send as email

### Option 2: Automated (Recommended)

See the **Compensation Management System** documentation for the automated offer generation tool that:
- Stores compensation packages by role
- Auto-fills salary and benefits
- Generates PDF offers
- Sends via email

## Legal Notes

⚠️ **Important**: This template is a general format. Please:
- Consult with legal counsel before using
- Ensure compliance with local labor laws
- Customize terms based on your jurisdiction
- Have HR review all offers

## Customization

### For Indian Companies:
- Use ₹ (INR) for salary
- Include PF, ESI, gratuity details
- Mention statutory benefits
- Include CTC breakup as per Indian standards

### For US Companies:
- Use $ (USD) for salary
- Include 401(k) details
- Mention health insurance specifics
- Include at-will employment clause

### For Remote/International:
- Specify currency clearly
- Mention time zone for working hours
- Include remote work policies
- Clarify tax implications

## File Formats

### For Email:
- Use HTML format directly
- Most email clients support this template

### For PDF:
- Open in browser
- Print to PDF
- Or use tools like Puppeteer/wkhtmltopdf

### For Physical Mail:
- Print on company letterhead
- Include wet signature
- Send via registered post

---

**Template Version**: 1.0  
**Last Updated**: January 24, 2026  
**Legal Review**: Pending (Please review with legal counsel)
