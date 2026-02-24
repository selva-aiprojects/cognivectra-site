import { supabase } from "./supabase";

/**
 * Tracks a page view event to Supabase using the RPC pattern.
 * This is the modern standard for secure server-side telemetry.
 */
export async function trackPageView(path, metadata = {}) {
    try {
        let sessionId = sessionStorage.getItem("cognivectra_session");
        if (!sessionId) {
            sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            sessionStorage.setItem("cognivectra_session", sessionId);
        }

        // Call the database RPC function for high-performance tracking
        const { error } = await supabase.rpc('track_event', {
            p_path: path || window.location.pathname,
            p_session_id: sessionId,
            p_metadata: {
                user_agent: navigator.userAgent,
                language: navigator.language,
                screen_resolution: `${window.screen.width}x${window.screen.height}`,
                referrer: document.referrer || null,
                ...metadata // Allow merging additional context like channel or lead_score
            }
        });

        if (error) {
            if (import.meta.env.DEV) console.warn("Analytics RPC Error:", error.message);
        }
    } catch (err) {
        console.error("Tracking telemetry failed:", err);
    }
}

/**
 * Custom event tracking for specific user actions (e.g., lead_gen, click, conversion).
 */
export async function trackEvent(name, data = {}, category = 'INTERACTION') {
    // Shared event tracking logic
    return trackPageView(`${window.location.pathname}#event:${name}`, {
        event_category: category,
        ...data
    });
}
