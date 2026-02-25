-- =============================================
-- Employee Lifecycle: Hire, Offer, Onboard
-- 2 New Employees based on existing Compensation Packages
-- Run this AFTER employee_setup.sql and compensation_setup.sql
-- =============================================

-- =============================================
-- STEP 1: Generate Offer Letters
-- =============================================

-- Offer 1: Senior Software Engineer (Engineering)
INSERT INTO public.offer_letters (
    candidate_name, candidate_email,
    candidate_address,
    job_title, department, reporting_manager, work_location,
    job_responsibilities,
    start_date, employment_type, probation_period,
    annual_ctc, basic_salary, hra, special_allowance, performance_bonus, other_benefits,
    benefits,
    working_hours, work_schedule,
    annual_leave_days, sick_leave_days, casual_leave_days,
    notice_period_days, additional_conditions,
    signatory_name, signatory_title,
    offer_status, sent_at, accepted_at,
    compensation_package_id,
    notes
) VALUES (
    'Arjun Mehta', 'arjun.mehta@cognivectra.com',
    '{"line1": "42, Prestige Tech Park", "line2": "Whitefield", "city": "Bengaluru", "state": "Karnataka", "pincode": "560066", "country": "India"}'::jsonb,
    'Senior Software Engineer', 'Engineering', 'Selvakumar B', 'Remote',
    'Lead backend architecture for StockSteward AI. Design and implement scalable microservices using Python/FastAPI. Mentor junior engineers and conduct code reviews. Own the CI/CD pipeline and deployment strategy.',
    '2026-03-01', 'full-time permanent', '3 months',
    '₹28,00,000', '₹14,00,000', '₹5,60,000', '₹5,60,000', '₹2,80,000', 'Stock options vesting over 4 years',
    '["Comprehensive health insurance for family", "100% remote work", "Learning budget ₹75,000/year", "Latest MacBook Pro and accessories", "Annual team offsites", "Stock options (if applicable)"]'::jsonb,
    '40 hours per week', 'Monday to Friday, flexible hours with core hours 11 AM - 4 PM IST',
    '24', '12', '7',
    '60', 'Subject to background verification and reference checks.',
    'Selvakumar B', 'Director of Technology',
    'accepted', NOW() - INTERVAL '5 days', NOW() - INTERVAL '2 days',
    (SELECT id FROM public.compensation_packages WHERE role_title = 'Senior Software Engineer' LIMIT 1),
    'Top performer from interview pipeline. Strong LangChain + FastAPI experience.'
);

-- Offer 2: DevOps Engineer (Engineering)
INSERT INTO public.offer_letters (
    candidate_name, candidate_email,
    candidate_address,
    job_title, department, reporting_manager, work_location,
    job_responsibilities,
    start_date, employment_type, probation_period,
    annual_ctc, basic_salary, hra, special_allowance, performance_bonus, other_benefits,
    benefits,
    working_hours, work_schedule,
    annual_leave_days, sick_leave_days, casual_leave_days,
    notice_period_days, additional_conditions,
    signatory_name, signatory_title,
    offer_status, sent_at, accepted_at,
    compensation_package_id,
    notes
) VALUES (
    'Priya Sharma', 'priya.sharma@cognivectra.com',
    '{"line1": "18, Indiranagar 2nd Stage", "line2": "100 Feet Road", "city": "Bengaluru", "state": "Karnataka", "pincode": "560038", "country": "India"}'::jsonb,
    'DevOps Engineer', 'Engineering', 'Selvakumar B', 'Remote',
    'Manage cloud infrastructure on AWS/GCP. Automate CI/CD pipelines using GitHub Actions and Docker. Monitor system health with Prometheus + Grafana. Ensure 99.9% uptime for all production services.',
    '2026-03-01', 'full-time permanent', '3 months',
    '₹18,00,000', '₹9,00,000', '₹3,60,000', '₹3,60,000', '₹1,80,000', 'Cloud certification sponsorship',
    '["Health insurance for self and family", "Remote work flexibility", "Cloud certification budget ₹50,000/year", "Latest MacBook Pro and accessories", "Flexible working hours"]'::jsonb,
    '40 hours per week', 'Monday to Friday, flexible hours',
    '21', '12', '7',
    '60', 'Subject to background verification and reference checks.',
    'Selvakumar B', 'Director of Technology',
    'accepted', NOW() - INTERVAL '4 days', NOW() - INTERVAL '1 day',
    (SELECT id FROM public.compensation_packages WHERE role_title = 'DevOps Engineer' LIMIT 1),
    'Strong Kubernetes and Terraform expertise. AWS certified.'
);

-- =============================================
-- STEP 2: Create Employees (Onboarding)
-- =============================================

-- Employee 1: Arjun Mehta - Senior Software Engineer
INSERT INTO public.employees (
    full_name, email, phone, date_of_birth,
    address_line1, address_line2, city, state, pincode, country,
    job_title, department, role_level, reporting_manager,
    joining_date, probation_end_date,
    compensation_package_id, annual_ctc, currency,
    work_location, work_schedule, employment_type,
    annual_leave_balance, sick_leave_balance, casual_leave_balance,
    employment_status,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relation,
    notes
) VALUES (
    'Arjun Mehta', 'arjun.mehta@cognivectra.com', '+91 98765 43210', '1995-06-15',
    '42, Prestige Tech Park', 'Whitefield', 'Bengaluru', 'Karnataka', '560066', 'India',
    'Senior Software Engineer', 'Engineering', 'senior', 'Selvakumar B',
    '2026-03-01', '2026-06-01',
    (SELECT id FROM public.compensation_packages WHERE role_title = 'Senior Software Engineer' LIMIT 1),
    2800000, 'INR',
    'Remote', 'Monday to Friday, flexible hours with core hours 11 AM - 4 PM IST', 'full-time',
    24, 12, 7,
    'on_probation',
    'Radhika Mehta', '+91 98765 43211', 'Spouse',
    'Onboarded via Operations OS. Assigned to StockSteward AI backend team.'
);

-- Employee 2: Priya Sharma - DevOps Engineer
INSERT INTO public.employees (
    full_name, email, phone, date_of_birth,
    address_line1, address_line2, city, state, pincode, country,
    job_title, department, role_level, reporting_manager,
    joining_date, probation_end_date,
    compensation_package_id, annual_ctc, currency,
    work_location, work_schedule, employment_type,
    annual_leave_balance, sick_leave_balance, casual_leave_balance,
    employment_status,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relation,
    notes
) VALUES (
    'Priya Sharma', 'priya.sharma@cognivectra.com', '+91 87654 32109', '1997-11-22',
    '18, Indiranagar 2nd Stage', '100 Feet Road', 'Bengaluru', 'Karnataka', '560038', 'India',
    'DevOps Engineer', 'Engineering', 'mid', 'Selvakumar B',
    '2026-03-01', '2026-06-01',
    (SELECT id FROM public.compensation_packages WHERE role_title = 'DevOps Engineer' LIMIT 1),
    1800000, 'INR',
    'Remote', 'Monday to Friday, flexible hours', 'full-time',
    21, 12, 7,
    'on_probation',
    'Vikram Sharma', '+91 87654 32110', 'Brother',
    'Onboarded via Operations OS. Assigned to infrastructure and monitoring team.'
);

-- =============================================
-- STEP 3: Link Offer Letters to Employees
-- =============================================
UPDATE public.offer_letters 
SET employee_id = (SELECT id FROM public.employees WHERE email = 'arjun.mehta@cognivectra.com' LIMIT 1)
WHERE candidate_email = 'arjun.mehta@cognivectra.com';

UPDATE public.offer_letters 
SET employee_id = (SELECT id FROM public.employees WHERE email = 'priya.sharma@cognivectra.com' LIMIT 1)
WHERE candidate_email = 'priya.sharma@cognivectra.com';

-- =============================================
-- STEP 4: Assign tenant_id (Multi-Tenant Compliance)
-- =============================================
UPDATE public.employees 
SET tenant_id = '00000000-0000-0000-0000-000000000000' 
WHERE tenant_id IS NULL;

UPDATE public.offer_letters 
SET tenant_id = '00000000-0000-0000-0000-000000000000' 
WHERE tenant_id IS NULL;

-- =============================================
-- VERIFICATION: Check the onboarded employees
-- =============================================
SELECT employee_id, full_name, job_title, department, employment_status, joining_date, annual_ctc
FROM public.employees
WHERE email IN ('arjun.mehta@cognivectra.com', 'priya.sharma@cognivectra.com');

-- Check linked offers
SELECT offer_reference, candidate_name, job_title, offer_status, accepted_at
FROM public.offer_letters
WHERE candidate_email IN ('arjun.mehta@cognivectra.com', 'priya.sharma@cognivectra.com');
