import { test, expect } from '@playwright/test';

test.describe('Edge-Case Routing & Secure Shell Protection', () => {

    test('should redirect /admin/omni to /login when unauthenticated', async ({ page }) => {
        await page.goto('/admin/omni');
        await expect(page).toHaveURL(/\/login/);
        await expect(page.getByTestId('tenant-name')).toBeVisible();
    });

    test('should redirect /admin/reports to /login when unauthenticated', async ({ page }) => {
        await page.goto('/admin/reports');
        await expect(page).toHaveURL(/\/login/);
        await expect(page.locator('h2')).toContainText('Command Portal');
    });

    test('should correctly handle non-existent admin sub-routes (404-to-login)', async ({ page }) => {
        // Even if the route doesn't exist under /admin, the catch-all or middleware should push to login first
        await page.goto('/admin/non-existent-module-xyz');
        await expect(page).toHaveURL(/\/login/);
    });

    test('should trigger password recovery packet workflow', async ({ page }) => {
        await page.goto('/login');

        // Fill email
        await page.fill('input[type="email"]', 'test-recovery@cognivectra.com');

        // Click recovery button
        const recoveryBtn = page.getByText('Lost Access?');
        await recoveryBtn.click();

        // Check for success message (Supabase will return success even if email isn't in DB for security)
        await expect(page.getByText(/Recovery packet dispatched/i)).toBeVisible({ timeout: 10000 });
    });

    test('should maintain tenant branding on redirected login page', async ({ page }) => {
        // If we try to go to a deep link, we should still see the tenant name on the login page
        await page.goto('/admin/jobs');
        const tenantName = page.getByTestId('tenant-name');
        await expect(tenantName).toContainText(/CogniVectra Global/i);
    });
});
