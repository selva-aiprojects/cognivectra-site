import { test, expect } from '@playwright/test';

test.describe('Neural Search Component', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Wait for page to be ready
        await page.waitForLoadState('networkidle');

        const searchTrigger = page.locator('#neural-search-trigger');
        await searchTrigger.click();
        await expect(page.locator('#neural-search-modal')).toBeVisible();
    });

    test('should open and close the search modal', async ({ page }) => {
        const closeBtn = page.locator('#neural-search-close');
        await closeBtn.click();
        await expect(page.locator('#neural-search-modal')).not.toBeVisible();
    });

    test('should return MedFlow intelligence', async ({ page }) => {
        const input = page.locator('#neural-search-input');
        await input.fill('What is MedFlow?');
        await page.keyboard.press('Enter');

        // Check for AI brief header
        const briefHeader = page.getByText(/Intelligence Brief/i);
        await expect(briefHeader).toBeVisible({ timeout: 15000 });

        // Check for MedFlow specific content
        await expect(page.getByText(/MedFlow/i).first()).toBeVisible();
        await expect(page.getByText(/Kidz-Clinic/i).first()).toBeVisible();
    });

    test('should return StockSteward FinTech intelligence', async ({ page }) => {
        const input = page.locator('#neural-search-input');
        await input.fill('Tell me about your FinTech platform');
        await page.keyboard.press('Enter');

        await expect(page.getByText(/StockSteward/i).first()).toBeVisible({ timeout: 15000 });
        await expect(page.getByText(/FinTech/i).first()).toBeVisible();
    });

    test('should return techstack details', async ({ page }) => {
        const input = page.locator('#neural-search-input');
        await input.fill('What techstack do you use?');
        await page.keyboard.press('Enter');

        await expect(page.getByText(/React/i).first()).toBeVisible({ timeout: 15000 });
        await expect(page.getByText(/Supabase/i).first()).toBeVisible();
    });

    test('should handle competitive comparisons', async ({ page }) => {
        const input = page.locator('#neural-search-input');
        await input.fill('Why are you better than Epic EMR?');
        await page.keyboard.press('Enter');

        await expect(page.getByText(/better because/i).first()).toBeVisible({ timeout: 15000 });
        await expect(page.getByText(/Production-Ready/i).first()).toBeVisible();
    });

    test('should show trending inquiries and history', async ({ page }) => {
        await expect(page.getByText(/Trending Inquiries/i)).toBeVisible();

        // Search for something to create history
        const input = page.locator('#neural-search-input');
        await input.fill('Cloud Trends');
        await page.keyboard.press('Enter');

        // Wait for results
        await expect(page.getByText(/Intelligence Brief/i)).toBeVisible({ timeout: 15000 });

        // Brief wait for state propagation
        await page.waitForTimeout(500);

        // Close and reopen search
        const closeBtn = page.locator('#neural-search-close');
        await closeBtn.click();
        await expect(page.locator('#neural-search-modal')).not.toBeVisible();

        const searchTrigger = page.locator('#neural-search-trigger');
        await searchTrigger.click();

        // Check history
        await expect(page.getByText(/Recent Intelligence/i)).toBeVisible();
        await expect(page.getByText(/Cloud Trends/i)).toBeVisible();
    });
});
