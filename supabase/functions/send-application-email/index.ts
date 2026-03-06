declare const Deno: any;
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { applicant_email, applicant_name, position, job_title } = await req.json()

        if (!applicant_email) {
            throw new Error('Email is required')
        }

        // Send email using Resend
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: 'CogniVectra Careers <careers@cognivectra.com>',
                to: [applicant_email],
                reply_to: 'info@cognivectra.com',
                subject: `Application Received - ${job_title} | CogniVectra`,
                html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
            <h2 style="color: #6366f1;">Thank You for Your Application!</h2>
            <p>Dear ${applicant_name},</p>
            <p>We have successfully received your application for the <strong>${job_title}</strong> position at CogniVectra.</p>
            <p>Our team is currently reviewing your profile to see how your skills align with our current needs. We pride ourselves on building high-performance technology foundations, and we're excited to see your interest in joining us.</p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0;">Next Steps:</h4>
              <ul style="padding-left: 20px;">
                <li>Application Review (3-5 business days)</li>
                <li>Initial Technical Screening (if shortlisted)</li>
                <li>Cultural & Values Interview</li>
              </ul>
            </div>
            <p>If you have any questions in the meantime, please feel free to reach out.</p>
            <p>Best regards,<br>The CogniVectra Talent Team</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
            <p style="font-size: 0.8rem; color: #64748b; text-align: center;">
              &copy; 2026 CogniVectra Innovations. All rights reserved.
            </p>
          </div>
        `
            })
        })

        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.message || 'Resend API error')
        }

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
