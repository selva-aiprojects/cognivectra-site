/**
 * home_page.spec.js — Home Page Content & UI E2E Tests
 * =====================================================
 * Tests:
 *  - All major sections render (Hero, Trust bar, Capabilities, Products, Case Studies, CTA)
 *  - Content accuracy (product names, section headings)
 *  - Navigation CTAs work correctly
 */
import { test, expect } from '@playwright/test';

test.describe('Home Page Content', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('Hero section renders with correct headline', async ({ page }) => {
        await expect(page.locator('h1')).toContainText(/AI-Native Technology\. Built for Business\./i);
    });

    test('Hero section shows "Explore Our Products" and "Talk to Cognivectra" CTAs', async ({ page }) => {
        await expect(page.getByRole('link', { name: /Explore Our Products/i }).first()).toBeVisible();
        await expect(page.getByRole('link', { name: /Talk to Cognivectra/i }).first()).toBeVisible();
    });

    test('Trust strip shows enterprise foundations (AWS, Azure, Kubernetes, OpenAI)', async ({ page }) => {
        await expect(page.getByText('Built On Enterprise Foundations')).toBeVisible();
        await expect(page.getByText('AWS', { exact: true }).first()).toBeVisible();
        await expect(page.getByText('Azure', { exact: true }).first()).toBeVisible();
        await expect(page.getByText('Kubernetes', { exact: true }).first()).toBeVisible();
        await expect(page.getByText('OpenAI', { exact: true }).first()).toBeVisible();
    });

    test('Core Capabilities section renders all four capabilities', async ({ page }) => {
        const section = page.locator('section', { hasText: 'Core Capabilities' });
        await expect(section.first()).toBeVisible({ timeout: 10000 });
        await expect(page.getByText('AI Engineering').first()).toBeVisible();
        await expect(page.getByText('Cloud & Platform Engineering').first()).toBeVisible();
        await expect(page.getByText('Product Engineering').first()).toBeVisible();
        await expect(page.getByText('Data & Integration').first()).toBeVisible();
    });

    test('Products & Platforms preview shows featured products', async ({ page }) => {
        await expect(page.getByText('Products & Platforms').first()).toBeVisible({ timeout: 10000 });
        await expect(page.getByText(/Healthezee/i).first()).toBeVisible();
        await expect(page.getByText(/StockSteward/i).first()).toBeVisible();
        await expect(page.getByText(/StoreAI/i).first()).toBeVisible();
        await expect(page.getByText(/EduPortal/i).first()).toBeVisible();
        await expect(page.getByText(/CogniHRMS/i).first()).toBeVisible();
    });

    test('Case Studies section shows key case studies', async ({ page }) => {
        await expect(page.getByText('Selected Case Studies').first()).toBeVisible({ timeout: 10000 });
        await expect(page.getByRole('heading', { name: 'Large-Scale Healthcare EHR Transformation' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Cloud Transformation' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'AI-Powered IT Operations' })).toBeVisible();
    });

    test('"View All Case Studies" navigates to /case-studies', async ({ page }) => {
        await page.getByRole('link', { name: /View All Case Studies/i }).click();
        await expect(page).toHaveURL('/case-studies');
    });

    test('About section shows stats and "Learn More About Us" navigates to /who-we-are', async ({ page }) => {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await expect(page.getByText('25+').first()).toBeVisible({ timeout: 10000 });
        await expect(page.getByText('40+').first()).toBeVisible({ timeout: 10000 });
        await page.getByRole('link', { name: /Learn More About Us/i }).click();
        await expect(page).toHaveURL('/who-we-are');
    });

    test('Hero "Explore Our Products" navigates to /products', async ({ page }) => {
        await page.getByRole('link', { name: /Explore Our Products/i }).first().click();
        await expect(page).toHaveURL('/products');
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
});
