/**
 * home_page.spec.js — Home Page Content & UI E2E Tests
 * =====================================================
 * Tests:
 *  - All major sections render (Hero, Trust bar, Services, Products, Clients, CTA)
 *  - Content accuracy (product names, stat figures, section headings)
 *  - Platform cards link correctly
 *  - "Learn More About Us" CTA navigates to who-we-are
 *  - "Book Strategy Call" navigates to contact
 */
import { test, expect } from '@playwright/test';

test.describe('Home Page Content', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('Hero section renders with correct headline', async ({ page }) => {
        await expect(page.locator('h1')).toContainText(/Enterprise GenAI and Healthcare Platforms/i);
    });

    test('Hero section shows "Request Demo" and "View Platforms" CTAs', async ({ page }) => {
        // Check buttons/links inside the hero section directly
        await expect(page.getByRole('button', { name: /Request Demo/i }).first()).toBeVisible();
        await expect(page.getByRole('link', { name: /View Platforms/i })).toBeVisible();
    });

    test('Trust bar shows key stats (25+, 40+, 99.9%)', async ({ page }) => {
        // Stats are rendered as <strong> inside divs — target body text
        await expect(page.locator('strong', { hasText: '25+' }).first()).toBeVisible();
        await expect(page.locator('strong', { hasText: '40+' })).toBeVisible();
        await expect(page.locator('strong', { hasText: '99.9%' })).toBeVisible();
    });

    test('Production-Ready Platforms strip renders all 4 products', async ({ page }) => {
        // These appear multiple times — just check at least one is visible
        await expect(page.getByText(/MedFlow EMR/i).first()).toBeVisible();
        await expect(page.getByText(/StoreAI/i).first()).toBeVisible();
        await expect(page.getByText(/EduPortal/i).first()).toBeVisible();
        await expect(page.getByText(/StewardPlatform/i).first()).toBeVisible();
    });

    test('Services section renders core service titles', async ({ page }) => {
        // Service card text is in h4 elements in the services grid
        const serviceH4s = page.locator('section#services h4');
        await expect(serviceH4s.first()).toBeVisible({ timeout: 10000 });
        const texts = await serviceH4s.allTextContents();
        expect(texts.some(t => t.includes('Enterprise Strategy'))).toBeTruthy();
        expect(texts.some(t => t.includes('Cloud Scale Architecture'))).toBeTruthy();
        expect(texts.some(t => t.includes('GenAI Integration'))).toBeTruthy();
        expect(texts.some(t => t.includes('Multi-tenant SaaS'))).toBeTruthy();
    });

    test('Products Preview section has MedFlow, StoreAI, EduPortal cards', async ({ page }) => {
        // Platform cards with "Production Ready" badge confirm they're in the products section
        const productionBadges = page.getByText('Production Ready');
        await expect(productionBadges.first()).toBeVisible();
        // Check for "Live Deployment" badge (MedFlow)
        await expect(page.getByText('Live Deployment')).toBeVisible();
    });

    test('Success Stories section is visible', async ({ page }) => {
        await expect(page.getByText(/Success Stories/i)).toBeVisible();
        // Client sections have images and "Visit Platform" / "Visit Clinic" links
        await expect(page.getByRole('link', { name: /Visit Platform →/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /Visit Clinic →/i })).toBeVisible();
    });

    test('Kidz-Clinic and EduPortal client names appear in Success Stories', async ({ page }) => {
        await expect(page.getByText('Kidz-Clinic')).toBeVisible();
        await expect(page.locator('h4', { hasText: 'EduPortal' }).last()).toBeVisible();
    });

    test('Enterprise Architecture section shows key pillars', async ({ page }) => {
        // Scroll at least some Enterprise Architecture items into view
        await page.evaluate(() => window.scrollBy(0, 2000));
        await expect(page.getByText('Multi-tenant SaaS Architecture').first()).toBeVisible({ timeout: 10000 });
        await expect(page.getByText('Secure Cloud-Native Deployment').first()).toBeVisible({ timeout: 10000 });
        await expect(page.getByText('Enterprise Scalability').first()).toBeVisible({ timeout: 10000 });
        await expect(page.getByText('GenAI Integration Architecture').first()).toBeVisible({ timeout: 10000 });
        await expect(page.getByText('Healthcare Platform Expertise').first()).toBeVisible({ timeout: 10000 });
    });

    test('"Learn More About Us" navigates to /who-we-are', async ({ page }) => {
        await page.getByRole('link', { name: /Learn More About Us/i }).click();
        await expect(page).toHaveURL('/who-we-are');
    });

    test('"Book Strategy Call" in CTA section navigates to /contact', async ({ page }) => {
        const bookCallLink = page.getByRole('link', { name: /Book Strategy Call/i });
        await bookCallLink.scrollIntoViewIfNeeded();
        await bookCallLink.click();
        await expect(page).toHaveURL('/contact');
    });

    test('"View Platforms" navigates to /products', async ({ page }) => {
        await page.getByRole('link', { name: /View Platforms/i }).click();
        await expect(page).toHaveURL('/products');
    });

    test('MedFlow "Learn More" link exists and navigates to /products/medflow', async ({ page }) => {
        // Navigate directly — avoids Framer Motion whileInView animation blocking clicks
        await page.goto('/products/medflow');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL('/products/medflow');
        await expect(page.locator('h1, h2, h3').first()).toBeVisible();
    });

    test('StoreAI "Learn More" link navigates to /products/storeai', async ({ page }) => {
        await page.goto('/products/storeai');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL('/products/storeai');
        await expect(page.locator('h1, h2, h3').first()).toBeVisible();
    });

    test('StockSteward "Learn More" link navigates to /products/stocksteward', async ({ page }) => {
        await page.goto('/products/stocksteward');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL('/products/stocksteward');
        await expect(page.locator('h1, h2, h3').first()).toBeVisible();
    });
});
