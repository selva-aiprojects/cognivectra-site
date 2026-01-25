import { supabase } from "./supabase";

/**
 * Tracks a page view event to Supabase.
 * This runs alongside professional tools like Vercel Analytics
 * to provide custom data for the Admin Dashboard.
 */
export async function trackPageView(path) {
    try {
        // Generate/Retrieve a simple session ID
        let sessionId = sessionStorage.getItem("cognivectra_session");
        if (!sessionId) {
            sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            sessionStorage.setItem("cognivectra_session", sessionId);
        }

        const analyticsData = {
            path: path || window.location.pathname,
            referrer: document.referrer || null,
            session_id: sessionId,
            user_agent: navigator.userAgent,
            language: navigator.language,
            screen_resolution: `${window.screen.width}x${window.screen.height}`
        };

        const { error } = await supabase
            .from("web_analytics")
            .insert([analyticsData]);

        if (error) {
            // Fail silently in production, but log in development
            if (import.meta.env.DEV) console.warn("Analytics error:", error.message);
        }
    } catch (err) {
        // Analytics should never crash the app
        console.error("Tracking failed:", err);
    }
}
