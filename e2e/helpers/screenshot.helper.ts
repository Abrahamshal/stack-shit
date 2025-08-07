import { Page } from '@playwright/test';

export interface ScreenshotOptions {
  maxHeight?: number;
  maxWidth?: number;
  sectionSelector?: string;
  fileName?: string;
}

const MAX_DIMENSION = 8000;
const SAFE_MAX_HEIGHT = 7500; // Leave buffer for safety

export class ScreenshotHelper {
  static async takeViewportScreenshot(
    page: Page,
    options: ScreenshotOptions = {}
  ) {
    const { 
      maxHeight = SAFE_MAX_HEIGHT,
      maxWidth = MAX_DIMENSION,
      sectionSelector,
      fileName = `screenshot-${Date.now()}.png`
    } = options;

    if (sectionSelector) {
      // Take screenshot of specific section
      const element = page.locator(sectionSelector);
      await element.scrollIntoViewIfNeeded();
      
      // Get element dimensions
      const box = await element.boundingBox();
      if (!box) throw new Error(`Element ${sectionSelector} not found`);
      
      // Check if dimensions exceed limits
      if (box.height > maxHeight || box.width > maxWidth) {
        console.warn(`Element dimensions exceed limits: ${box.width}x${box.height}`);
        // Take viewport screenshot instead
        return await page.screenshot({ 
          path: `screenshots/${fileName}`,
          clip: {
            x: box.x,
            y: box.y,
            width: Math.min(box.width, maxWidth),
            height: Math.min(box.height, maxHeight)
          }
        });
      }
      
      return await element.screenshot({ path: `screenshots/${fileName}` });
    }
    
    // Take full viewport screenshot
    const viewport = page.viewportSize();
    if (!viewport) throw new Error('No viewport size set');
    
    return await page.screenshot({ 
      path: `screenshots/${fileName}`,
      fullPage: false // Always use viewport to avoid dimension issues
    });
  }

  static async takeSectionScreenshots(
    page: Page,
    sections: { selector: string; name: string }[]
  ) {
    const screenshots = [];
    
    for (const section of sections) {
      try {
        const screenshot = await this.takeViewportScreenshot(page, {
          sectionSelector: section.selector,
          fileName: `${section.name}-${Date.now()}.png`
        });
        screenshots.push({ ...section, screenshot });
      } catch (error) {
        console.error(`Failed to capture ${section.name}:`, error);
      }
    }
    
    return screenshots;
  }

  static async takeProgressiveScreenshots(
    page: Page,
    scrollStep: number = 700
  ) {
    const screenshots = [];
    const pageHeight = await page.evaluate(() => document.body.scrollHeight);
    const viewportHeight = page.viewportSize()?.height || 800;
    
    let currentPosition = 0;
    let index = 0;
    
    while (currentPosition < pageHeight) {
      await page.evaluate((y) => window.scrollTo(0, y), currentPosition);
      await page.waitForTimeout(500); // Wait for any animations
      
      const screenshot = await page.screenshot({
        path: `screenshots/progressive-${index}-${Date.now()}.png`,
        fullPage: false
      });
      
      screenshots.push({
        index,
        position: currentPosition,
        screenshot
      });
      
      currentPosition += scrollStep;
      index++;
    }
    
    return screenshots;
  }
}