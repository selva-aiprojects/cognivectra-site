declare const Deno: any;
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
    console.log("🚀 Social Media Publishing Started");
    console.log("Method:", req.method);
    console.log("URL:", req.url);

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const payload = await req.json()
        console.log("Payload received:", JSON.stringify(payload));
        const { postId, platforms } = payload

        if (!postId) {
            throw new Error("postId is required");
        }
        if (!platforms || !Array.isArray(platforms)) {
            throw new Error("platforms array is required");
        }

        console.log(`Processing post ${postId} for platforms: ${platforms.join(', ')}`);

        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !supabaseKey) {
            console.error("❌ Missing Supabase credentials in Edge Function");
            throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
        }

        const supabase = createClient(supabaseUrl, supabaseKey)
        console.log("✅ Supabase client created");

        // Fetch Post Data
        console.log(`Fetching post ${postId}...`);
        const { data: post, error: fetchError } = await supabase
            .from('posts')
            .select('*')
            .eq('id', postId)
            .single()

        if (fetchError) {
            console.error("❌ Error fetching post:", fetchError);
            throw new Error(`Post not found: ${fetchError.message}`);
        }
        if (!post) {
            throw new Error(`Post ${postId} not found`);
        }
        console.log(`✅ Post found: "${post.title}"`);

        const results = []
        const socialData = post.social_media_data || {}
        const blogUrl = `https://cogni-vectra.vercel.app/blog/${post.slug}`
        const shareText = socialData.linkedin || post.excerpt || post.title

        if (platforms.includes('linkedin')) {
            try {
                console.log("🔍 Evaluating LinkedIn publishing strategy...");
                const token = Deno.env.get('LINKEDIN_ACCESS_TOKEN')?.replace(/["'`]/g, "").trim();
                const rawCompanyUrn = Deno.env.get('LINKEDIN_COMPANY_URN')?.replace(/["'`]/g, "").trim();
                const rawPersonUrn = Deno.env.get('LINKEDIN_PERSON_URN')?.replace(/["'`]/g, "").trim();
                const webhookUrl = Deno.env.get('SOCIAL_WEBHOOK_URL');

                let successResult = null;
                const failureLogs = [];

                // STRATEGY A: DIRECT API (Only if token is present)
                if (token) {
                    console.log("✅ LINKEDIN_ACCESS_TOKEN found. Attempting Direct API...");

                    // Identify Token Owner (Optional optimization)
                    let tokenMemberId = null;
                    try {
                        const meRes = await fetch('https://api.linkedin.com/v2/me', {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        if (meRes.ok) {
                            const meData = await meRes.json();
                            tokenMemberId = meData.id;
                            console.log(`✅ Token identity: urn:li:member:${tokenMemberId}`);
                        }
                    } catch (e) {
                        console.warn("⚠️ Could not verify token identity (profile scope might be missing)");
                    }

                    // Build Trial List
                    const trials: string[] = [];
                    if (rawCompanyUrn) {
                        trials.push(rawCompanyUrn.replace("organization", "company"));
                        trials.push(rawCompanyUrn.replace("company", "organization"));
                    }
                    if (tokenMemberId) trials.push(`urn:li:member:${tokenMemberId}`);
                    if (rawPersonUrn) {
                        trials.push(rawPersonUrn.replace("person", "member"));
                        trials.push(rawPersonUrn.replace("member", "person"));
                    }
                    const uniqueTrials = [...new Set(trials)].filter(t => t && t.startsWith("urn:li:"));

                    if (uniqueTrials.length > 0) {
                        console.log(`🔢 Trying ${uniqueTrials.length} URN(s):`, uniqueTrials);
                        for (const urn of uniqueTrials) {
                            console.log(`🔄 Posting with URN: ${urn}`);
                            const res = await tryPost(urn, token, shareText);
                            if (res.ok) {
                                console.log(`✅ Direct success with URN: ${urn}`);
                                successResult = res;
                                break;
                            } else {
                                const errorMsg = res.data?.message || res.data?.error?.message || `HTTP ${res.status}`;
                                console.log(`❌ Failed with URN ${urn}: ${errorMsg}`);
                                failureLogs.push(`${urn}: ${errorMsg}`);
                            }
                        }
                    } else {
                        console.warn("⚠️ No URNs available for direct posting.");
                        failureLogs.push("No URNs (Company/Person) configured for direct API.");
                    }
                } else {
                    console.log("ℹ️ No LINKEDIN_ACCESS_TOKEN found. Skipping Direct API.");
                    failureLogs.push("Direct API skipped: Missing LINKEDIN_ACCESS_TOKEN.");
                }

                // STRATEGY B: WEBHOOK FALLBACK (If direct failed or was skipped)
                if (!successResult) {
                    console.log("🌐 Attempting Webhook Bridge fallback...");
                    if (webhookUrl) {
                        try {
                            const webhookRes = await fetch(webhookUrl, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    platform: 'linkedin',
                                    action: 'publish',
                                    post: {
                                        id: post.id,
                                        title: post.title,
                                        slug: post.slug,
                                        excerpt: post.excerpt,
                                        content: post.content,
                                        share_text: shareText,
                                        url: blogUrl,
                                        image_url: post.image_url
                                    }
                                })
                            });

                            if (webhookRes.ok) {
                                console.log("✅ Webhook Bridge successful");
                                successResult = { ok: true, data: { id: 'webhook-triggered', source: 'bridge' }, urnUsed: 'webhook' };
                            } else {
                                const errText = await webhookRes.text();
                                console.error(`❌ Webhook Bridge failed: ${errText}`);
                                failureLogs.push(`Webhook Bridge Error: ${errText}`);
                            }
                        } catch (webhookErr: any) {
                            console.error("❌ Webhook Bridge network error:", webhookErr.message);
                            failureLogs.push(`Webhook Network Error: ${webhookErr.message}`);
                        }
                    } else {
                        console.warn("⚠️ SOCIAL_WEBHOOK_URL not set in secrets.");
                        failureLogs.push("Webhook fallback skipped: Missing SOCIAL_WEBHOOK_URL.");
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
                    const combinedError = failureLogs.join(' | ');
                    results.push({
                        platform: 'linkedin',
                        success: false,
                        error: `Both Direct and Bridge strategies failed. Log: ${combinedError}`
                    });
                }

            } catch (err: any) {
                console.error("❌ Unexpected LinkedIn logic error:", err);
                results.push({ platform: 'linkedin', success: false, error: `Critical LinkedIn logic error: ${err.message}` });
            }
        }

        // Helper function for LinkedIn posts
        async function tryPost(urn: string, token: string, shareText: string) {
            try {
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
            } catch (error: any) {
                return { ok: false, status: 0, data: { message: error.message }, urnUsed: urn };
            }
        }

        // Instagram Publishing
        if (platforms.includes('instagram')) {
            try {
                const token = Deno.env.get('INSTAGRAM_ACCESS_TOKEN')?.replace(/["'`]/g, "").trim()
                const businessAccountId = Deno.env.get('INSTAGRAM_BUSINESS_ACCOUNT_ID')?.replace(/["'`]/g, "").trim()
                const defaultImageUrl = Deno.env.get('DEFAULT_POST_IMAGE_URL') || 'https://via.placeholder.com/1080x1080?text=CogniVectra'

                if (!token || !businessAccountId) {
                    results.push({
                        platform: 'instagram',
                        success: false,
                        error: 'Missing credentials. Please set INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_BUSINESS_ACCOUNT_ID in environment variables.'
                    });
                } else {
                    // Instagram requires image - use post image or default
                    const imageUrl = post.image_url || defaultImageUrl
                    const caption = socialData.instagram || socialData.instagram_caption || `${post.title}\n\n${post.excerpt || ''}\n\nRead more: ${blogUrl}`

                    // Step 1: Create media container
                    const createMediaRes = await fetch(
                        `https://graph.instagram.com/v18.0/${businessAccountId}/media`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                image_url: imageUrl,
                                caption: caption.substring(0, 2200), // Instagram caption limit
                                access_token: token
                            })
                        }
                    )

                    if (!createMediaRes.ok) {
                        const errorData = await createMediaRes.json()
                        throw new Error(`Instagram media creation failed: ${errorData.error?.message || 'Unknown error'}`)
                    }

                    const mediaData = await createMediaRes.json()
                    const creationId = mediaData.id

                    // Step 2: Publish the media container
                    const publishRes = await fetch(
                        `https://graph.instagram.com/v18.0/${businessAccountId}/media_publish`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                creation_id: creationId,
                                access_token: token
                            })
                        }
                    )

                    if (!publishRes.ok) {
                        const errorData = await publishRes.json()
                        throw new Error(`Instagram publish failed: ${errorData.error?.message || 'Unknown error'}`)
                    }

                    const publishData = await publishRes.json()
                    results.push({
                        platform: 'instagram',
                        success: true,
                        data: { id: publishData.id, creation_id: creationId }
                    })
                }
            } catch (err: any) {
                results.push({
                    platform: 'instagram',
                    success: false,
                    error: err.message || 'Instagram publishing failed'
                })
            }
        }

        // Facebook Publishing
        if (platforms.includes('facebook')) {
            try {
                const token = Deno.env.get('FACEBOOK_ACCESS_TOKEN')?.replace(/["'`]/g, "").trim()
                const pageId = Deno.env.get('FACEBOOK_PAGE_ID')?.replace(/["'`]/g, "").trim()

                if (!token || !pageId) {
                    results.push({
                        platform: 'facebook',
                        success: false,
                        error: 'Missing credentials. Please set FACEBOOK_ACCESS_TOKEN and FACEBOOK_PAGE_ID in environment variables.'
                    })
                } else {
                    const message = socialData.facebook || socialData.facebook_post || `${post.title}\n\n${post.excerpt || ''}`

                    const response = await fetch(
                        `https://graph.facebook.com/v18.0/${pageId}/feed`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                message: message,
                                link: blogUrl,
                                access_token: token
                            })
                        }
                    )

                    if (!response.ok) {
                        const errorData = await response.json()
                        throw new Error(`Facebook publish failed: ${errorData.error?.message || 'Unknown error'}`)
                    }

                    const responseData = await response.json()
                    results.push({
                        platform: 'facebook',
                        success: true,
                        data: { id: responseData.id }
                    })
                }
            } catch (err: any) {
                results.push({
                    platform: 'facebook',
                    success: false,
                    error: err.message || 'Facebook publishing failed'
                })
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

        console.log("✅ Publishing complete. Results:", JSON.stringify(results));

        return new Response(JSON.stringify({ results }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error: any) {
        console.error("❌ Edge Function Error:", error);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);

        return new Response(JSON.stringify({
            error: error.message,
            details: error.stack
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
