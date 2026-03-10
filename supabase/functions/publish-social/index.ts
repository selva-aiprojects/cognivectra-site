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
        // Use production domain for live site
        const blogUrl = `https://cognivectra.com/blog/${post.slug}`
        const shareText = socialData.linkedin || post.excerpt || post.title

        console.log(`📝 Preparing content for: ${blogUrl}`);
        console.log(`🔗 Webhook fallback target: ${Deno.env.get('SOCIAL_WEBHOOK_URL')?.substring(0, 20)}...`);

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

                // STRATEGY B: WEBHOOK FALLBACK
                if (!successResult) {
                    successResult = await sendToWebhook('linkedin', post, blogUrl, shareText);
                    if (!successResult && failureLogs.length === 0) {
                        failureLogs.push("Missing LinkedIn Token & Webhook URL");
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

        // Shared Webhook Helper
        async function sendToWebhook(platform: string, post: any, blogUrl: string, shareText: string) {
            const rawWebhookUrl = Deno.env.get('SOCIAL_WEBHOOK_URL');
            if (!rawWebhookUrl) {
                console.warn(`⚠️ No SOCIAL_WEBHOOK_URL configured for ${platform} fallback.`);
                return null;
            }

            // Robust cleaning for the URL (handles common quote issues)
            const webhookUrl = rawWebhookUrl.replace(/["'`]/g, "").trim();
            
            // Instagram requires high-quality public URLs
            const defaultImageUrl = 'https://cognivectra.com/Logo-refined.png';
            const postImageUrl = post.image_url;
            
            // Ensure absolute URL for images
            let imageUrl = postImageUrl;
            if (!imageUrl || imageUrl.startsWith('/') || imageUrl.includes('localhost')) {
                imageUrl = defaultImageUrl;
            }

            try {
                console.log(`🌐 [BRIDGE] Sending ${platform.toLowerCase()} post to Webhook at: ${webhookUrl.substring(0, 30)}...`);
                const payload = {
                    platform: platform.toLowerCase(), // Force lowercase for Make.com filter matches
                    action: 'publish',
                    post: {
                        id: post.id,
                        title: post.title,
                        slug: post.slug,
                        excerpt: post.excerpt,
                        content: post.content,
                        share_text: shareText,
                        url: blogUrl,
                        image_url: imageUrl
                    }
                };
                
                console.log(`📡 Payload Size: ${JSON.stringify(payload).length} characters`);
                
                const res = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const responseText = await res.text();
                console.log(`📥 Webhook Response [${res.status}]:`, responseText.substring(0, 100));

                if (res.ok) {
                    return { 
                        ok: true, 
                        data: { 
                            id: `webhook-${platform}-${Date.now()}`, 
                            source: 'make_com',
                            detail: responseText.substring(0, 50)
                        }, 
                        urnUsed: 'webhook' 
                    };
                }
                
                console.error(`❌ Webhook failed with status ${res.status}`);
                return null;
            } catch (e: any) {
                console.error(`❌ Webhook fetch error for ${platform}:`, e.message);
                return null;
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
                console.log("🔍 Evaluating Instagram publishing strategy...");
                const token = Deno.env.get('INSTAGRAM_ACCESS_TOKEN')?.replace(/["'`]/g, "").trim()
                const businessAccountId = Deno.env.get('INSTAGRAM_BUSINESS_ACCOUNT_ID')?.replace(/["'`]/g, "").trim()
                const defaultImageUrl = (Deno.env.get('DEFAULT_POST_IMAGE_URL') || 'https://cognivectra.com/Logo-refined.png').replace(/["'`]/g, "").trim();

                let successResult = null;
                const failureLogs = [];

                if (token && businessAccountId) {
                    console.log("✅ Instagram credentials found. Attempting Direct API...");
                    const imageUrl = post.image_url || defaultImageUrl
                    const caption = socialData.instagram || socialData.instagram_caption || `${post.title}\n\n${post.excerpt || ''}\n\nRead more: ${blogUrl}`

                    const createMediaRes = await fetch(
                        `https://graph.instagram.com/v18.0/${businessAccountId}/media`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                image_url: imageUrl,
                                caption: caption.substring(0, 2200),
                                access_token: token
                            })
                        }
                    )

                    if (createMediaRes.ok) {
                        const mediaData = await createMediaRes.json()
                        const creationId = mediaData.id

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

                        if (publishRes.ok) {
                            const publishData = await publishRes.json()
                            successResult = { ok: true, data: { id: publishData.id, creation_id: creationId } };
                        } else {
                            const errData = await publishRes.json();
                            failureLogs.push(`Publish failed: ${errData.error?.message}`);
                        }
                    } else {
                        const errData = await createMediaRes.json();
                        failureLogs.push(`Media creation failed: ${errData.error?.message}`);
                    }
                } else {
                    failureLogs.push("Direct API skipped: Missing INSTAGRAM_ACCESS_TOKEN or BUSINESS_ACCOUNT_ID");
                }

                if (!successResult) {
                    console.log("ℹ️ [INSTAGRAM] Triggering Webhook Bridge Fallback...");
                    const instaShareText = socialData.instagram || socialData.instagram_caption || post.excerpt || post.title;
                    const webhookRes = await sendToWebhook('instagram', post, blogUrl, instaShareText);
                    if (webhookRes) {
                        console.log("✅ [INSTAGRAM] Webhook Bridge successful.");
                        successResult = webhookRes;
                    } else {
                        console.error("❌ [INSTAGRAM] Webhook Bridge failed.");
                    }
                }

                if (successResult) {
                    results.push({ platform: 'instagram', success: true, data: successResult.data });
                } else {
                    results.push({ platform: 'instagram', success: false, error: failureLogs.join(' | ') || 'Instagram publishing failed' });
                }
            } catch (err: any) {
                console.error("❌ Unexpected Instagram logic error:", err);
                results.push({ platform: 'instagram', success: false, error: err.message });
            }
        }

        // Facebook Publishing
        if (platforms.includes('facebook')) {
            try {
                console.log("🔍 Evaluating Facebook publishing strategy...");
                const token = Deno.env.get('FACEBOOK_ACCESS_TOKEN')?.replace(/["'`]/g, "").trim()
                const pageId = Deno.env.get('FACEBOOK_PAGE_ID')?.replace(/["'`]/g, "").trim()

                let successResult = null;
                const failureLogs = [];

                if (token && pageId) {
                    console.log("✅ Facebook credentials found. Attempting Direct API...");
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

                    if (response.ok) {
                        const responseData = await response.json()
                        successResult = { ok: true, data: { id: responseData.id } };
                    } else {
                        const errData = await response.json();
                        failureLogs.push(`API failed: ${errData.error?.message}`);
                    }
                } else {
                    failureLogs.push("Direct API skipped: Missing FACEBOOK_ACCESS_TOKEN or PAGE_ID");
                }

                if (!successResult) {
                    console.log("ℹ️ [FACEBOOK] Triggering Webhook Bridge Fallback...");
                    const fbShareText = socialData.facebook || socialData.facebook_post || post.excerpt || post.title;
                    const webhookRes = await sendToWebhook('facebook', post, blogUrl, fbShareText);
                    if (webhookRes) {
                        console.log("✅ [FACEBOOK] Webhook Bridge successful.");
                        successResult = webhookRes;
                    } else {
                        console.error("❌ [FACEBOOK] Webhook Bridge failed.");
                    }
                }

                if (successResult) {
                    results.push({ platform: 'facebook', success: true, data: successResult.data });
                } else {
                    results.push({ platform: 'facebook', success: false, error: failureLogs.join(' | ') || 'Facebook publishing failed' });
                }
            } catch (err: any) {
                console.error("❌ Unexpected Facebook logic error:", err);
                results.push({ platform: 'facebook', success: false, error: err.message });
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
