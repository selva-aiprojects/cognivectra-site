import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { postId, platforms } = await req.json()

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 1. Fetch Post Data
        const { data: post, error: fetchError } = await supabase
            .from('posts')
            .select('*')
            .eq('id', postId)
            .single()

        if (fetchError || !post) throw new Error(`Post not found: ${fetchError?.message || 'Unknown error'}`)

        const results = []
        const socialData = post.social_media_data || {}
        const blogUrl = `https://cogni-vectra.vercel.app/blog/${post.slug}`

        // 2. Publish to LinkedIn
        if (platforms.includes('linkedin') && socialData.linkedin) {
            console.log('Publishing to LinkedIn...')
            try {
                const author = Deno.env.get('LINKEDIN_COMPANY_URN') || Deno.env.get('LINKEDIN_PERSON_URN')
                const token = Deno.env.get('LINKEDIN_ACCESS_TOKEN')

                if (!token || !author) {
                    throw new Error('LinkedIn configuration missing (token or URN)')
                }

                const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'X-Restli-Protocol-Version': '2.0.0'
                    },
                    body: JSON.stringify({
                        author: author,
                        lifecycleState: 'PUBLISHED',
                        visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
                        specificContent: {
                            'com.linkedin.ugc.ShareContent': {
                                shareCommentary: { text: socialData.linkedin + `\n\nRead more: ${blogUrl}` },
                                shareMediaCategory: 'NONE'
                            }
                        }
                    })
                })

                const data = await response.json()
                if (!response.ok) {
                    console.error('LinkedIn Error:', data)
                    results.push({ platform: 'linkedin', success: false, error: data.message || JSON.stringify(data) })
                } else {
                    results.push({ platform: 'linkedin', success: true, data })
                }
            } catch (err) {
                results.push({ platform: 'linkedin', success: false, error: err.message })
            }
        }

        // 3. Publish to Facebook
        if (platforms.includes('facebook') && socialData.facebook) {
            console.log('Publishing to Facebook...')
            try {
                const pageId = Deno.env.get('FACEBOOK_PAGE_ID')
                const token = Deno.env.get('FACEBOOK_ACCESS_TOKEN')

                if (!token || !pageId) {
                    throw new Error('Facebook configuration missing (token or pageId)')
                }

                const response = await fetch(`https://graph.facebook.com/v18.0/${pageId}/feed`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: socialData.facebook + `\n\nRead more: ${blogUrl}`,
                        access_token: token
                    })
                })
                const data = await response.json()
                if (!response.ok) {
                    results.push({ platform: 'facebook', success: false, error: data.error?.message || JSON.stringify(data) })
                } else {
                    results.push({ platform: 'facebook', success: true, data })
                }
            } catch (err) {
                results.push({ platform: 'facebook', success: false, error: err.message })
            }
        }

        // 4. Publish to Instagram
        if (platforms.includes('instagram') && socialData.instagram) {
            console.log('Publishing to Instagram...')
            try {
                const igId = Deno.env.get('INSTAGRAM_BUSINESS_ACCOUNT_ID')
                const token = Deno.env.get('INSTAGRAM_ACCESS_TOKEN')

                if (!token || !igId) {
                    throw new Error('Instagram configuration missing (token or IG ID)')
                }

                // For Instagram, we need an image. We'll use a default one or the post image if available
                const imageUrl = post.image_url || 'https://cogni-vectra.vercel.app/og-image.jpg'

                // Step A: Create Media container
                const containerRes = await fetch(`https://graph.facebook.com/v18.0/${igId}/media`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        image_url: imageUrl,
                        caption: socialData.instagram,
                        access_token: token
                    })
                })
                const containerData = await containerRes.json()

                if (!containerRes.ok) {
                    throw new Error(containerData.error?.message || 'Failed to create IG container')
                }

                // Step B: Publish Media
                const publishRes = await fetch(`https://graph.facebook.com/v18.0/${igId}/media_publish`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        creation_id: containerData.id,
                        access_token: token
                    })
                })
                const publishData = await publishRes.json()

                if (!publishRes.ok) {
                    results.push({ platform: 'instagram', success: false, error: publishData.error?.message || 'Failed to publish IG post' })
                } else {
                    results.push({ platform: 'instagram', success: true, data: publishData })
                }
            } catch (err) {
                results.push({ platform: 'instagram', success: false, error: err.message })
            }
        }

        // 5. Update tracking table
        for (const res of results) {
            if (res.success) {
                await supabase.from('social_media_posts').insert({
                    post_id: postId,
                    platform: res.platform,
                    platform_post_id: res.data.id || res.data.id,
                    published_at: new Date().toISOString()
                })
            }
        }

        return new Response(JSON.stringify({ results }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
