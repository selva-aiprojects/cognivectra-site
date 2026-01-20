import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    console.log("🚀 LinkedIn Ultimate Debug Strategy Started");

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const payload = await req.json()
        const { postId, platforms } = payload

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Fetch Post Data
        const { data: post, error: fetchError } = await supabase
            .from('posts')
            .select('*')
            .eq('id', postId)
            .single()

        if (fetchError || !post) throw new Error(`Post not found`)

        const results = []
        const socialData = post.social_media_data || {}
        const blogUrl = `https://cogni-vectra.vercel.app/blog/${post.slug}`
        const shareText = socialData.linkedin + `\n\nRead more: ${blogUrl}`;

        if (platforms.includes('linkedin')) {
            try {
                const token = Deno.env.get('LINKEDIN_ACCESS_TOKEN')?.replace(/["'`]/g, "").trim()
                const rawCompanyUrn = Deno.env.get('LINKEDIN_COMPANY_URN')?.replace(/["'`]/g, "").trim()
                const rawPersonUrn = Deno.env.get('LINKEDIN_PERSON_URN')?.replace(/["'`]/g, "").trim()

                if (!token) throw new Error("LINKEDIN_ACCESS_TOKEN is missing")

                // Strategy A: Identify Token Owner
                let tokenMemberId = null;
                try {
                    const meRes = await fetch('https://api.linkedin.com/v2/me', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                    if (meRes.ok) {
                        const meData = await meRes.json();
                        tokenMemberId = meData.id;
                        console.log(`✅ Token identity confirmed: urn:li:member:${tokenMemberId}`);
                    }
                } catch (e) {
                    console.warn("⚠️ Could not verify token identity (likely missing profile scope)");
                }

                async function tryPost(urn: string) {
                    console.log(`📡 Testing LinkedIn URN: [${urn}]`);
                    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                            'X-Restli-Protocol-Version': '2.0.0'
                        },
                        body: JSON.stringify({
                            author: urn,
                            lifecycleState: 'PUBLISHED',
                            visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
                            specificContent: {
                                'com.linkedin.ugc.ShareContent': {
                                    shareCommentary: { text: shareText },
                                    shareMediaCategory: 'NONE'
                                }
                            }
                        })
                    });
                    const body = await response.json();
                    return { ok: response.ok, status: response.status, data: body, urnUsed: urn };
                }

                // Generate trial list
                const trials: string[] = [];

                // 1. Company Trials
                if (rawCompanyUrn) {
                    trials.push(rawCompanyUrn.replace("organization", "company"));
                    trials.push(rawCompanyUrn.replace("company", "organization"));
                }

                // 2. Person Trials
                if (tokenMemberId) trials.push(`urn:li:member:${tokenMemberId}`);
                if (rawPersonUrn) {
                    trials.push(rawPersonUrn.replace("person", "member"));
                    trials.push(rawPersonUrn.replace("member", "person"));
                }

                // Deduplicate and filter empty
                const uniqueTrials = [...new Set(trials)].filter(t => t && t.startsWith("urn:li:"));

                let successResult = null;
                const failureLogs = [];

                for (const urn of uniqueTrials) {
                    const res = await tryPost(urn);
                    if (res.ok) {
                        successResult = res;
                        break;
                    } else {
                        failureLogs.push(`${urn}: ${res.data.message || 'Error'}`);
                    }
                }

                if (successResult) {
                    results.push({
                        platform: 'linkedin',
                        success: true,
                        data: successResult.data,
                        target: successResult.urnUsed
                    });
                } else {
                    const combinedError = failureLogs.join('\n\n');
                    results.push({
                        platform: 'linkedin',
                        success: false,
                        error: `LinkedIn rejected all attempts. \n\nLog:\n${combinedError}\n\nTIP: Ensure you have 'w_member_social' or 'w_organization_social' scopes.`
                    });
                }

            } catch (err: any) {
                results.push({ platform: 'linkedin', success: false, error: err.message });
            }
        }

        // Update tracking
        for (const res of results) {
            if (res.success) {
                await supabase.from('social_media_posts').insert({
                    post_id: parseInt(postId),
                    platform: res.platform,
                    platform_post_id: res.data?.id || 'unknown',
                    published_at: new Date().toISOString()
                })
            }
        }

        return new Response(JSON.stringify({ results }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
