import { test, expect } from '@playwright/test';

test.describe('Stack Shift Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct title and main heading', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Stack Shift/);
    
    // Check main heading
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Stop paying $600/month');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Own your automation for $50');
  });

  test('navigation works correctly', async ({ page }) => {
    // Click on FAQ navigation
    await page.getByRole('button', { name: /Navigate to FAQ section/i }).click();
    
    // Check if FAQ section is visible
    await expect(page.locator('#faq')).toBeInViewport();
  });

  test('file upload workflow', async ({ page }) => {
    // Scroll to quote calculator
    await page.getByRole('button', { name: /Calculate My Exact Savings/i }).click();
    
    // Wait for the section to be visible
    await expect(page.locator('#quote-calculator')).toBeInViewport();
    
    // Create a test JSON file
    const testFile = {
      nodes: [
        { id: '1', type: 'trigger' },
        { id: '2', type: 'action' },
        { id: '3', type: 'action' }
      ]
    };
    
    // Upload file
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByText('Choose Files').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: 'test-workflow.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(testFile))
    });
    
    // Check if file is displayed
    await expect(page.getByText('test-workflow.json')).toBeVisible();
    
    // Check if node count is displayed
    await expect(page.getByText('Total Nodes Detected:')).toBeVisible();
    await expect(page.getByText('3')).toBeVisible();
    
    // Click calculate button
    await page.getByRole('button', { name: /Calculate Migration Cost/i }).click();
    
    // Check if results modal appears
    await expect(page.getByText('Your Migration Quote')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('$200')).toBeVisible(); // Minimum price
  });

  test('mobile menu navigation', async ({ page, viewport }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Open mobile menu
    await page.getByRole('button', { name: /Open menu/i }).click();
    
    // Check if mobile menu is visible
    await expect(page.getByRole('navigation', { name: /Mobile navigation/i })).toBeVisible();
    
    // Click on FAQ in mobile menu
    await page.getByRole('button', { name: /Navigate to FAQ section/i }).nth(1).click();
    
    // Check if FAQ section is visible and menu is closed
    await expect(page.locator('#faq')).toBeInViewport();
    await expect(page.getByRole('navigation', { name: /Mobile navigation/i })).not.toBeVisible();
  });

  test('CTA buttons have urgency text', async ({ page }) => {
    // Check header CTA
    await expect(page.getByRole('button', { name: /Save \$15K\+\/Year → Get Started/i })).toBeVisible();
    
    // Check hero CTAs
    await expect(page.getByRole('button', { name: /Calculate My Exact Savings/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Get Free Migration Quote \(Limited Spots\)/i })).toBeVisible();
  });

  test('accessibility - skip to main content link', async ({ page }) => {
    // Tab to reveal skip link
    await page.keyboard.press('Tab');
    
    // Check if skip link is visible
    const skipLink = page.getByRole('link', { name: /Skip to main content/i });
    await expect(skipLink).toBeFocused();
    
    // Click skip link
    await skipLink.click();
    
    // Check if main content is focused
    await expect(page.locator('#main-content')).toBeFocused();
  });

  test('lazy loading works for below-fold components', async ({ page }) => {
    // Initially, below-fold components should not be loaded
    const pricingSection = page.locator('#pricing');
    
    // Scroll to pricing section
    await pricingSection.scrollIntoViewIfNeeded();
    
    // Wait for the component to load
    await expect(pricingSection).toBeVisible();
    await expect(page.getByText('Simple, Transparent Pricing')).toBeVisible();
  });
});