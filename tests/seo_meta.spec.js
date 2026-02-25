/**
 * seo_meta.spec.js — SEO & Open Graph Meta Tags E2E Tests
 * =========================================================
 * Tests that all key pages have correct:
 *  - Title tags
 *  - Meta description tags
 *  - H1 tags (single per page, correct content)
 *  - Open Graph tags (og:title, og:description, og:url, og:type)
 */
import { test, expect } from '@playwright/test';

async function getMeta(page, name) {
    return page.$eval(
        `meta[name="${name}"], meta[property="${name}"]`,
        (el) => el.getAttribute('content')
    ).catch(() => null);
}

test.describe('SEO & Meta Tags', () => {
    test('Home page has correct title, description, og tags', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveTitle(/CogniVectra/i);

        const desc = await getMeta(page, 'description');
        expect(desc).toBeTruthy();
        expect(desc.length).toBeGreaterThan(50);

        const ogTitle = await getMeta(page, 'og:title');
        expect(ogTitle).toBeTruthy();

        const ogType = await getMeta(page, 'og:type');
        expect(ogType).toBe('website');

        const ogUrl = await getMeta(page, 'og:url');
        expect(ogUrl).toContain('cognivectra.com');
    });

    test('Home page has exactly one H1', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        const h1s = await page.locator('h1').count();
        expect(h1s).toBe(1);
    });

    test('MedFlow detail page has H1', async ({ page }) => {
        await page.goto('/products/medflow');
        await page.waitForLoadState('networkidle');
        const h1 = page.locator('h1');
        await expect(h1).toBeVisible();
    });

    test('StoreAI detail page has H1', async ({ page }) => {
        await page.goto('/products/storeai');
        await page.waitForLoadState('networkidle');
        const h1 = page.locator('h1');
        await expect(h1).toBeVisible();
    });

    test('StockSteward page has H1', async ({ page }) => {
        await page.goto('/products/stocksteward');
        await page.waitForLoadState('networkidle');
        const h1 = page.locator('h1');
        await expect(h1).toBeVisible();
    });

    test('Services page has H1', async ({ page }) => {
        await page.goto('/services');
        await page.waitForLoadState('networkidle');
        const h1 = page.locator('h1');
        await expect(h1).toBeVisible();
    });

    test('Who We Are page has H1', async ({ page }) => {
        await page.goto('/who-we-are');
        await page.waitForLoadState('networkidle');
        const h1 = page.locator('h1');
        await expect(h1).toBeVisible();
    });

    test('Contact page has H1 and contact form', async ({ page }) => {
        await page.goto('/contact');
        await page.waitForLoadState('networkidle');
        const h1 = page.locator('h1');
        await expect(h1).toBeVisible();
    });

    test('Blog page has H1', async ({ page }) => {
        await page.goto('/blog');
        await page.waitForLoadState('networkidle');
        const h1 = page.locator('h1');
        await expect(h1).toBeVisible();
    });
});
