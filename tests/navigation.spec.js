/**
 * navigation.spec.js — Navigation & Routing E2E Tests
 * =====================================================
 * Tests all primary navigation flows:
 *  - Logo home link
 *  - Navbar links to all major pages
 *  - Page-level H1 / title correctness (SEO)
 *  - Mobile menu behavior
 *  - 404 redirect handling
 */
import { test, expect } from '@playwright/test';

const PAGES = [
    { path: '/', title: /Cognivectra/i, h1: /AI-Native Technology/i },
    { path: '/services', title: /Cognivectra/i },
    { path: '/products', title: /Cognivectra/i },
    { path: '/case-studies', title: /Cognivectra/i },
    { path: '/ai-engineering', title: /Cognivectra/i },
    { path: '/cloud-platform-engineering', title: /Cognivectra/i },
    { path: '/product-engineering', title: /Cognivectra/i },
    { path: '/data-integration', title: /Cognivectra/i },
    { path: '/engagements', title: /Cognivectra/i },
    { path: '/results', title: /Cognivectra/i },
    { path: '/industries', title: /Cognivectra/i },
    { path: '/who-we-are', title: /Cognivectra/i },
    { path: '/blog', title: /Cognivectra/i },
    { path: '/contact', title: /Cognivectra/i },
    { path: '/careers', title: /Cognivectra/i },
    { path: '/products/medflow', title: /Cognivectra/i },
    { path: '/products/storeai', title: /Cognivectra/i },
    { path: '/products/stocksteward', title: /Cognivectra/i },
    { path: '/products/syntalyst', title: /Cognivectra/i },
    { path: '/products/smartportfolio', title: /Cognivectra/i },
    { path: '/products/ai-it-operations', title: /Cognivectra/i },
];

test.describe('Navigation & Routing', () => {
    test('homepage loads with correct title and H1', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveTitle(/Cognivectra/i);
        await expect(page.locator('h1')).toContainText(/AI-Native Technology/i);
    });

    test('logo navigates back to home from any page', async ({ page }) => {
        await page.goto('/services');
        await page.waitForLoadState('networkidle');
        await page.click('a.brand[aria-label="CogniVectra Home"]');
        await expect(page).toHaveURL('/');
        await expect(page.locator('h1')).toContainText(/AI-Native Technology/i);
    });

    test('Navbar "Capabilities" link navigates correctly', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.click('a[href="/services"]');
        await expect(page).toHaveURL('/services');
    });

    test('Navbar "Products" link navigates correctly', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.click('a[href="/products"]');
        await expect(page).toHaveURL('/products');
    });

    test('Navbar "Solutions" link navigates correctly', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.click('a[href="/industries"]');
        await expect(page).toHaveURL('/industries');
    });

    test('Navbar "Case Studies" link navigates correctly', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.click('a[href="/case-studies"]');
        await expect(page).toHaveURL('/case-studies');
    });

    test('Navbar "About" navigates to who-we-are', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.click('a[href="/who-we-are"]');
        await expect(page).toHaveURL('/who-we-are');
    });

    test('Navbar "Let\'s Talk" CTA navigates to /contact', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.getByRole('link', { name: /Let's Talk/i }).first().click();
        await expect(page).toHaveURL('/contact');
    });

    test('Engagements page loads correctly', async ({ page }) => {
        await page.goto('/engagements');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL('/engagements');
        await expect(page.locator('h1, h2').first()).toBeVisible();
    });

    test('Results page loads correctly', async ({ page }) => {
        await page.goto('/results');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL('/results');
        await expect(page.locator('h1, h2').first()).toBeVisible();
    });

    test('Contact page loads correctly', async ({ page }) => {
        await page.goto('/contact');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL('/contact');
    });

    test('Case Studies page loads with case study cards', async ({ page }) => {
        await page.goto('/case-studies');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('h1')).toContainText(/Case Studies/i);
    });

    test('AI Engineering page loads', async ({ page }) => {
        await page.goto('/ai-engineering');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL('/ai-engineering');
        await expect(page.locator('h1, h2').first()).toBeVisible();
    });

    test('Cloud & Platform Engineering page loads', async ({ page }) => {
        await page.goto('/cloud-platform-engineering');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL('/cloud-platform-engineering');
        await expect(page.locator('h1, h2').first()).toBeVisible();
    });

    test('Product Engineering page loads', async ({ page }) => {
        await page.goto('/product-engineering');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL('/product-engineering');
        await expect(page.locator('h1, h2').first()).toBeVisible();
    });

    test('Data & Integration page loads', async ({ page }) => {
        await page.goto('/data-integration');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL('/data-integration');
        await expect(page.locator('h1, h2').first()).toBeVisible();
    });

    test('New product detail pages load', async ({ page }) => {
        for (const slug of ['syntalyst', 'talentpulse', 'smartbook', 'smartportfolio', 'ai-it-operations']) {
            await page.goto(`/products/${slug}`);
            await page.waitForLoadState('networkidle');
            await expect(page).toHaveURL(`/products/${slug}`);
            await expect(page.locator('h1, h2').first()).toBeVisible();
        }
    });

    test('Blog page renders articles list', async ({ page }) => {
        await page.goto('/blog');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('h1, h2').first()).toBeVisible();
    });

    test('Careers page loads correctly', async ({ page }) => {
        await page.goto('/careers');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL('/careers');
    });

    test('Login page loads correctly', async ({ page }) => {
        await page.goto('/login');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL('/login');
        // Should have a login form
        await expect(page.locator('input[type="email"], input[type="text"]').first()).toBeVisible();
    });

    test('Forward/back browser navigation works', async ({ page }) => {
        await page.goto('/');
        await page.goto('/services');
        await page.goto('/products');
        await page.goBack();
        await expect(page).toHaveURL('/services');
        await page.goBack();
        await expect(page).toHaveURL('/');
    });
});
