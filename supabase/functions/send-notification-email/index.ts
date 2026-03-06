declare const Deno: any;
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NotificationPayload {
  type: 'demo_request' | 'contact_form' | 'chatbot_lead'
  name: string
  email: string
  organization?: string
  platform?: string
  timeline?: string
  message?: string
  stage?: string
  need?: string
  challenge?: string
  budget?: string
}

function getEmailContent(payload: NotificationPayload) {
  const { type, name, email } = payload

  switch (type) {
    case 'demo_request':
      return {
        subject: 'Your Demo Request Received — CogniVectra',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 0; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 600;">CogniVectra</h1>
              <p style="color: #94a3b8; font-size: 13px; margin: 8px 0 0 0;">Enterprise Technology Solutions</p>
            </div>
            <div style="padding: 30px;">
              <h2 style="color: #6366f1; margin-top: 0;">Demo Request Confirmed ✅</h2>
              <p>Dear <strong>${name}</strong>,</p>
              <p>Thank you for your interest in <strong>${payload.platform || 'our solutions'}</strong>. We've received your demo request and our team is already reviewing your requirements.</p>
              
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #6366f1; margin: 25px 0;">
                <h4 style="margin-top: 0; color: #1e293b;">📋 Your Request Summary</h4>
                ${payload.organization ? `<p style="margin: 5px 0; font-size: 14px;"><strong>Organization:</strong> ${payload.organization}</p>` : ''}
                ${payload.platform ? `<p style="margin: 5px 0; font-size: 14px;"><strong>Platform:</strong> ${payload.platform}</p>` : ''}
                ${payload.timeline ? `<p style="margin: 5px 0; font-size: 14px;"><strong>Timeline:</strong> ${payload.timeline}</p>` : ''}
              </div>
              
              <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <h4 style="margin-top: 0; color: #1e293b;">🚀 What Happens Next?</h4>
                <ul style="padding-left: 20px; color: #374151; font-size: 14px;">
                  <li>Our solutions team will review your requirements</li>
                  <li>You'll receive a personalized demo link within <strong>24 hours</strong></li>
                  <li>A dedicated solutions architect will be assigned to you</li>
                </ul>
              </div>
              
              <p>In the meantime, feel free to reply to this email if you have any questions.</p>
              <p>Best regards,<br><strong>CogniVectra Solutions Team</strong></p>
            </div>
            <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="font-size: 12px; color: #64748b; margin: 0;">
                &copy; 2026 CogniVectra Innovations. All rights reserved.<br>
                <a href="https://cognivectra.com" style="color: #6366f1; text-decoration: none;">cognivectra.com</a>
              </p>
            </div>
          </div>
        `,
      }

    case 'contact_form':
      return {
        subject: 'We Received Your Message — CogniVectra',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 0; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 600;">CogniVectra</h1>
              <p style="color: #94a3b8; font-size: 13px; margin: 8px 0 0 0;">Enterprise Technology Solutions</p>
            </div>
            <div style="padding: 30px;">
              <h2 style="color: #6366f1; margin-top: 0;">Message Received ✅</h2>
              <p>Dear <strong>${name}</strong>,</p>
              <p>Thank you for reaching out to CogniVectra. We've received your message and our Principal Architect will review your requirements within <strong>24 hours</strong>.</p>
              
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #6366f1; margin: 25px 0;">
                <h4 style="margin-top: 0; color: #1e293b;">📋 Your Inquiry Details</h4>
                ${payload.stage ? `<p style="margin: 5px 0; font-size: 14px;"><strong>Organization Type:</strong> ${payload.stage}</p>` : ''}
                ${payload.need ? `<p style="margin: 5px 0; font-size: 14px;"><strong>Strategic Need:</strong> ${payload.need}</p>` : ''}
                ${payload.message ? `<p style="margin: 5px 0; font-size: 14px;"><strong>Message:</strong> ${payload.message}</p>` : ''}
              </div>
              
              <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <h4 style="margin-top: 0; color: #166534;">💡 While You Wait</h4>
                <ul style="padding-left: 20px; color: #374151; font-size: 14px;">
                  <li>Explore our <a href="https://cognivectra.com/services" style="color: #6366f1;">services</a> to see how we can help</li>
                  <li>Check out our <a href="https://cognivectra.com/products" style="color: #6366f1;">product portfolio</a></li>
                  <li>Connect with us on <a href="https://www.linkedin.com/company/cognivectra" style="color: #6366f1;">LinkedIn</a></li>
                </ul>
              </div>
              
              <p>Best regards,<br><strong>CogniVectra Team</strong></p>
            </div>
            <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="font-size: 12px; color: #64748b; margin: 0;">
                &copy; 2026 CogniVectra Innovations. All rights reserved.<br>
                <a href="https://cognivectra.com" style="color: #6366f1; text-decoration: none;">cognivectra.com</a>
              </p>
            </div>
          </div>
        `,
      }

    case 'chatbot_lead':
      return {
        subject: 'Thanks for Connecting — CogniVectra',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 0; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 600;">CogniVectra</h1>
              <p style="color: #94a3b8; font-size: 13px; margin: 8px 0 0 0;">Enterprise Technology Solutions</p>
            </div>
            <div style="padding: 30px;">
              <h2 style="color: #6366f1; margin-top: 0;">Thanks for Chatting With Us! 🤖</h2>
              <p>Hi <strong>${name}</strong>,</p>
              <p>Thank you for taking the time to share your requirements through our AI assistant. We've captured all the details and a member of our solutions team will be in touch shortly.</p>
              
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #6366f1; margin: 25px 0;">
                <h4 style="margin-top: 0; color: #1e293b;">📋 Your Profile Summary</h4>
                ${payload.stage ? `<p style="margin: 5px 0; font-size: 14px;"><strong>Stage:</strong> ${payload.stage}</p>` : ''}
                ${payload.challenge ? `<p style="margin: 5px 0; font-size: 14px;"><strong>Challenge:</strong> ${payload.challenge}</p>` : ''}
                ${payload.timeline ? `<p style="margin: 5px 0; font-size: 14px;"><strong>Timeline:</strong> ${payload.timeline}</p>` : ''}
                ${payload.budget ? `<p style="margin: 5px 0; font-size: 14px;"><strong>Budget Range:</strong> ${payload.budget}</p>` : ''}
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://cognivectra.com/contact?tab=call"
                  style="background-color: #6366f1; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                  📅 Book a Strategy Call
                </a>
              </div>
              
              <p>Best regards,<br><strong>CogniVectra Team</strong></p>
            </div>
            <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="font-size: 12px; color: #64748b; margin: 0;">
                &copy; 2026 CogniVectra Innovations. All rights reserved.<br>
                <a href="https://cognivectra.com" style="color: #6366f1; text-decoration: none;">cognivectra.com</a>
              </p>
            </div>
          </div>
        `,
      }

    default:
      return {
        subject: 'Thank You — CogniVectra',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #6366f1;">Thank You!</h2>
            <p>We've received your message and will be in touch shortly.</p>
            <p>Best regards,<br><strong>CogniVectra Team</strong></p>
          </div>
        `,
      }
  }
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // GET: health check
  if (req.method === 'GET') {
    return new Response(
      JSON.stringify({
        status: 'healthy',
        types: ['demo_request', 'contact_form', 'chatbot_lead'],
        resend_key_set: !!RESEND_API_KEY,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  }

  try {
    const payload: NotificationPayload = await req.json()

    if (!payload.email) {
      throw new Error('Email is required')
    }

    if (!payload.type) {
      throw new Error('Notification type is required (demo_request | contact_form | chatbot_lead)')
    }

    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable not set')
    }

    const { subject, html } = getEmailContent(payload)

    // Determine the sender based on type
    const fromMap: Record<string, string> = {
      demo_request: 'CogniVectra Solutions <solutions@cognivectra.com>',
      contact_form: 'CogniVectra <hello@cognivectra.com>',
      chatbot_lead: 'CogniVectra AI <ai@cognivectra.com>',
    }

    const from = fromMap[payload.type] || 'CogniVectra <noreply@cognivectra.com>'

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from,
        to: [payload.email],
        reply_to: 'info@cognivectra.com',
        subject,
        html,
      }),
    })

    const data = await res.json()
    console.log(`[${payload.type}] Resend response:`, res.status, JSON.stringify(data))

    if (!res.ok) {
      throw new Error(`Resend error ${res.status}: ${data.message || JSON.stringify(data)}`)
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('Error in send-notification-email:', msg)
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
