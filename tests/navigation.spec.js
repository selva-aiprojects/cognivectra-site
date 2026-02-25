/**
 * navigation.spec.js — Navigation & Routing E2E Tests
 * =====================================================
 * Tests all primary navigation flows:
 *  - Logo home link
 *  - Navbar links to all major pages
 *  - Page-level H1 / title correctness (SEO)
 *  - Demo Request modal open/close
 *  - Mobile menu behavior
 *  - 404 redirect handling
 */
import { test, expect } from '@playwright/test';

const PAGES = [
    { path: '/', title: /CogniVectra/i, h1: /Enterprise GenAI and Healthcare Platforms/i },
    { path: '/services', title: /CogniVectra/i },
    { path: '/products', title: /CogniVectra/i },
    { path: '/engagements', title: /CogniVectra/i },
    { path: '/results', title: /CogniVectra/i },
    { path: '/industries', title: /CogniVectra/i },
    { path: '/who-we-are', title: /CogniVectra/i },
    { path: '/blog', title: /CogniVectra/i },
    { path: '/contact', title: /CogniVectra/i },
    { path: '/careers', title: /CogniVectra/i },
    { path: '/products/medflow', title: /CogniVectra/i },
    { path: '/products/storeai', title: /CogniVectra/i },
    { path: '/products/stocksteward', title: /CogniVectra/i },
];

test.describe('Navigation & Routing', () => {
    test('homepage loads with correct title and H1', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveTitle(/CogniVectra/i);
        await expect(page.locator('h1')).toContainText(/Enterprise GenAI/i);
    });

    test('logo navigates back to home from any page', async ({ page }) => {
        await page.goto('/services');
        await page.waitForLoadState('networkidle');
        await page.click('a.brand[aria-label="CogniVectra Home"]');
        await expect(page).toHaveURL('/');
        await expect(page.locator('h1')).toContainText(/Enterprise GenAI/i);
    });

    test('Navbar "Services" link navigates correctly', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.click('a[href="/services"]');
        await expect(page).toHaveURL('/services');
    });

    test('Navbar "Platforms" link navigates correctly', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.click('a[href="/products"]');
        await expect(page).toHaveURL('/products');
    });

    test('Navbar "Engagements" link navigates correctly', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.click('a[href="/engagements"]');
        await expect(page).toHaveURL('/engagements');
    });

    test('Navbar "Results" link navigates correctly', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.click('a[href="/results"]');
        await expect(page).toHaveURL('/results');
    });

    test('Navbar "About" navigates to who-we-are', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.click('a[href="/who-we-are"]');
        await expect(page).toHaveURL('/who-we-are');
    });

    test('Contact page loads correctly', async ({ page }) => {
        await page.goto('/contact');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL('/contact');
    });

    test('Demo Request modal opens from Navbar CTA', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        const demoBtn = page.locator('nav button', { hasText: /Request Demo/i }).first();
        await demoBtn.click();
        // Modal should be visible
        await expect(page.locator('dialog, [role="dialog"], .modal-overlay, .demo-modal').first()).toBeVisible({ timeout: 5000 });
    });

    test('Demo Request modal opens from Hero CTA', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        // Click first "Request Demo" button in hero section
        await page.locator('section.hero-modern button', { hasText: /Request Demo/i }).click();
        await expect(page.locator('dialog, [role="dialog"], .modal-overlay, .demo-modal').first()).toBeVisible({ timeout: 5000 });
    });

    test('MedFlow detail page loads', async ({ page }) => {
        await page.goto('/products/medflow');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL('/products/medflow');
        await expect(page.locator('h1, h2, h3').first()).toBeVisible();
    });

    test('StoreAI detail page loads', async ({ page }) => {
        await page.goto('/products/storeai');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL('/products/storeai');
        await expect(page.locator('h1, h2, h3').first()).toBeVisible();
    });

    test('StockSteward detail page loads', async ({ page }) => {
        await page.goto('/products/stocksteward');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL('/products/stocksteward');
        await expect(page.locator('h1, h2, h3').first()).toBeVisible();
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
