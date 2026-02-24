import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
        const { query } = await req.json()

        if (!query) {
            return new Response(JSON.stringify({ error: 'Query is required' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // This is where you would plug in your OpenAI, Anthropic, or Perplexity API key
        // const apiKey = Deno.env.get('OPENAI_API_KEY')

        // MOCK DATA for site-specific context (Deep RAG Simulation)
        const siteContext = {
            'techstack': 'CogniVectra uses a high-performance stack: Vite + React 18 for speed, Framer Motion for premium UI, Supabase for scalable backend/auth, and Advanced AI Orchestration (LangChain/LangGraph/CrewAI) for agentic and multi-agent RAG systems.',
            'medflow': 'MedFlow EMR: Multi-tenant, HIPAA-ready, and live at Kidz-Clinic. Unlike legacy EMRs (Epic/Cerner), MedFlow is agile, cloud-native, and reduces provider onboarding from weeks to hours.',
            'steward': 'StockSteward: FinTech intelligence using CrewAI for agentic research. It beats standard bots by analyzing global sentiment and market liquidity in real-time.',
            'eduportal': 'EduPortal: EdTech platform scaling content delivery for thousands of concurrent learners with integrated AI tutoring systems.',
            'better': 'Why CogniVectra? We provide Production-Ready foundations that YOU own. Most competitors deliver technical debt; we deliver senior-architected, secure, and scalable IP with zero vendor lock-in.',
            'price': 'Our pricing is modular and transparent. We offer fixed-price Launch Packs for startups and Enterprise Retainers for scale, typically saving clients 30-50% on long-term operational overhead.',
            'customers': 'We partner with technical leaders at Kidz-Clinic (Healthcare) and various North American EdTech/FinTech startups.',
            'products': 'Our core platforms include MedFlow (Healthcare), StockSteward (FinTech), StoreAI (Retail), and EduPortal (Education).'
        }

        // SEARCH LOGIC (Hybrid RAG + Context Engineering)
        const lowerQuery = query.toLowerCase()
        let bestContext = "CogniVectra is an elite platform engineering firm specializing in GenAI and Cloud Foundations."

        // Check for specific comparisons
        if (lowerQuery.includes('compare') || lowerQuery.includes('competitor') || lowerQuery.includes('better') || lowerQuery.includes('why')) {
            bestContext = siteContext['better'] + ' ' + siteContext['price'];
        } else if (lowerQuery.includes('tech') || lowerQuery.includes('stack') || lowerQuery.includes('built')) {
            bestContext = siteContext['techstack'];
        } else if (lowerQuery.includes('customer') || lowerQuery.includes('user') || lowerQuery.includes('who')) {
            bestContext = siteContext['customers'];
        } else {
            for (const [key, value] of Object.entries(siteContext)) {
                if (lowerQuery.includes(key)) {
                    bestContext = value;
                    break;
                }
            }
        }

        // SIMULATED RESPONSE
        const response = {
            answer: `Neural Intelligence Brief on: "${query}"\n\n${bestContext}\n\nOur engineering core ensures that every deployment is security-hardened and performance-optimized. Would you like a technical deep-dive with our lead architect?`,
            sources: ['Internal Architecture Docs', 'Client Success Metrics v1.5'],
            confidence: 0.99
        }

        return new Response(JSON.stringify(response), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
