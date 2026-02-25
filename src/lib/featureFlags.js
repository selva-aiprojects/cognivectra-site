/**
 * featureFlags.js — Client-side feature flag utility
 * ====================================================
 * Read feature flags from environment variables injected at build time.
 * These are PUBLIC flags only — never embed secret keys here.
 *
 * Server-side flag evaluation (e.g. ENABLE_LORA_ROUTING) is done in
 * the Supabase Edge Function via Supabase Vault, not here.
 */

/**
 * Public feature flags available to the React frontend.
 * Add new flags here as needed.
 */
export const FEATURE_FLAGS = {
    /**
     * When true, displays an "AI Enhanced" badge on the NeuralSearch modal
     * to indicate the LoRA routing layer is active.
     * Set VITE_ENABLE_LORA_ROUTING=true in your .env file to enable.
     * This is a UI-only flag — actual routing is controlled server-side.
     */
    ENABLE_LORA_ROUTING: import.meta.env.VITE_ENABLE_LORA_ROUTING === 'true',

    /**
     * When true, shows intent label in the AI response (for internal testing).
     */
    SHOW_INTENT_DEBUG: import.meta.env.VITE_SHOW_INTENT_DEBUG === 'true',
};

/**
 * Check if a feature flag is enabled.
 * @param {keyof typeof FEATURE_FLAGS} flag - Flag name
 * @returns {boolean}
 */
export function isEnabled(flag) {
    return Boolean(FEATURE_FLAGS[flag]);
}
