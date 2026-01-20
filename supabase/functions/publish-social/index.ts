import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const payload = await req.json()
        const { postId, platforms } = payload

        console.log(`🤖 Function Triggered: Post ${postId} to platforms: ${platforms.join(', ')}`)

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

        if (fetchError) {
            console.error('Fetch Error:', fetchError)
            return new Response(JSON.stringify({ error: `Database fetch failed: ${fetchError.message}` }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            })
        }

        if (!post) {
            return new Response(JSON.stringify({ error: `Post ID ${postId} not found` }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 404,
            })
        }

        const results = []
        const socialData = post.social_media_data || {}
        const blogUrl = `https://cogni-vectra.vercel.app/blog/${post.slug}`

        // 2. Publish to LinkedIn
        if (platforms.includes('linkedin')) {
            if (!socialData.linkedin) {
                results.push({ platform: 'linkedin', success: false, error: 'LinkedIn content missing in post' })
            } else {
                console.log('Publishing to LinkedIn...')
                try {
                    const author = Deno.env.get('LINKEDIN_COMPANY_URN') || Deno.env.get('LINKEDIN_PERSON_URN')
                    const token = Deno.env.get('LINKEDIN_ACCESS_TOKEN')

                    if (!token) throw new Error('LINKEDIN_ACCESS_TOKEN not set in Supabase Secrets')
                    if (!author) throw new Error('LinkedIn URN (Company or Person) not set in Supabase Secrets')

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
                        console.error('LinkedIn API Error:', data)
                        results.push({ platform: 'linkedin', success: false, error: data.message || JSON.stringify(data) })
                    } else {
                        results.push({ platform: 'linkedin', success: true, data })
                    }
                } catch (err) {
                    console.error('LinkedIn Execution Error:', err.message)
                    results.push({ platform: 'linkedin', success: false, error: err.message })
                }
            }
        }

        // 3. Update tracking table for successful posts
        for (const res of results) {
            if (res.success) {
                const { error: trackError } = await supabase.from('social_media_posts').insert({
                    post_id: postId,
                    platform: res.platform,
                    platform_post_id: res.data?.id || 'unknown',
                    published_at: new Date().toISOString()
                })
                if (trackError) console.error(`Failed to track ${res.platform}:`, trackError.message)
            }
        }

        return new Response(JSON.stringify({ results }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        console.error('Global Function Error:', error.message)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
