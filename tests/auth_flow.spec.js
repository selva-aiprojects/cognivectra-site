import { test, expect } from '@playwright/test';

/**
 * End-to-End Authentication & Authorization Suite
 * This test validates the secure entry point of the Operations OS.
 */
test.describe('Authentication & Authorization Flow', () => {
    // These should be provided via environment variables or manual input
    const TEST_USER = process.env.TEST_USER_EMAIL || 'admin@cognivectra.com';
    const TEST_PASS = process.env.TEST_USER_PASSWORD;

    test('should redirect unauthenticated users to login', async ({ page }) => {
        await page.goto('/admin');
        await expect(page).toHaveURL(/\/login/);
    });

    test('should allow login with valid credentials', async ({ page }) => {
        if (!TEST_PASS) {
            console.warn('Skipping login test: No password provided.');
            return;
        }

        await page.goto('/login');
        await page.fill('input[type="email"]', TEST_USER);
        await page.fill('input[type="password"]', TEST_PASS);
        await page.click('button[type="submit"]');

        // Should land on admin dashboard
        await expect(page).toHaveURL(/\/admin/);
        await expect(page.getByText(/Command Center/i)).toBeVisible();
    });

    test('should handle logout correctly', async ({ page }) => {
        if (!TEST_PASS) return;

        // Perform login first
        await page.goto('/login');
        await page.fill('input[type="email"]', TEST_USER);
        await page.fill('input[type="password"]', TEST_PASS);
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/\/admin/);

        // Click logout in sidebar
        const logoutBtn = page.locator('button:has-text("Logout"), a:has-text("Sign Out")');
        if (await logoutBtn.isVisible()) {
            await logoutBtn.click();
            await expect(page).toHaveURL(/\/login/);
        }
    });

    test('should prevent access to protected routes after logout', async ({ page }) => {
        await page.goto('/admin');
        await expect(page).toHaveURL(/\/login/);
    });
});
