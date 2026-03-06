declare const Deno: any;
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employment Offer Letter - CogniVectra</title>
</head>
<body style="margin: 0; padding: 0; font-family: sans-serif; background-color: #f3f4f6;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 700px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
                            <img src="https://cognivectra.org/cognivectra-dark-crop.png" alt="CogniVectra Logo" style="max-width: 200px; height: auto; margin-bottom: 10px;">
                            <h1 style="color: #ffffff; font-size: 26px; margin: 10px 0 0 0; font-weight: 600;">Employment Offer Letter</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="color: #6b7280; font-size: 14px; margin-bottom: 30px;">
                                <strong>Date:</strong> {{OFFER_DATE}}<br>
                                <strong>Reference:</strong> {{OFFER_REFERENCE}}
                            </p>
                            <p style="color: #1f2937; font-size: 16px; line-height: 1.6;">
                                <strong>{{CANDIDATE_NAME}}</strong><br>
                                {{LOCATION}}
                            </p>
                            <p style="color: #1f2937; font-size: 16px; margin: 20px 0;">
                                <strong>Subject: Offer of Employment - {{JOB_TITLE}}</strong>
                            </p>
                            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                                Dear <strong>{{CANDIDATE_NAME}}</strong>,
                            </p>
                            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                                We are delighted to offer you the position of <strong>{{JOB_TITLE}}</strong> at CogniVectra Innovations. We were impressed with your skills and the value you will bring to our team.
                            </p>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f0f9ff; border-left: 4px solid #6366f1; border-radius: 8px; margin: 30px 0;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <h2 style="color: #1e293b; font-size: 18px; margin: 0 0 20px 0;">📋 Employment Terms</h2>
                                        <p style="color: #374151; font-size: 15px; line-height: 1.6;">
                                            <strong>Job Title:</strong> {{JOB_TITLE}}<br>
                                            <strong>Department:</strong> {{DEPARTMENT}}<br>
                                            <strong>Start Date:</strong> {{START_DATE}}<br>
                                            <strong>Location:</strong> {{WORK_LOCATION}}
                                        </p>
                                        <h3 style="color: #1f2937; font-size: 16px; margin: 20px 0 10px 0;">Compensation</h3>
                                        <p style="color: #374151; font-size: 15px; line-height: 1.6;">
                                            <strong>Annual CTC:</strong> INR {{ANNUAL_CTC}}<br>
                                            • Basic Salary: {{BASIC_SALARY}}<br>
                                            • HRA: {{HRA}}<br>
                                            • Special Allowance: {{SPECIAL_ALLOWANCE}}<br>
                                            • Performance Bonus: {{PERFORMANCE_BONUS}}
                                        </p>
                                        <h3 style="color: #1f2937; font-size: 16px; margin: 20px 0 10px 0;">Notice Period</h3>
                                        <p style="color: #374151; font-size: 15px; line-height: 1.6;">
                                            Either party may terminate this employment by providing <strong>{{NOTICE_PERIOD}} days</strong> written notice.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-top: 30px;">
                                We look forward to welcome you to the team.
                            </p>
                            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                                Sincerely,<br>
                                <strong>The Talent Team</strong><br>
                                CogniVectra Innovations
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 30px; text-align: center; border-radius: 0 0 12px 12px;">
                            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                                🌐 <a href="https://cognivectra.org" style="color: #6366f1; text-decoration: none;">cognivectra.org</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const body = await req.json()
        const { candidate_email, candidate_name, role_title, annual_ctc, joining_date, department, work_location, basic_salary, hra, special_allowance, performance_bonus, notice_period } = body

        if (!candidate_email) throw new Error('Candidate email is required')

        // Professional formatting
        const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });

        let html = TEMPLATE
            .replace(/{{OFFER_DATE}}/g, new Date().toLocaleDateString())
            .replace(/{{OFFER_REFERENCE}}/g, `CV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`)
            .replace(/{{CANDIDATE_NAME}}/g, candidate_name)
            .replace(/{{LOCATION}}/g, work_location || "Remote")
            .replace(/{{JOB_TITLE}}/g, role_title)
            .replace(/{{DEPARTMENT}}/g, department || "Engineering")
            .replace(/{{START_DATE}}/g, joining_date)
            .replace(/{{WORK_LOCATION}}/g, work_location || "Remote")
            .replace(/{{ANNUAL_CTC}}/g, formatter.format(annual_ctc))
            .replace(/{{BASIC_SALARY}}/g, formatter.format(basic_salary))
            .replace(/{{HRA}}/g, formatter.format(hra))
            .replace(/{{SPECIAL_ALLOWANCE}}/g, formatter.format(special_allowance))
            .replace(/{{PERFORMANCE_BONUS}}/g, formatter.format(performance_bonus))
            .replace(/{{NOTICE_PERIOD}}/g, notice_period || 60);

        // Send email using Resend
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: 'CogniVectra Talent <talent@cognivectra.com>',
                to: [candidate_email],
                reply_to: 'info@cognivectra.com',
                subject: `Offer of Employment: ${role_title} | CogniVectra Innovations`,
                html: html
            })
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Resend API error')

        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
        })
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500
        })
    }
})
