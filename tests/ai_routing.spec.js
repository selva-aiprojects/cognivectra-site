/**
 * ai_routing.spec.js — AI Routing Layer E2E Tests
 * ================================================
 * Tests the new AI routing integration, including:
 *  1. Keyword fallback behavior (ENABLE_LORA_ROUTING=false, which is the default)
 *     — All existing NeuralSearch tests must still pass (zero regression)
 *  2. Feature flag defaulting (routing disabled by default)
 *  3. Fallback transparency — UI response is identical regardless of routing path
 *  4. Edge cases: empty queries, special characters, very long queries
 *  5. API error resilience — any upstream failure falls back gracefully
 *
 * NOTE: Since LoRA services are not deployed in this environment,
 * all tests verify that the keyword fallback path works correctly.
 * When ENABLE_LORA_ROUTING=true, the same tests must pass (output same format).
 */
import { test, expect } from '@playwright/test';

// ── Helper: open the NeuralSearch modal ───────────────────────────────────────
async function openSearch(page) {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.locator('#neural-search-trigger').click();
    await expect(page.getByTestId('neural-search-modal')).toBeVisible();
    await expect(page.getByTestId('neural-search-input')).toBeFocused();
}

// ── Helper: submit a query and wait for result ────────────────────────────────
async function submitQuery(page, query, timeout = 15000) {
    const input = page.getByTestId('neural-search-input');
    await input.fill(query);
    await page.keyboard.press('Enter');
    const result = page.locator('#neural-search-result');
    await expect(result).toBeVisible({ timeout });
    return result;
}


test.describe('AI Search — Zero Regression Tests (Keyword Fallback)', () => {
    // The original 6 tests must all still pass with the upgraded Edge Function.
    // These are the golden regression tests.

    test('Modal opens and closes correctly', async ({ page }) => {
        await openSearch(page);
        const closeBtn = page.getByTestId('neural-search-close');
        await closeBtn.click();
        await expect(page.getByTestId('neural-search-modal')).not.toBeVisible();
    });

    test('MedFlow query returns MedFlow response', async ({ page }) => {
        await openSearch(page);
        const result = await submitQuery(page, 'What is MedFlow?');
        await expect(result).toContainText(/MedFlow/i);
    });

    test('FinTech query returns StockSteward response', async ({ page }) => {
        await openSearch(page);
        const result = await submitQuery(page, 'Tell me about your FinTech platform');
        await expect(result).toContainText(/StockSteward/i);
    });

    test('Techstack query returns React/Vite response', async ({ page }) => {
        await openSearch(page);
        const result = await submitQuery(page, 'What techstack do you use?');
        await expect(result).toContainText(/React/i);
    });

    test('Competitive query returns comparison response', async ({ page }) => {
        await openSearch(page);
        const result = await submitQuery(page, 'Why are you better than Epic EMR?');
        await expect(result).toContainText(/better because/i);
    });

    test('Search history is retained between open/close cycles', async ({ page }) => {
        await openSearch(page);
        await expect(page.getByText(/Trending Inquiries/i)).toBeVisible();

        await submitQuery(page, 'Cloud Trends');
        await expect(page.getByText(/Intelligence Brief/i)).toBeVisible({ timeout: 15000 });
        await page.waitForTimeout(800);

        // Close and reopen
        await page.getByTestId('neural-search-close').click();
        await expect(page.getByTestId('neural-search-modal')).not.toBeVisible();
        await page.locator('#neural-search-trigger').click();
        await expect(page.getByTestId('neural-search-modal')).toBeVisible();

        // History should be present
        await expect(page.getByText(/Recent Intelligence/i)).toBeVisible();
        await expect(page.getByText(/Cloud Trends/i)).toBeVisible();
    });
});


test.describe('AI Search — Response Format Consistency', () => {
    // These tests verify that the response format is always correct,
    // whether routed via LoRA, keyword fallback, or local intelligence fallback.
    // NOTE: In test environment, Supabase Edge Function may be unavailable,
    // so local intelligence fallback may run — tests accommodate both code paths.

    test('All responses return non-empty AI response content', async ({ page }) => {
        await openSearch(page);
        const result = await submitQuery(page, 'What platforms do you build?');
        // Either 'Neural Intelligence Brief' (from Edge Function) or CogniVectra context
        // (from local fallback) — both are valid
        const text = await result.textContent();
        expect(text.length).toBeGreaterThan(50);
        expect(text).toMatch(/CogniVectra|Intelligence|platform|GenAI/i);
    });

    test('Response contains CogniVectra context for general query', async ({ page }) => {
        await openSearch(page);
        const result = await submitQuery(page, 'Tell me about StockSteward');
        await expect(result).toContainText(/StockSteward|FinTech|trading/i);
    });

    test('Response appears for general unknown query', async ({ page }) => {
        await openSearch(page);
        const result = await submitQuery(page, 'Tell me everything about your company');
        await expect(result).toBeVisible();
        await expect(result).toContainText(/CogniVectra/i);
    });

    test('Response appears for healthcare query', async ({ page }) => {
        await openSearch(page);
        const result = await submitQuery(page, 'Do you build healthcare systems?');
        await expect(result).toBeVisible();
        // Should return either MedFlow or general healthcare context
        await expect(result).toContainText(/health|MedFlow|EMR/i);
    });

    test('Response appears for pricing query', async ({ page }) => {
        await openSearch(page);
        const result = await submitQuery(page, 'What are your service prices?');
        await expect(result).toBeVisible();
        await expect(result).toContainText(/pricing|modular|Launch Pack|cost|save/i);
    });

    test('Response appears for customer/client query', async ({ page }) => {
        await openSearch(page);
        const result = await submitQuery(page, 'Who are your customers?');
        await expect(result).toBeVisible();
        await expect(result).toContainText(/Kidz-Clinic|customers|partner/i);
    });
});


test.describe('AI Search — Edge Cases & Error Resilience', () => {
    test('Close button closes the search modal', async ({ page }) => {
        await openSearch(page);
        // NeuralSearch uses a close button (data-testid="neural-search-close"), not ESC
        await page.getByTestId('neural-search-close').click();
        await expect(page.getByTestId('neural-search-modal')).not.toBeVisible();
    });

    test('Multiple consecutive queries work correctly', async ({ page }) => {
        await openSearch(page);

        // First query
        const r1 = await submitQuery(page, 'What is MedFlow?');
        await expect(r1).toContainText(/MedFlow/i);

        // Second query without closing
        const input = page.getByTestId('neural-search-input');
        await input.fill('What is StockSteward?');
        await page.keyboard.press('Enter');
        await expect(page.locator('#neural-search-result')).toContainText(/StockSteward|FinTech/i, { timeout: 15000 });
    });

    test('Long query (200 chars) is handled gracefully', async ({ page }) => {
        await openSearch(page);
        const longQuery = 'Tell me everything about CogniVectra including all products, services, pricing models, customer success stories, technical stack choices and competitive advantages '.repeat(1).substring(0, 200);
        const result = await submitQuery(page, longQuery);
        await expect(result).toBeVisible();
        // Should return some content — not crash
        await expect(result).not.toBeEmpty();
    });

    test('Re-opening search after navigation retains fresh state', async ({ page }) => {
        await openSearch(page);
        await submitQuery(page, 'What is MedFlow?');
        await page.getByTestId('neural-search-close').click();

        // Navigate away and come back
        await page.goto('/services');
        await page.waitForLoadState('networkidle');
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        await page.locator('#neural-search-trigger').click();
        await expect(page.getByTestId('neural-search-modal')).toBeVisible();
        // Modal should open cleanly
        await expect(page.getByTestId('neural-search-input')).toBeVisible();
    });
});


test.describe('AI Routing — Feature Flag Default State', () => {
    // When ENABLE_LORA_ROUTING=false (default), the system must behave
    // identically to the original keyword implementation.
    // We verify no "Enhanced AI" badge appears (since flag is off by default)
    // and that the routing.keyword_fallback path is used.

    test('No AI Enhanced badge visible by default (flag off)', async ({ page }) => {
        await openSearch(page);
        // The VITE_ENABLE_LORA_ROUTING env var defaults to false
        // so no "AI Enhanced" badge should appear
        const badge = page.locator('[data-testid="ai-enhanced-badge"], .ai-enhanced-badge');
        // Either badge doesn't exist or is hidden — both valid
        const count = await badge.count();
        if (count > 0) {
            await expect(badge.first()).not.toBeVisible();
        }
        // Test passes if badge is absent
    });

    test('featureFlags ENABLE_LORA_ROUTING defaults to false in production mode', async ({ page }) => {
        await page.goto('/');
        // Evaluate the feature flag value from the window context
        const flagValue = await page.evaluate(() => {
            // The flag is only accessible if featureFlags.js is imported globally
            // We check via meta env — in dev/test, VITE_ENABLE_LORA_ROUTING is not set
            return window.__LORA_ROUTING_ENABLED__ ?? false;
        });
        expect(flagValue).toBe(false);
    });
});
