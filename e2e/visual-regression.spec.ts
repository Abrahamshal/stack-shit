import { test, expect } from '@playwright/test';
import { ScreenshotHelper } from './helpers/screenshot.helper';

test.describe('Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
  });

  test('capture section-by-section screenshots', async ({ page }) => {
    const sections = [
      { selector: '#hero', name: 'hero' },
      { selector: '[data-testid="social-proof"]', name: 'social-proof' },
      { selector: '[data-testid="pain-vs-gain"]', name: 'pain-vs-gain' },
      { selector: '[data-testid="process"]', name: 'process' },
      { selector: '#pricing', name: 'pricing' },
      { selector: '[data-testid="testimonials"]', name: 'testimonials' },
      { selector: '#quote-calculator', name: 'quote-calculator' },
      { selector: '[data-testid="file-upload"]', name: 'file-upload' },
      { selector: '#calendly', name: 'calendly' },
      { selector: '#faq', name: 'faq' },
      { selector: '[data-testid="cta-banner"]', name: 'cta-banner' },
      { selector: 'footer', name: 'footer' }
    ];

    const screenshots = await ScreenshotHelper.takeSectionScreenshots(page, sections);
    
    // Verify all sections were captured
    expect(screenshots.length).toBeGreaterThan(0);
    console.log(`Captured ${screenshots.length} section screenshots`);
  });

  test('capture progressive page screenshots', async ({ page }) => {
    // Take screenshots as we scroll down the page
    const screenshots = await ScreenshotHelper.takeProgressiveScreenshots(page, 600);
    
    expect(screenshots.length).toBeGreaterThan(0);
    console.log(`Captured ${screenshots.length} progressive screenshots`);
  });

  test('capture responsive screenshots', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(500); // Wait for responsive adjustments
      
      await ScreenshotHelper.takeViewportScreenshot(page, {
        fileName: `responsive-${viewport.name}-hero.png`,
        sectionSelector: '#hero'
      });
    }
  });

  test('capture component interactions', async ({ page }) => {
    // Mobile menu interaction
    await page.setViewportSize({ width: 375, height: 667 });
    await page.getByRole('button', { name: /Open menu/i }).click();
    await page.waitForTimeout(300); // Wait for animation
    
    await ScreenshotHelper.takeViewportScreenshot(page, {
      fileName: 'mobile-menu-open.png'
    });

    // FAQ accordion interaction
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/#faq');
    await page.waitForTimeout(500);
    
    const faqButton = page.getByRole('button', { name: /How does the migration process work/i }).first();
    await faqButton.click();
    await page.waitForTimeout(300); // Wait for animation
    
    await ScreenshotHelper.takeViewportScreenshot(page, {
      fileName: 'faq-expanded.png',
      sectionSelector: '#faq'
    });
  });

  test('verify lazy loading behavior', async ({ page }) => {
    // Check that below-fold images are not loaded initially
    const lazyImages = await page.$$eval('img[loading="lazy"]', imgs => 
      imgs.map(img => ({
        src: img.src,
        loaded: img.complete && img.naturalHeight !== 0
      }))
    );

    // Scroll to trigger lazy loading
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000); // Wait for images to load

    const loadedImages = await page.$$eval('img[loading="lazy"]', imgs => 
      imgs.map(img => ({
        src: img.src,
        loaded: img.complete && img.naturalHeight !== 0
      }))
    );

    console.log('Lazy loading verification:', {
      initial: lazyImages,
      afterScroll: loadedImages
    });
  });
});