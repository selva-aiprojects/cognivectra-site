import { test, expect } from '@playwright/test';

test.describe('Neural Search Component', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const searchTrigger = page.locator('#neural-search-trigger');
        await searchTrigger.click();

        // Wait for modal to be visible and stable
        const modal = page.getByTestId('neural-search-modal');
        await expect(modal).toBeVisible();

        // Wait for input to be focused
        const input = page.getByTestId('neural-search-input');
        await expect(input).toBeFocused();
    });

    test('should open and close the search modal', async ({ page }) => {
        const closeBtn = page.getByTestId('neural-search-close');
        await closeBtn.click();
        await expect(page.getByTestId('neural-search-modal')).not.toBeVisible();
    });

    test('should return MedFlow intelligence', async ({ page }) => {
        const input = page.getByTestId('neural-search-input');
        await input.fill('What is MedFlow?');
        await page.keyboard.press('Enter');

        const resultContainer = page.locator('#neural-search-result');
        await expect(resultContainer).toBeVisible({ timeout: 15000 });
        await expect(resultContainer).toContainText(/MedFlow/i);
    });

    test('should return StockSteward FinTech intelligence', async ({ page }) => {
        const input = page.getByTestId('neural-search-input');
        await input.fill('Tell me about your FinTech platform');
        await page.keyboard.press('Enter');

        const resultContainer = page.locator('#neural-search-result');
        await expect(resultContainer).toBeVisible({ timeout: 15000 });
        await expect(resultContainer).toContainText(/StockSteward/i);
    });

    test('should return techstack details', async ({ page }) => {
        const input = page.getByTestId('neural-search-input');
        await input.fill('What techstack do you use?');
        await page.keyboard.press('Enter');

        const resultContainer = page.locator('#neural-search-result');
        await expect(resultContainer).toBeVisible({ timeout: 15000 });
        await expect(resultContainer).toContainText(/React/i);
    });

    test('should handle competitive comparisons', async ({ page }) => {
        const input = page.getByTestId('neural-search-input');
        await input.fill('Why are you better than Epic EMR?');
        await page.keyboard.press('Enter');

        const resultContainer = page.locator('#neural-search-result');
        await expect(resultContainer).toBeVisible({ timeout: 15000 });
        await expect(resultContainer).toContainText(/better because/i);
    });

    test('should show trending inquiries and history', async ({ page }) => {
        await expect(page.getByText(/Trending Inquiries/i)).toBeVisible();

        const input = page.getByTestId('neural-search-input');
        await input.fill('Cloud Trends');
        await page.keyboard.press('Enter');

        await expect(page.getByText(/Intelligence Brief/i)).toBeVisible({ timeout: 15000 });
        await page.waitForTimeout(1000); // Wait for state

        await page.getByTestId('neural-search-close').click();
        await expect(page.getByTestId('neural-search-modal')).not.toBeVisible();

        await page.locator('#neural-search-trigger').click();
        await expect(page.getByTestId('neural-search-modal')).toBeVisible();

        await expect(page.getByText(/Recent Intelligence/i)).toBeVisible();
        await expect(page.getByText(/Cloud Trends/i)).toBeVisible();
    });
});
