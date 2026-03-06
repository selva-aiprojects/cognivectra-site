declare const Deno: any;
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SITE_URL = Deno.env.get('SITE_URL') || 'https://cognivectra.com'
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || ''

// Debug: log env at startup
console.log('RESEND_API_KEY set:', !!RESEND_API_KEY, '| starts with re_:', RESEND_API_KEY?.startsWith('re_'))

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AuthHookPayload {
  user: {
    email: string
    id: string
  }
  email_data: {
    token: string
    token_hash: string
    redirect_to: string
    site_url: string
    email_action_type: string
    otp?: string
  }
}

function getEmailContent(payload: AuthHookPayload) {
  const { email_data, user } = payload
  const { email_action_type, token_hash, redirect_to } = email_data

  // email_data.site_url = 'https://project.supabase.co/auth/v1' (already includes /auth/v1)
  const supabaseAuthUrl = email_data.site_url || `${SITE_URL}/auth/v1`
  const resetRedirectUrl = `${SITE_URL}/reset-password`
  const actionUrl = `${supabaseAuthUrl}/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${encodeURIComponent(resetRedirectUrl)}&apikey=${SUPABASE_ANON_KEY}`

  switch (email_action_type) {
    case 'recovery':
      return {
        subject: 'Reset Your CogniVectra Password',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
            <h2 style="color: #6366f1;">Reset Your Password</h2>
            <p>Hello,</p>
            <p>We received a request to reset the password for your CogniVectra admin account associated with <strong>${user.email}</strong>.</p>
            <p>Click the button below to reset your password. This link expires in <strong>1 hour</strong>.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${actionUrl}"
                style="background-color: #6366f1; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="color: #64748b; font-size: 0.9rem;">If you didn't request a password reset, you can safely ignore this email. Your password will not change.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
            <p style="font-size: 0.8rem; color: #64748b; text-align: center;">
              &copy; 2026 CogniVectra Innovations. All rights reserved.
            </p>
          </div>
        `,
      }

    case 'signup':
      return {
        subject: 'Confirm Your CogniVectra Account',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
            <h2 style="color: #6366f1;">Welcome to CogniVectra!</h2>
            <p>Hello,</p>
            <p>Thank you for signing up. Please confirm your email address by clicking the button below.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${actionUrl}"
                style="background-color: #6366f1; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                Confirm Email
              </a>
            </div>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
            <p style="font-size: 0.8rem; color: #64748b; text-align: center;">
              &copy; 2026 CogniVectra Innovations. All rights reserved.
            </p>
          </div>
        `,
      }

    case 'magiclink':
      return {
        subject: 'Your CogniVectra Magic Link',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
            <h2 style="color: #6366f1;">Your Magic Link</h2>
            <p>Hello,</p>
            <p>Click the button below to sign in to CogniVectra. This link expires in <strong>1 hour</strong>.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${actionUrl}"
                style="background-color: #6366f1; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                Sign In
              </a>
            </div>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
            <p style="font-size: 0.8rem; color: #64748b; text-align: center;">
              &copy; 2026 CogniVectra Innovations. All rights reserved.
            </p>
          </div>
        `,
      }

    default:
      return {
        subject: 'CogniVectra - Action Required',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #6366f1;">Action Required</h2>
            <p><a href="${actionUrl}">Click here</a> to complete your action.</p>
          </div>
        `,
      }
  }
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // GET: health check — tests if RESEND_API_KEY is valid
  if (req.method === 'GET') {
    const keySet = !!RESEND_API_KEY
    const keyValid = RESEND_API_KEY?.startsWith('re_') ?? false
    let resendStatus = 'not tested'

    if (keySet) {
      try {
        const r = await fetch('https://api.resend.com/domains', {
          headers: { 'Authorization': `Bearer ${RESEND_API_KEY}` }
        })
        const d = await r.json()
        resendStatus = r.ok ? `valid — ${d?.data?.length ?? 0} domains` : `invalid: ${d?.message}`
      } catch (e: any) {
        resendStatus = `fetch error: ${e.message}`
      }
    }

    return new Response(JSON.stringify({ keySet, keyValid, resendStatus }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  }

  try {
    const rawBody = await req.text()
    console.log('Hook payload received:', rawBody.substring(0, 200))
    const payload: AuthHookPayload = JSON.parse(rawBody)
    const { user } = payload

    if (!user?.email) {
      throw new Error('No email found in payload')
    }

    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable not set')
    }

    const { subject, html } = getEmailContent(payload)

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'CogniVectra <noreply@cognivectra.com>',
        to: [user.email],
        subject,
        html,
      }),
    })

    const data = await res.json()
    console.log('Resend response:', res.status, JSON.stringify(data))

    if (!res.ok) {
      throw new Error(`Resend error ${res.status}: ${data.message || JSON.stringify(data)}`)
    }

    console.log('Email sent successfully:', data.id)

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('Error in send-auth-email:', msg)
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
